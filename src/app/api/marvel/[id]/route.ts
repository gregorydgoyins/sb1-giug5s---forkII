import { NextResponse } from 'next/server';
import { MarvelApiClient } from '@/services/marvel/MarvelApiClient';

const marvelClient = MarvelApiClient.getInstance();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const character = await marvelClient.getCharacter(params.id);
    return NextResponse.json(character);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Marvel character' },
      { status: 500 }
    );
  }
}