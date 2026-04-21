import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ugyldig data' }) };
  }

  const { action, paymentIntentId, amount } = body;

  try {
    if (action === 'refund') {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, 
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, refundId: refund.id, status: refund.status }),
      };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Ukendt handling' }) };
  } catch (err) {
    console.error('Stripe fejl:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};