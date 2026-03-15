import { NextResponse } from 'next/server';

const BACKEND_API = process.env.BACKEND_API_URL || 'https://ciuh32wky.xigrocoltd.com/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const type = searchParams.get('type');
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '50';
    
    // Build query string
    const params = new URLSearchParams();
    if (country) params.set('country', country);
    if (type) params.set('type', type);
    params.set('page', page);
    params.set('pageSize', pageSize);
    
    const response = await fetch(`${BACKEND_API}/products?${params.toString()}`, {
      headers: {
        'User-Agent': 'SimRyoko-Web/1.0',
      },
      next: { revalidate: 300 }, // Cache 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', list: [] },
      { status: 500 }
    );
  }
}
