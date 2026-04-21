const { sendReceiptEmail } = require('./send-order-email.js');

const handler = async (event) => {
  try {
    const email = event.queryStringParameters?.email || 'test@example.com';
    const testData = {
      sessionId: `test_${Date.now()}`,
      customerEmail: email,
      customerName: 'Test Kunde',
      amountTotal: 199900,
      lineItems: [
        { name: 'Test Produkt', quantity: 1, price: 199900 },
      ],
      shippingAddress: {
        line1: 'Testgade 1',
        city: 'København',
        postal_code: '1000',
        country: 'DK',
      },
    };

    const response = await sendReceiptEmail(testData);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Test email sendt!',
        sentTo: email,
        messageId: response.id,
      }),
    };
  } catch (error) {
    console.error('Test email fejl:', error);
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

