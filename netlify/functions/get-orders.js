import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.payment_intent'],
    });

    const orders = await Promise.all(
      sessions.data
        .filter(session => session.payment_status === 'paid')
        .map(async (session) => {
          let lineItems = []
          try {
            const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
            lineItems = items.data
          } catch (e) {
            console.error('Kunne ikke hente line items:', e.message)
          }

          return {
            sessionId: session.id,
            paymentIntentId: typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id || '',
            customerEmail: session.customer_details?.email || '',
            customerName: session.metadata?.customerName || session.customer_details?.name || '',
            customerPhone: session.metadata?.customerPhone || '',
            amountTotal: session.amount_total || 0,
            stripeStatus: session.payment_status,
            lineItems: lineItems.map(item => ({
              name: item.description || '',
              description: '', 
              image: '',       
              quantity: item.quantity || 1,
              price: item.amount_total || 0,
            })),
            shippingAddress: session.customer_details?.address ? {
              line1: session.customer_details.address.line1 || '',
              city: session.customer_details.address.city || '',
              postal_code: session.customer_details.address.postal_code || '',
              country: session.customer_details.address.country || '',
            } : null,
            created_at: new Date(session.created * 1000).toISOString(),
          };
        })
    );

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders }),
    };
  } catch (err) {
    console.error('Stripe get-orders fejl:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};