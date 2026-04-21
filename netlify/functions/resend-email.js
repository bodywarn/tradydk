const { sendReceiptEmail } = require('./send-order-email.js');

const getBaseUrl = (event) => {
  if (process.env.BASE_URL) return process.env.BASE_URL.replace(/\/$/, '');
  const proto = event.headers['x-forwarded-proto'] || event.headers['X-Forwarded-Proto'] || 'https';
  const host = event.headers.host || event.headers.Host;
  if (!host) throw new Error('Missing BASE_URL and host header to resolve function URL');
  return `${proto}://${host}`;
};

const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { sessionId } = JSON.parse(event.body);

    if (!sessionId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Session ID required' }),
      };
    }

    // Fetch session data
    const baseUrl = getBaseUrl(event);
    const sessionRes = await fetch(`${baseUrl}/.netlify/functions/get-session?session_id=${sessionId}`);
    if (!sessionRes.ok) {
      const body = await sessionRes.text();
      throw new Error(`Could not fetch session data: ${sessionRes.status} ${sessionRes.statusText} ${body}`);
    }

    const sessionData = await sessionRes.json();

    // Transform session data to match sendReceiptEmail format
    const orderData = {
      sessionId,
      customerEmail: sessionData.customerEmail,
      customerName: sessionData.customerName,
      amountTotal: sessionData.amountTotal,
      lineItems: sessionData.lineItems.map(item => ({
        name: item.description,
        quantity: item.quantity,
        price: item.amount,
      })),
      shippingAddress: sessionData.shippingAddress,
    };

    const response = await sendReceiptEmail(orderData);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Email sendt igen!',
        messageId: response.id,
      }),
    };
  } catch (error) {
    console.error('Resend email fejl:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};

module.exports = { handler };