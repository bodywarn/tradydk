const Stripe = require('stripe');
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { sendReceiptEmail } = require('./send-order-email.js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

const handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature fejl:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    try {
      const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id);

      const orderData = {
        sessionId: session.id,
        customerEmail: session.customer_details?.email || '',
        customerName: session.metadata?.customerName || session.customer_details?.name || '',
        amountTotal: session.amount_total || 0,
        lineItems: lineItemsResponse.data.map(item => ({
          name: item.description || '',
          quantity: item.quantity || 1,
          price: item.amount_total || 0,
        })),
        shippingAddress: session.customer_details?.address ? {
          line1: session.customer_details.address.line1 || '',
          city: session.customer_details.address.city || '',
          postal_code: session.customer_details.address.postal_code || '',
          country: session.customer_details.address.country || '',
        } : null,
      };

      try {
        await sendReceiptEmail(orderData);
        console.log('Ordremail sendt til:', session.customer_details?.email);
      } catch (err) {
        console.error('Fejl ved email-afsendelse:', err);
      }

      await db.collection('stripe_orders').add({
        sessionId: session.id,
        paymentIntentId: session.payment_intent || '',
        customerEmail: session.customer_details?.email || '',
        customerName: session.metadata?.customerName || session.customer_details?.name || '',
        customerPhone: session.metadata?.customerPhone || session.customer_details?.phone || '',
        amountTotal: session.amount_total || 0,
        status: 'pending',
        stripeStatus: session.payment_status,
        lineItems: lineItemsResponse.data.map(item => ({
          name: item.description || '',
          quantity: item.quantity || 1,
          price: item.amount_total || 0,
        })),
        shippingAddress: session.customer_details?.address ? {
          line1: session.customer_details.address.line1 || '',
          city: session.customer_details.address.city || '',
          postal_code: session.customer_details.address.postal_code || '',
          country: session.customer_details.address.country || '',
        } : null,
        created_at: new Date().toISOString(),
        notes: '',
      });

      console.log('Ordre gemt i Firestore:', session.id);
    } catch (err) {
      console.error('Fejl ved ordrebehandling:', err);
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};

module.exports = { handler };
