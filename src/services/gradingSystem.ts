import type { GradeMultiplier, RarityScore, CensusData, SignatureDetails } from '../types';

export class GradingSystem {
  // Based on real CGC price multipliers from market data
  private readonly GRADE_MULTIPLIERS: Record<string, number> = {
    '10.0': 5.00,    // Gem Mint - Ultra rare, museum quality
    '9.9': 3.50,     // Mint - Extremely rare
    '9.8': 2.00,     // Near Mint/Mint - Investment grade
    '9.6': 1.50,     // Near Mint+ - High grade
    '9.4': 1.25,     // Near Mint
    '9.2': 1.10,     // Near Mint-
    '9.0': 1.00,     // Very Fine/Near Mint (Base Value)
    '8.5': 0.80,     // Very Fine+
    '8.0': 0.70,     // Very Fine
    '7.5': 0.60,     // Fine/Very Fine
    '7.0': 0.50,     // Fine
    '6.0': 0.40,     // Fine-
    '5.0': 0.30,     // Very Good
    '4.0': 0.25,     // Very Good-
    '3.0': 0.20,     // Good
    '2.0': 0.15,     // Fair
    '1.0': 0.10,     // Poor
    'RAW': 0.30      // Ungraded (assumed VG condition)
  };

  // Signature Series multipliers
  private readonly SIGNATURE_MULTIPLIERS = {
    VERIFIED: 1.50,      // CGC Verified signature
    WITNESSED: 2.00,     // CGC Witnessed signature
    REMARK: 2.50,        // Signature with sketch/remark
    DECEASED: 3.00,      // Signature from deceased creator
    HISTORIC: 4.00       // Historically significant signature
  };

  // Population rarity thresholds based on CGC census
  private readonly RARITY_THRESHOLDS = {
    ULTRA_RARE: 10,      // Less than 10 copies
    VERY_RARE: 50,       // Less than 50 copies
    RARE: 250,           // Less than 250 copies
    SCARCE: 1000,        // Less than 1000 copies
    UNCOMMON: 5000,      // Less than 5000 copies
    COMMON: Infinity     // Everything else
  };

  private readonly RARITY_MULTIPLIERS = {
    ULTRA_RARE: 3.00,    // 300% premium
    VERY_RARE: 2.50,     // 250% premium
    RARE: 2.00,          // 200% premium
    SCARCE: 1.50,        // 150% premium
    UNCOMMON: 1.25,      // 125% premium
    COMMON: 1.00         // Base value
  };

  // Age-based significance multipliers
  private readonly AGE_MULTIPLIERS = {
    golden: 2.00,        // Golden Age premium
    silver: 1.50,        // Silver Age premium
    bronze: 1.25,        // Bronze Age premium
    copper: 1.10,        // Copper Age premium
    modern: 1.00         // Modern Age base
  };

  public calculateGradeMultiplier(
    grade: string,
    signatures?: SignatureDetails[]
  ): number {
    const baseMultiplier = this.GRADE_MULTIPLIERS[grade] || this.GRADE_MULTIPLIERS['RAW'];
    
    if (!signatures || signatures.length === 0) {
      return baseMultiplier;
    }

    const signatureMultiplier = signatures.reduce((total, sig) => {
      return total * (this.SIGNATURE_MULTIPLIERS[sig.type] || 1);
    }, 1);

    return baseMultiplier * signatureMultiplier;
  }

  public calculateRarityScore(census: CensusData): RarityScore {
    const totalPopulation = this.calculateTotalPopulation(census);
    const gradeDistribution = this.calculateGradeDistribution(census);
    const rarityTier = this.determineRarityTier(totalPopulation);
    const signatureRarity = this.calculateSignatureRarity(census);
    
    return {
      totalPopulation,
      gradeDistribution,
      rarityTier,
      multiplier: this.RARITY_MULTIPLIERS[rarityTier] * signatureRarity,
      significance: this.calculateSignificanceScore(census)
    };
  }

  private calculateSignatureRarity(census: CensusData): number {
    if (!census.signatures) return 1;

    const signedPopulation = census.signatures.reduce((total, sig) => {
      return total + sig.population;
    }, 0);

    const signedRatio = signedPopulation / this.calculateTotalPopulation(census);
    return 1 + (1 - signedRatio) * 0.5; // Up to 50% premium for signature rarity
  }

  private calculateTotalPopulation(census: CensusData): number {
    return Object.values(census.population).reduce((sum, count) => sum + count, 0);
  }

  private calculateGradeDistribution(census: CensusData): Record<string, number> {
    const total = this.calculateTotalPopulation(census);
    const distribution: Record<string, number> = {};

    Object.entries(census.population).forEach(([grade, count]) => {
      distribution[grade] = count / total;
    });

    return distribution;
  }

  private determineRarityTier(population: number): keyof typeof this.RARITY_MULTIPLIERS {
    if (population <= this.RARITY_THRESHOLDS.ULTRA_RARE) return 'ULTRA_RARE';
    if (population <= this.RARITY_THRESHOLDS.VERY_RARE) return 'VERY_RARE';
    if (population <= this.RARITY_THRESHOLDS.RARE) return 'RARE';
    if (population <= this.RARITY_THRESHOLDS.SCARCE) return 'SCARCE';
    if (population <= this.RARITY_THRESHOLDS.UNCOMMON) return 'UNCOMMON';
    return 'COMMON';
  }

  private calculateSignificanceScore(census: CensusData): number {
    const baseScore = this.RARITY_MULTIPLIERS[this.determineRarityTier(this.calculateTotalPopulation(census))];
    const ageMultiplier = this.AGE_MULTIPLIERS[census.age];
    const highGradeRarity = this.calculateHighGradeRarity(census);
    const signatureValue = this.calculateSignatureValue(census);
    
    return baseScore * ageMultiplier * highGradeRarity * signatureValue;
  }

  private calculateSignatureValue(census: CensusData): number {
    if (!census.signatures) return 1;

    return census.signatures.reduce((value, sig) => {
      const multiplier = this.SIGNATURE_MULTIPLIERS[sig.type];
      const rarity = 1 - (sig.population / this.calculateTotalPopulation(census));
      return value * (1 + (multiplier - 1) * rarity);
    }, 1);
  }

  private calculateHighGradeRarity(census: CensusData): number {
    const highGrades = ['10.0', '9.9', '9.8', '9.6'];
    const highGradeCount = highGrades.reduce((sum, grade) => 
      sum + (census.population[grade] || 0), 0);
    
    const total = this.calculateTotalPopulation(census);
    const highGradeRatio = highGradeCount / total;

    // Rarer high grades = higher multiplier
    return 1 + (1 - highGradeRatio);
  }

  public calculateNAV(
    basePrice: number,
    grade: string,
    census: CensusData,
    signatures?: SignatureDetails[]
  ): number {
    const gradeMultiplier = this.calculateGradeMultiplier(grade, signatures);
    const rarityScore = this.calculateRarityScore(census);
    const ageMultiplier = this.AGE_MULTIPLIERS[census.age];

    return basePrice * gradeMultiplier * rarityScore.multiplier * ageMultiplier;
  }

  public calculateMarketImpact(census: CensusData): number {
    const rarityScore = this.calculateRarityScore(census);
    const significance = rarityScore.significance;
    
    // Market impact increases with rarity and significance
    return Math.min(0.5, significance * rarityScore.multiplier / 10);
  }
}