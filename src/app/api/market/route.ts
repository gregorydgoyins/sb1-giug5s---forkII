import { NextResponse } from 'next/server';

const MOCK_MARKET_DATA = {
  historicalData: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
    value: 100000 + Math.random() * 50000
  }))
};

export async function GET() {
  try {
    return NextResponse.json(MOCK_MARKET_DATA);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}