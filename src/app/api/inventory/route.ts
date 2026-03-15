import { NextResponse } from 'next/server';

const BACKEND_API = process.env.BACKEND_API_URL || 'https://ciuh32wky.xigrocoltd.com/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing product id' },
        { status: 400 }
      );
    }
    
    const response = await fetch(`${BACKEND_API}/inventory/${id}`, {
      headers: {
        'User-Agent': 'SimRyoko-Web/1.0',
      },
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Inventory API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory', available: false },
      { status: 500 }
    );
  }
}
