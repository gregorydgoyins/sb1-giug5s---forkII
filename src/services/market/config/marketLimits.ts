export const MARKET_LIMITS = {
  trading: {
    minOrderSize: 100,         // Minimum order size in CC
    maxOrderSize: 1000000,     // Maximum order size in CC
    maxLeverage: 5,            // Maximum leverage ratio
    marginRequirement: 0.20,   // 20% margin requirement
    maxPositionSize: 2500000,  // Maximum position size in CC
    dailyVolumeLimit: 5000000  // Daily trading volume limit in CC
  },

  options: {
    minStrike: 100,            // Minimum strike price in CC
    maxStrike: 10000,          // Maximum strike price in CC
    maxExpiry: 365,            // Maximum days to expiration
    marginRequirement: 0.50,   // 50% margin requirement for writing options
    maxContractSize: 100       // Maximum contracts per order
  },

  funds: {
    minInvestment: 10000,      // Minimum investment in CC
    maxInvestment: 5000000,    // Maximum investment in CC
    redemptionLimit: 1000000,  // Daily redemption limit in CC
    maxConcentration: 0.25     // Maximum single holding concentration
  },

  risk: {
    maxDrawdown: 0.20,         // Maximum portfolio drawdown
    varLimit: 0.15,            // Value at Risk limit
    stressTestThreshold: 0.30, // Stress test loss threshold
    correlationLimit: 0.70     // Maximum correlation between assets
  }
};