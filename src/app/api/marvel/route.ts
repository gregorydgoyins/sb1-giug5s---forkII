```typescript
import { NextResponse } from 'next/server';
import { CharacterService } from '@/modules/superhero/services/CharacterService';

const characterService = CharacterService.getInstance();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      name: searchParams.get('name') || undefined,
      type: searchParams.get('type') as any,
      status: searchParams.get('status') as any,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0')
    };

    const characters = await characterService.searchCharacters(params);
    return NextResponse.json(characters);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
}

export async function GET_CHARACTER(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Character ID is required' },
        { status: 400 }
      );
    }

    const character = await characterService.getCharacter(id);
    return NextResponse.json(character);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch character details' },
      { status: 500 }
    );
  }
}
```