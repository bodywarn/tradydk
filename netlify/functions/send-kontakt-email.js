const { Resend } = require('resend');

const buildKontaktHtml = ({ name, email, subject, message }) => {
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
          .section { margin-bottom: 30px; }
          .section h2 { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 15px; border-bottom: 2px solid #e8ddd2; padding-bottom: 10px; }
          .info-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: #666; }
          .info-row strong { color: #333; }
          .message-box { background: #f5f0ea; padding: 20px; border-radius: 8px; font-size: 14px; color: #444; line-height: 1.7; white-space: pre-wrap; }
          .badge { display: inline-block; background: #b5a087; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
          .footer { background: #f5f0ea; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e8ddd2; }
          .footer a { color: #b5a087; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TRADYDK</h1>
            <p>Ny henvendelse fra kontaktformular</p>
          </div>

          <div class="content">
            <span class="badge">Ny besked</span>
            <h1 style="font-size: 26px; font-weight: 800; color: #b5a087; margin-bottom: 8px;">
              ${subject}
            </h1>
            <p style="font-size: 14px; color: #999; margin-bottom: 30px;">${currentDate}</p>

            <div class="section">
              <h2>Afsender</h2>
              <div class="info-row">
                <span>Navn:</span>
                <strong>${name}</strong>
              </div>
              <div class="info-row">
                <span>Email:</span>
                <strong><a href="mailto:${email}" style="color: #b5a087;">${email}</a></strong>
              </div>
              <div class="info-row">
                <span>Emne:</span>
                <strong>${subject}</strong>
              </div>
            </div>

            <div class="section">
              <h2>Besked</h2>
              <div class="message-box">${message}</div>
            </div>
          </div>

          <div class="footer">
            <p>Denne besked er sendt via kontaktformularen på <a href="https://tradydk.dk">tradydk.dk</a></p>
            <p style="margin-top: 10px; color: #bbb;">© ${new Date().getFullYear()} TRADYDK. Alle rettigheder forbeholdt.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const sendKontaktEmail = async ({ name, email, subject, message }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const kontaktEmail = process.env.RESEND_KONTAKT_EMAIL;

  if (!apiKey) throw new Error('Missing RESEND_API_KEY environment variable');
  if (!fromEmail) throw new Error('Missing RESEND_FROM_EMAIL environment variable');
  if (!kontaktEmail) throw new Error('Missing RESEND_KONTAKT_EMAIL environment variable');

  const resend = new Resend(apiKey);

  return await resend.emails.send({
    from: fromEmail,
    to: kontaktEmail,      
    reply_to: email,        
    subject: `Trady Kontakt: ${subject}`,
    html: buildKontaktHtml({ name, email, subject, message }),
  });
};

const handler = async (event) => {
  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Manglende felter' }),
      };
    }

    const response = await sendKontaktEmail({ name, email, subject, message });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, messageId: response.id }),
    };
  } catch (error) {
    console.error('Kontakt email fejl:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

module.exports = { handler, sendKontaktEmail };