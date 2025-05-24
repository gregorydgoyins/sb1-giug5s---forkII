# Panel Profits - Comic Book Trading Platform

Panel Profits is a virtual stock exchange platform for comic books, creators, and comic-related properties.

## Component Structure

### Layout (`Layout.tsx`)
- Main layout wrapper with navigation
- Includes user balance display and navigation menu
- Uses glass-morphism effect for modern UI

### Dashboard (`Dashboard.tsx`)
- Main grid layout organizing all dashboard components
- Responsive design with different layouts for mobile/desktop

### Market Overview (`MarketOverview.tsx`)
- Real-time market statistics
- Interactive price chart using Recharts
- Top gainers and losers display
- Key market metrics (volume, active stocks, trend)

### Portfolio (`Portfolio.tsx`)
- User's holdings overview
- Portfolio value and daily change
- Detailed holdings table with profit/loss
- Performance metrics

### Trending Stocks (`TrendingStocks.tsx`)
- List of trending comic assets
- Price movement indicators
- Quick trade access

### News Section (`NewsSection.tsx`)
- Latest comic industry news
- Market impact indicators
- Timestamp and summary display

## Styling

- **Fonts**:
  - Headers: Oswald (modern, bold headlines)
  - Body: Hind (clean, readable text)
  
- **Design Elements**:
  - Glass-morphism effects
  - Gradient backgrounds
  - Modern card layouts
  - Responsive grid system
  
- **Color Scheme**:
  - Primary: Indigo (#4F46E5)
  - Secondary: Purple (#7C3AED)
  - Accent colors for indicators
  - Clean white/gray for content areas

## Features

1. **Real-time Trading**
   - Buy/Sell comic assets
   - Track portfolio performance
   - Monitor market trends

2. **Market Analysis**
   - Price charts
   - Volume indicators
   - Trend analysis

3. **News Integration**
   - Industry updates
   - Market impact assessment
   - Real-time notifications

4. **Portfolio Management**
   - Holdings overview
   - Performance tracking
   - Profit/Loss calculation