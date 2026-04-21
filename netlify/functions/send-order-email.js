const { Resend } = require('resend');

const formatPrice = (amountCents) => {
  return (amountCents / 100).toFixed(0);
};

const generateOrderNumber = (sessionId) => {
  return `ORD-${new Date().getFullYear()}-${sessionId.slice(0, 8).toUpperCase()}`;
};

const buildOrderHtml = ({ sessionId, customerEmail, customerName, amountTotal, lineItems, shippingAddress }) => {
  const orderNumber = generateOrderNumber(sessionId);
  const currentDate = new Date().toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f0ea; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(to right, #b5a087, #9e8a72); padding: 40px 20px; text-align: center; color: white; }
          .header h1 { font-size: 32px; margin-bottom: 5px; }
          .header p { font-size: 14px; opacity: 0.9; }
          .content { padding: 40px 20px; }
          .order-number { background: #f5f0ea; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; }
          .order-number label { display: block; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
          .order-number .number { font-size: 24px; font-weight: bold; color: #b5a087; font-family: monospace; }
          .section { margin-bottom: 30px; }
          .section h2 { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 15px; border-bottom: 2px solid #e8ddd2; padding-bottom: 10px; }
          .info-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: #666; }
          .info-row strong { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #f5f0ea; padding: 12px; text-align: left; font-size: 12px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8ddd2; }
          td { padding: 12px; border-bottom: 1px solid #e8ddd2; font-size: 14px; }
          td:last-child { text-align: right; }
          .totals { background: #f5f0ea; padding: 20px; border-radius: 8px; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .total-row.final { font-size: 18px; font-weight: bold; color: #b5a087; border-top: 2px solid #e8ddd2; padding-top: 12px; margin-top: 12px; }
          .steps { background: #f5f0ea; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .steps h3 { font-size: 14px; font-weight: bold; color: #333; margin-bottom: 15px; }
          .steps ol { margin-left: 20px; }
          .steps li { margin-bottom: 10px; font-size: 14px; color: #666; line-height: 1.5; }
          .notice { background: #fff8f0; border-left: 4px solid #b5a087; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px; font-size: 14px; color: #666; line-height: 1.6; }
          .notice strong { color: #333; }
          .cta-link { display: inline-block; background: #b5a087; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { background: #f5f0ea; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e8ddd2; }
          .footer a { color: #b5a087; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TRADYDK</h1>
            <p>Personaliserede produkter til din virksomhed</p>
          </div>

          <div class="content">
          <h1 style="font-size: 32px; font-weight: 800; color: #b5a087; margin-bottom: 8px; letter-spacing: -0.5px;">Bestilling modtaget</h1>
          <p style="font-size: 15px; color: #666; margin-bottom: 30px; line-height: 1.6;">Din ordre er registreret og vi er allerede i gang med at behandle den.</p>

            <div class="notice">
              <strong> Dette er ikke den endelige ordrebekræftelse</strong><br>

              Du vil modtage en endelig ordrebekræftelse på email, så snart dit design er godkendt. Dette tager normalt op til <strong>1 - 3 hverdage</strong>.
            </div>

            <div class="order-number">
              <label>Ordre nummer</label>
              <div class="number">${orderNumber}</div>
            </div>

            <div class="section">
              <h2> Ordre Detaljer</h2>
              <div class="info-row">
                <span>Ordre dato:</span>
                <strong>${currentDate}</strong>
              </div>
              <div class="info-row">
                <span>Betalt:</span>
                <strong>${formatPrice(amountTotal)} kr</strong>
              </div>
            </div>

            <div class="section">
              <h2> Kundeoplysninger</h2>
              ${customerName ? `<div class="info-row"><span>Navn:</span><strong>${customerName}</strong></div>` : ''}
              <div class="info-row">
                <span>Email:</span>
                <strong>${customerEmail}</strong>
              </div>
              ${
                shippingAddress
                  ? `
                <div class="info-row">
                  <span>Leveringsadresse:</span>
                  <strong>
                    ${shippingAddress.line1}<br>
                    ${shippingAddress.postal_code} ${shippingAddress.city}
                  </strong>
                </div>
              `
                  : ''
              }
            </div>

            <div class="section">
              <h2> Dine Produkter</h2>
              <table>
                <thead>
                  <tr>
                    <th>Beskrivelse</th>
                    <th style="text-align: center;">Antal</th>
                    <th style="text-align: right;">Pris</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItems
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td style="text-align: center;">${item.quantity} stk</td>
                      <td style="text-align: right; font-weight: bold;">${formatPrice(item.price)} kr</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>

              <div class="totals">
                <div class="total-row">
                  <span>Subtotal</span>
                  <span>${formatPrice(amountTotal * 0.95)}&nbsp;kr</span>
                </div>
                <div class="total-row">
                  <span>Forsendelse</span>
                  <span style="color: #27ae60; font-weight: bold;">Gratis</span>
                </div>
                <div class="total-row final">
                  <span>I alt betalt</span>
                  <span>${formatPrice(amountTotal)}&nbsp;kr</span>
                </div>
              </div>
            </div>

            <div class="steps">
              <h3> Hvad sker der nu?</h3>
              <ol>
                <li><strong>Korrekturprint:</strong> Vi sender et korrekturprint til din email inden 1–3 arbejdsdage</li>
                <li><strong>Godkendelse:</strong> Du godkender printet – herefter modtager du din ordrebekræftelse (op til 48 timer)</li>
                <li><strong>Produktion:</strong> Efter godkendelse starter vi produktionen (5–15 arbejdsdage)</li>
                <li><strong>Forsendelse:</strong> Din ordre sendes direkte til dig</li>
                <li><strong>Tracking:</strong> Du modtager et sporingslink når pakken er på vej</li>
              </ol>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.BASE_URL}/ordre-bekraeftelse?session_id=${sessionId}" class="cta-link">Se din ordre kvittering</a>
            </div>
          </div>

          <div class="footer">
            <p>Har du spørgsmål? Kontakt os på <a href="mailto:support@tradydk.dk">support@tradydk.dk</a></p>
            <p style="margin-top: 10px; color: #bbb;">© ${new Date().getFullYear()} TRADYDK. Alle rettigheder forbeholdt.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const buildStatusHtml = ({ sessionId, customerEmail, customerName, amountTotal, lineItems, shippingAddress, emailType }) => {
  const orderNumber = generateOrderNumber(sessionId);
  const currentDate = new Date().toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statusMap = {
    'order-confirmation': {
      title: 'Bestilling modtaget',
      intro: 'Tak for din bestilling. Vi har registreret din ordre og behandler den nu.',
      message: 'Du vil modtage den endelige ordrebekræftelse, når designet er godkendt.',
    },
    'production-complete': {
      title: 'Produktion færdig',
      intro: 'Produktion af din ordre er nu færdig.',
      message: 'Vi sender ordren videre til Danmark og opdaterer dig igen, når den er tjekket ind.',
    },
    'denmark-checked': {
      title: 'Tjekket i Danmark',
      intro: 'Din ordre er nu tjekket ind i Danmark.',
      message: 'Den er klar til levering, og vi sender dig en opdatering, når den er på vej til dig.',
    },
    'on-the-way': {
      title: 'På vej til dig',
      intro: 'Din ordre er nu på vej til dig.',
      message: 'Hold øje med din indbakke for leveringsopdateringer.',
    },
  };

  const status = statusMap[emailType] || statusMap['order-confirmation'];

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f0ea; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(to right, #b5a087, #9e8a72); padding: 40px 20px; text-align: center; color: white; }
          .header h1 { font-size: 32px; margin-bottom: 5px; }
          .header p { font-size: 14px; opacity: 0.9; }
          .content { padding: 40px 20px; }
          .order-number { background: #f5f0ea; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; }
          .order-number label { display: block; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
          .order-number .number { font-size: 24px; font-weight: bold; color: #b5a087; font-family: monospace; }
          .section { margin-bottom: 30px; }
          .section h2 { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 15px; border-bottom: 2px solid #e8ddd2; padding-bottom: 10px; }
          .info-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: #666; }
          .info-row strong { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #f5f0ea; padding: 12px; text-align: left; font-size: 12px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8ddd2; }
          td { padding: 12px; border-bottom: 1px solid #e8ddd2; font-size: 14px; }
          td:last-child { text-align: right; }
          .totals { background: #f5f0ea; padding: 20px; border-radius: 8px; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .total-row.final { font-size: 18px; font-weight: bold; color: #b5a087; border-top: 2px solid #e8ddd2; padding-top: 12px; margin-top: 12px; }
          .notice { background: #fff8f0; border-left: 4px solid #b5a087; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px; font-size: 14px; color: #666; line-height: 1.6; }
          .notice strong { color: #333; }
          .cta-link { display: inline-block; background: #b5a087; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { background: #f5f0ea; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e8ddd2; }
          .footer a { color: #b5a087; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TRADYDK</h1>
            <p>Personaliserede produkter til din virksomhed</p>
          </div>
          <div class="content">
            <h1 style="font-size: 32px; font-weight: 800; color: #b5a087; margin-bottom: 8px; letter-spacing: -0.5px;">${status.title}</h1>
            <p style="font-size: 15px; color: #666; margin-bottom: 30px; line-height: 1.6;">${status.intro}</p>
            <div class="notice">
              <strong>${status.message}</strong>
            </div>
            <div class="order-number">
              <label>Ordre nummer</label>
              <div class="number">${orderNumber}</div>
            </div>
            <div class="section">
              <h2>Ordre Detaljer</h2>
              <div class="info-row">
                <span>Ordre dato:</span>
                <strong>${currentDate}</strong>
              </div>
              <div class="info-row">
                <span>Betalt:</span>
                <strong>${formatPrice(amountTotal)} kr</strong>
              </div>
            </div>
            <div class="section">
              <h2>Kundeoplysninger</h2>
              ${customerName ? `<div class="info-row"><span>Navn:</span><strong>${customerName}</strong></div>` : ''}
              <div class="info-row">
                <span>Email:</span>
                <strong>${customerEmail}</strong>
              </div>
              ${shippingAddress ? `<div class="info-row"><span>Leveringsadresse:</span><strong>${shippingAddress.line1}<br>${shippingAddress.postal_code} ${shippingAddress.city}</strong></div>` : ''}
            </div>
            <div class="section">
              <h2>Dine Produkter</h2>
              <table>
                <thead>
                  <tr>
                    <th>Beskrivelse</th>
                    <th style="text-align: center;">Antal</th>
                    <th style="text-align: right;">Pris</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItems.map((item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td style="text-align: center;">${item.quantity} stk</td>
                      <td style="text-align: right; font-weight: bold;">${formatPrice(item.price)} kr</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          <div class="footer">
            <p>Har du spørgsmål? Kontakt os på <a href="mailto:support@tradydk.dk">support@tradydk.dk</a></p>
            <p style="margin-top: 10px; color: #bbb;">© ${new Date().getFullYear()} TRADYDK. Alle rettigheder forbeholdt.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const sendOrderEmail = async (orderData) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable');
  }

  if (!fromEmail) {
    throw new Error('Missing RESEND_FROM_EMAIL environment variable. Use a verified Resend sender address.');
  }

  if (fromEmail.endsWith('@resend.dev')) {
    throw new Error('RESEND_FROM_EMAIL is set to resend.dev. Use a verified custom domain address instead.');
  }

  const resend = new Resend(apiKey);
  const emailType = orderData.emailType || 'order-confirmation';
  const htmlContent = emailType === 'order-confirmation' ? buildOrderHtml(orderData) : buildStatusHtml(orderData);
  const subjects = {
    'order-confirmation': `Bestilling modtaget: ${generateOrderNumber(orderData.sessionId)}`,
    'production-complete': `Produktion færdig for ordre ${generateOrderNumber(orderData.sessionId)}`,
    'denmark-checked': `Tjekket i Danmark: ${generateOrderNumber(orderData.sessionId)}`,
    'on-the-way': `På vej til dig: ${generateOrderNumber(orderData.sessionId)}`,
  };

  return await resend.emails.send({
    from: fromEmail,
    to: orderData.customerEmail,
    subject: subjects[emailType] || subjects['order-confirmation'],
    html: htmlContent,
  });
};

const sendReceiptEmail = async (orderData) => {
  return sendOrderEmail({ ...orderData, emailType: 'order-confirmation' });
};

const handler = async (event) => {
  try {
    const orderData = JSON.parse(event.body);
    const response = await sendReceiptEmail(orderData);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        messageId: response.id,
      }),
    };
  } catch (error) {
    console.error('Email fejl:', error);
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

module.exports = { handler, sendReceiptEmail, sendOrderEmail };