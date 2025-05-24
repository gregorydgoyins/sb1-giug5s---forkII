import { NextResponse } from 'next/server';
import { BiographySyncService } from '@/services/api/BiographySyncService';

const syncService = BiographySyncService.getInstance();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const type = searchParams.get('type');

    if (!symbol || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const status = await syncService.checkLinkStatus(symbol, type);
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check link status' },
      { status: 500 }
    );
  }
}