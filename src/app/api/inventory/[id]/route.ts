import { NextResponse } from 'next/server';

const BACKEND_API = process.env.BACKEND_API_URL || 'https://ciuh32wky.xigrocoltd.com/api';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Product not found', available: false },
          { status: 404 }
        );
      }
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
