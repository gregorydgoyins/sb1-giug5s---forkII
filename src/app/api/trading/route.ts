import { NextResponse } from 'next/server';
import { TradingService } from '@/services/trading/TradingService';

const tradingService = TradingService.getInstance();

export async function POST(request: Request) {
  try {
    const order = await request.json();
    const result = await tradingService.placeOrder(order);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to place order' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    const orderbook = await tradingService.getOrderbook(symbol);
    return NextResponse.json(orderbook);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orderbook' },
      { status: 500 }
    );
  }
}