import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount, receipt } = await req.json();

    if (amount === undefined || amount === null) {
      return NextResponse.json(
        { error: 'Amount is required.' },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(amount * 100);
    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: 'Minimum transaction amount is 100 paise (₹1.00).' },
        { status: 400 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === 'rzp_test_xxxx' || keyId.trim() === '') {
      return NextResponse.json(
        { error: 'Razorpay API credentials are not configured in environment variables.' },
        { status: 500 }
      );
    }

    console.log('[RAZORPAY CREATE-ORDER] Initializing SDK and dispatching order request...');
    const rzp = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise, // Razorpay expects amount in paise (e.g. 50000 paise for ₹500.00)
      currency: 'INR',
      receipt: receipt || `rcpt_order_${Date.now()}`
    };

    const order = await rzp.orders.create(options);
    console.log(`[RAZORPAY CREATE-ORDER] Order generated successfully. ID: ${order.id}`);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });

  } catch (error: any) {
    console.error('[RAZORPAY CREATE-ORDER] Route error:', error);
    
    // Check for auth error (401) or other Razorpay failures
    if (error.statusCode === 401 || (error.message && error.message.toLowerCase().includes('auth'))) {
      return NextResponse.json(
        { error: 'Razorpay authentication failed. Invalid API credentials.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Something went wrong during order creation' },
      { status: 500 }
    );
  }
}
