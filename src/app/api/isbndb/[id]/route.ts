import { NextResponse } from 'next/server';
import { IsbndbClient } from '@/services/api/IsbndbClient';

const isbndbClient = IsbndbClient.getInstance();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const creator = await isbndbClient.getCreatorBiography(params.id);
    return NextResponse.json(creator);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch creator biography' },
      { status: 500 }
    );
  }
}