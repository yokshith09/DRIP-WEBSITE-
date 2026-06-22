import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount, receipt } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: 'Order amount is required.' }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if we should run in mock/simulation mode
    const isMockMode = !keyId || !keySecret || keyId === 'rzp_test_xxxx' || keyId.trim() === '';

    if (isMockMode) {
      console.log('[CHECKOUT API] Razorpay credentials missing/placeholder. Running in checkout simulation mode...');
      // Simulate order creation delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 10)}`;
      return NextResponse.json({
        id: mockOrderId,
        amount: amount * 100, // convert INR to paise
        currency: 'INR',
        receipt: receipt || 'receipt_mock_1',
        isMock: true
      });
    }

    // Call real Razorpay API via secure fetch basic auth
    console.log('[CHECKOUT API] Creating official order with Razorpay API...');
    const authString = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency: 'INR',
        receipt: receipt || `receipt_${Date.now()}`
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('[CHECKOUT API] Razorpay order creation failed:', errBody);
      return NextResponse.json({ error: `Razorpay API error: ${errBody}` }, { status: 500 });
    }

    const orderData = await response.json();
    console.log(`[CHECKOUT API] Razorpay order created successfully: ${orderData.id}`);

    return NextResponse.json({
      id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      receipt: orderData.receipt,
      isMock: false
    });

  } catch (error: any) {
    console.error('[CHECKOUT API] Uncaught internal checkout error:', error);
    return NextResponse.json({ error: error.message || 'Failed to initialize payment gateway' }, { status: 500 });
  }
}
