import { NextResponse } from 'next/server';

const BACKEND_API = process.env.BACKEND_API_URL || 'https://ciuh32wky.xigrocoltd.com/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, customerEmail, paymentMethod } = body;
    
    if (!productId || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Forward to backend checkout API
    const response = await fetch(`${BACKEND_API}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SimRyoko-Web/1.0',
      },
      body: JSON.stringify({
        productId,
        customerEmail,
        paymentMethod: paymentMethod || 'stripe',
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Checkout failed' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Checkout processing failed' },
      { status: 500 }
    );
  }
}
