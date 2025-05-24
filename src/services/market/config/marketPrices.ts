export const MARKET_PRICES = {
  // Comic Books (Key Issues)
  comics: {
    'ASM300': 2500.00,  // Amazing Spider-Man #300
    'BAT457': 1800.00,  // Batman #457
    'XMN141': 3200.00,  // X-Men #141
    'SPWN1': 1200.00,   // Spawn #1
    'DTKR1': 2800.00    // Dark Knight Returns #1
  },

  // Creator Stocks
  creators: {
    'TMFS': 2500.00,    // Todd McFarlane
    'SLES': 3500.00,    // Stan Lee (Legacy)
    'JLES': 2200.00,    // Jim Lee
    'DCTS': 1800.00,    // Donny Cates
    'ARTS': 1500.00     // Stanley "Artgerm" Lau
  },

  // Publisher Bonds
  publishers: {
    'MRVLB': 3500.00,   // Marvel Entertainment Bond
    'DCCB': 3200.00,    // DC Comics Bond
    'IMGC': 1800.00,    // Image Comics Bond
    'DKHB': 1500.00,    // Dark Horse Bond
    'BOOMB': 1200.00    // BOOM! Studios Bond
  },

  // Options Base Prices
  options: {
    'ASM300C': 150.00,  // ASM #300 Call
    'ASM300P': 120.00,  // ASM #300 Put
    'TMFSC': 95.00,     // Todd McFarlane Call
    'TMFSP': 75.00,     // Todd McFarlane Put
    'MRVLC': 180.00,    // Marvel Call
    'MRVLP': 140.00     // Marvel Put
  },

  // Mutual Funds
  funds: {
    'HERO': 2500000.00,    // Superhero Universe Fund
    'VILL': 2200000.00,    // Villain Collection Fund
    'GOLD': 5000000.00,    // Golden Age Classics Fund
    'MODX': 1500000.00,    // Modern Age Index Fund
    'CRTF': 2800000.00     // Creator Focus Fund
  }
};

export const PRICE_MULTIPLIERS = {
  grades: {
    '10.0': 5.00,    // Gem Mint
    '9.9': 3.50,     // Mint
    '9.8': 2.00,     // Near Mint/Mint
    '9.6': 1.50,     // Near Mint+
    '9.4': 1.25,     // Near Mint
    '9.2': 1.10,     // Near Mint-
    '9.0': 1.00,     // Very Fine/Near Mint (Base)
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
    'RAW': 0.30      // Ungraded
  },

  signatures: {
    'VERIFIED': 1.50,      // CGC Verified signature
    'WITNESSED': 2.00,     // CGC Witnessed signature
    'REMARK': 2.50,        // Signature with sketch/remark
    'DECEASED': 3.00,      // Signature from deceased creator
    'HISTORIC': 4.00       // Historically significant signature
  },

  age: {
    'golden': 2.00,        // Golden Age premium
    'silver': 1.50,        // Silver Age premium
    'bronze': 1.25,        // Bronze Age premium
    'copper': 1.10,        // Copper Age premium
    'modern': 1.00         // Modern Age base
  }
};

export const MARKET_FEES = {
  trading: {
    maker: 0.001,          // 0.1% maker fee
    taker: 0.002,          // 0.2% taker fee
    settlement: 0.0005     // 0.05% settlement fee
  },
  
  options: {
    exercise: 0.002,       // 0.2% exercise fee
    assignment: 0.001,     // 0.1% assignment fee
    expiration: 0.0005     // 0.05% expiration fee
  },

  funds: {
    management: 0.015,     // 1.5% annual management fee
    performance: 0.10,     // 10% performance fee
    redemption: 0.005      // 0.5% redemption fee
  }
};