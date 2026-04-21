const { sendOrderEmail } = require('./send-order-email.js');

const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { sessionId, emailType } = JSON.parse(event.body);

    if (!sessionId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Session ID required' }),
      };
    }

    const sessionRes = await fetch(`${process.env.BASE_URL}/.netlify/functions/get-session?session_id=${sessionId}`);
    if (!sessionRes.ok) {
      throw new Error('Could not fetch session data');
    }

    const sessionData = await sessionRes.json();
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
      emailType: emailType || 'order-confirmation',
    };

    const response = await sendOrderEmail(orderData);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        messageId: response.id,
      }),
    };
  } catch (error) {
    console.error('Order status email fejl:', error);
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