import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  const sessionId = event.queryStringParameters?.session_id;

  if (!sessionId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Mangler session_id' }) };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details'],
    });

    const lineItems = session.line_items?.data.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      amount: item.amount_total,
    })) || [];

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerEmail: session.customer_details?.email || '',
        customerName: session.customer_details?.name || '',
        amountTotal: session.amount_total,
        lineItems,
        shippingAddress: session.customer_details?.address || null,
      }),
    };
  } catch (err) {
    console.error('Stripe session fejl:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};