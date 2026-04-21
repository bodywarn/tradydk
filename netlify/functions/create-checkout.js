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

  const { items, customerEmail, customerName, customerPhone } = body;

  if (!items || items.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ingen produkter i kurven' }) };
  }

  const lineItems = items.map((item) => {
    const descParts = []
    if (item.color) descParts.push(`Farve: ${item.color}`)
    if (item.size && item.size !== 'Ingen størrelse') descParts.push(`Størrelse: ${item.size}`)
    const description = descParts.join(' · ') || undefined

    return {
      price_data: {
        currency: 'dkk',
        product_data: {
          name: item.name,
          description,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }
  });

  const itemsMetadata = items.map(item => ({
    name: item.name,
    color: item.color || '',
    size: item.size || '',
    image: item.image || '',
    price: item.price,
    quantity: item.quantity,
    hasCustomLogo: item.customLogo ? true : false,
    decorationSide: item.decorationSide || '',
  }))

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'mobilepay'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['DK', 'SE', 'NO'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'dkk' },
            display_name: 'Gratis forsendelse',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 11 },
              maximum: { unit: 'business_day', value: 63 },
            },
          },
        },
      ],
      success_url: `${process.env.BASE_URL}/ordre-bekraeftelse?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/kurv`,
      locale: 'da',
      metadata: {
        customerName: customerName || '',
        customerPhone: customerPhone || '',
        items: JSON.stringify(itemsMetadata).slice(0, 490),
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe fejl:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};