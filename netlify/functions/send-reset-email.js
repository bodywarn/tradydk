const { Resend } = require('resend');
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const getBaseUrl = (event) => {
  const envUrl = process.env.BASE_URL?.replace(/\/$/, '');
  if (envUrl) return envUrl;
  const host = event.headers.host || event.headers.Host;
  const proto = event.headers['x-forwarded-proto'] || event.headers['X-Forwarded-Proto'] || 'https';
  if (!host) return null;
  return `${proto}://${host}`;
};

const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_SUPPORT_EMAIL || 'support@trady.dk';
  const baseUrl = getBaseUrl(event);

  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'RESEND_API_KEY mangler' }) };
  }
  if (!baseUrl) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Ingen base URL tilgængelig' }) };
  }

  const resend = new Resend(apiKey);

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email påkrævet' }) };
    }

    const db = getFirestore();
    const snapshot = await db.collection('profiles').where('email', '==', email).get();

    if (snapshot.empty) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true }),
      };
    }

    const resetLink = await getAuth().generatePasswordResetLink(email, {
      url: `${baseUrl}/forgotpassword`,
      handleCodeInApp: true,
    });
    const code = new URL(resetLink).searchParams.get('oobCode');
    const appResetLink = `${baseUrl}/forgotpassword?mode=resetPassword&oobCode=${encodeURIComponent(code || '')}`;

    await resend.emails.send({
      from: `Trady Support <${fromEmail}>`,
      to: email,
      subject: 'Nulstil din adgangskode – Trady',
      html: `
        <!DOCTYPE html>
        <html lang="da">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 0;">
          <div style="max-width: 480px; margin: 40px auto; background: white; border-radius: 12px; padding: 40px;">

            <div style="margin-bottom: 28px;">
              <span style="font-size: 20px; font-weight: 700; color: #111827;">Trady</span>
            </div>

            <h1 style="font-size: 22px; font-weight: 600; color: #111827; margin: 0 0 8px;">Glemt adgangskode?</h1>
            <p style="color: #6b7280; margin: 0 0 24px; line-height: 1.6;">
              Vi har modtaget en anmodning om at nulstille adgangskoden til din konto.
              Klik på knappen herunder for at vælge en ny adgangskode.
            </p>

            <a href="${appResetLink}"
               style="display: inline-block; background: #2563eb; color: white; padding: 13px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin-bottom: 24px;">
              Nulstil adgangskode
            </a>

            <p style="color: #9ca3af; font-size: 13px; margin: 0 0 24px; line-height: 1.5;">
              Hvis knappen ikke virker, kan du kopiere dette link ind i din browser:<br>
              <span style="color: #2563eb; word-break: break-all;">${appResetLink}</span>
            </p>

            <p style="color: #d1d5db; font-size: 13px; margin: 0;">
              Hvis du ikke har bedt om dette, kan du se bort fra denne email. Din adgangskode forbliver uændret.
            </p>

            <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 28px 0 20px;">

            <p style="color: #d1d5db; font-size: 12px; margin: 0; text-align: center;">
              Trady · <a href="mailto:support@trady.dk" style="color: #d1d5db;">support@trady.dk</a>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Reset email fejl:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error?.message || 'Ukendt fejl' }),
    };
  }
};

module.exports = { handler };