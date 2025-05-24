import { NextResponse } from 'next/server';
import { PortfolioManagementService } from '@/services/portfolio/PortfolioManagementService';

const portfolioService = PortfolioManagementService.getInstance();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const portfolioId = searchParams.get('id');

    if (!portfolioId) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      );
    }

    const portfolio = await portfolioService.getPortfolio(portfolioId);
    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, tier } = await request.json();
    const portfolio = await portfolioService.createPortfolio(userId, tier);
    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
}