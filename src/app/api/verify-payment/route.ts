import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const bodyData = await req.json();
    
    // Support both standardized and underscore-divided keys dynamically
    const orderId = bodyData.razorpay_order_id || bodyData.order_id || bodyData.orderId;
    const paymentId = bodyData.razorpay_payment_id || bodyData.payment_id || bodyData.paymentId;
    const signature = bodyData.razorpay_signature || bodyData.signature;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required transaction validation fields (orderId, paymentId, signature).' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: 'Razorpay Key Secret is not configured on the server.' },
        { status: 500 }
      );
    }

    // Mathematical verification algorithm: HMAC-SHA256(order_id + "|" + payment_id, keySecret)
    const verificationString = orderId + '|' + paymentId;
    
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(verificationString)
      .digest('hex');

    const isAuthentic = generatedSignature === signature;

    if (isAuthentic) {
      console.log(`[RAZORPAY VERIFY-PAYMENT] Signature matches! Transaction authenticity confirmed. Order: ${orderId}`);
      return NextResponse.json({
        success: true,
        message: 'Payment verified and registered successfully.'
      });
    } else {
      console.warn(`[RAZORPAY VERIFY-PAYMENT] Signature MISMATCH! Possible transaction tampering detected. Order: ${orderId}`);
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed. Secure transaction mismatch.' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('[RAZORPAY VERIFY-PAYMENT] Route failure:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Something went wrong during signature verification' },
      { status: 500 }
    );
  }
}
