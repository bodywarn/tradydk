const { Resend } = require('resend');

const formatPrice = (amountCents) => (amountCents / 100).toFixed(2).replace('.', ',');
const formatPriceRounded = (amountCents) => (amountCents / 100).toFixed(0);

const generateOrderNumber = (sessionId) => {
  const clean = (sessionId || '').replace(/^cs_(test|live)_/, '');
  return `ORD-${new Date().getFullYear()}-${clean.slice(0, 8).toUpperCase()}`;
};

const generateFakturaNumber = (sessionId) => {
  const clean = (sessionId || '').replace(/^cs_(test|live)_/, '');
  return `FAK-${new Date().getFullYear()}-${clean.slice(0, 8).toUpperCase()}`;
};

const buildOrderHtml = ({ sessionId, customerEmail, customerName, amountTotal, lineItems, shippingAddress }) => {
  const orderNumber = generateOrderNumber(sessionId);
  const currentDate = new Date().toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' });
  const subtotal = Math.round(amountTotal / 1.25);
  const moms = amountTotal - subtotal;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f0ea; }
    .container { max-width: 620px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #b5a087 0%, #9e8a72 100%); padding: 40px 32px; text-align: center; color: white; }
    .header h1 { font-size: 30px; font-weight: 800; letter-spacing: 4px; margin-bottom: 6px; }
    .header p { font-size: 13px; opacity: 0.85; letter-spacing: 1px; }
    .content { padding: 40px 32px; }
    .page-title { font-size: 28px; font-weight: 800; color: #b5a087; margin-bottom: 6px; letter-spacing: -0.5px; }
    .page-subtitle { font-size: 14px; color: #888; margin-bottom: 28px; }
    .notice { background: #fff8f0; border-left: 4px solid #b5a087; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 28px; font-size: 13px; color: #666; line-height: 1.6; }
    .notice strong { color: #333; }
    .order-badge { background: linear-gradient(135deg, #b5a087, #9e8a72); border-radius: 10px; padding: 20px 24px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; }
    .order-badge-label { font-size: 10px; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
    .order-badge-value { font-size: 20px; font-weight: 800; color: white; font-family: monospace; letter-spacing: 1px; }
    .order-badge-date { text-align: right; font-size: 13px; color: rgba(255,255,255,0.85); }
    .section { margin-bottom: 28px; }
    .section-title { font-size: 11px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; border-bottom: 1px solid #e8ddd2; padding-bottom: 8px; }
    .info-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; color: #666; }
    .info-row strong { color: #333; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; }
    thead th { background: #f5f0ea; padding: 11px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 2px solid #e8ddd2; }
    thead th:last-child { text-align: right; }
    tbody td { padding: 12px; border-bottom: 1px solid #f0ebe4; font-size: 14px; color: #444; }
    tbody td:last-child { text-align: right; font-weight: 600; color: #333; }
    .totals { background: #f9f6f2; border-radius: 8px; padding: 18px 20px; margin-top: 4px; }
    .total-row { display: flex; justify-content: space-between; font-size: 14px; color: #666; margin-bottom: 8px; }
    .total-row.final { font-size: 17px; font-weight: 800; color: #b5a087; border-top: 2px solid #e8ddd2; padding-top: 12px; margin-top: 8px; }
    .steps { background: #f9f6f2; border-radius: 10px; padding: 20px 24px; margin-bottom: 28px; }
    .steps h3 { font-size: 13px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }
    .steps ol { margin-left: 18px; }
    .steps li { margin-bottom: 9px; font-size: 13px; color: #666; line-height: 1.5; }
    .steps li strong { color: #444; }
    .cta { text-align: center; margin: 28px 0; }
    .cta a { display: inline-block; background: #b5a087; color: white; padding: 13px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; }
    .footer { background: #f5f0ea; padding: 24px 32px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #e8ddd2; }
    .footer a { color: #b5a087; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>TRADYDK</h1>
      <p>PERSONALISEREDE PRODUKTER TIL DIN VIRKSOMHED</p>
    </div>
    <div class="content">
      <div class="page-title">Bestilling modtaget</div>
      <div class="page-subtitle">Din ordre er registreret og vi er allerede i gang med at behandle den.</div>

      <div class="notice">
        <strong>Dette er ikke den endelige ordrebekræftelse</strong><br>
        Du vil modtage en endelig bekræftelse, så snart dit design er godkendt. Dette tager normalt op til <strong>1–3 hverdage</strong>.
      </div>

      <div class="order-badge">
        <div>
          <div class="order-badge-label">Ordre nummer</div>
          <div class="order-badge-value">${orderNumber}</div>
        </div>
        <div class="order-badge-date">
          <div style="font-size:10px;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Dato</div>
          ${currentDate}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Kundeoplysninger</div>
        ${customerName ? `<div class="info-row"><span>Navn</span><strong>${customerName}</strong></div>` : ''}
        <div class="info-row"><span>Email</span><strong>${customerEmail}</strong></div>
        ${shippingAddress ? `<div class="info-row"><span>Leveringsadresse</span><strong>${shippingAddress.line1}, ${shippingAddress.postal_code} ${shippingAddress.city}</strong></div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Dine produkter</div>
        <table>
          <thead>
            <tr>
              <th>Beskrivelse</th>
              <th style="text-align:center;">Antal</th>
              <th>Pris</th>
            </tr>
          </thead>
          <tbody>
            ${lineItems.map(item => `
            <tr>
              <td>${item.name}</td>
              <td style="text-align:center;">${item.quantity} stk</td>
              <td>${formatPriceRounded(item.price)} kr</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div class="totals">
          <div class="total-row"><span>Subtotal ekskl. moms</span><span>${formatPriceRounded(subtotal)} kr</span></div>
          <div class="total-row"><span>Moms (25%)</span><span>${formatPriceRounded(moms)} kr</span></div>
          <div class="total-row"><span>Forsendelse</span><span style="color:#22c55e;font-weight:700;">Gratis</span></div>
          <div class="total-row final"><span>I alt betalt</span><span>${formatPriceRounded(amountTotal)} kr</span></div>
        </div>
      </div>

      <div class="steps">
        <h3>Hvad sker der nu?</h3>
        <ol>
          <li><strong>Korrekturprint:</strong> Vi sender et korrekturprint til din email inden 1–3 arbejdsdage</li>
          <li><strong>Godkendelse:</strong> Du godkender printet – herefter modtager du din ordrebekræftelse</li>
          <li><strong>Produktion:</strong> Efter godkendelse starter vi produktionen (5–15 arbejdsdage)</li>
          <li><strong>Forsendelse:</strong> Din ordre sendes direkte til dig med sporingslink</li>
        </ol>
      </div>

      <div class="cta">
        <a href="${process.env.BASE_URL}/ordre-bekraeftelse?session_id=${sessionId}">Se din kvittering online</a>
      </div>
    </div>
    <div class="footer">
      <p>Spørgsmål? Kontakt os på <a href="mailto:support@tradydk.dk">support@tradydk.dk</a></p>
      <p style="margin-top:8px;">© ${new Date().getFullYear()} TRADYDK · Alle rettigheder forbeholdt</p>
    </div>
  </div>
</body>
</html>`;
};

const buildStatusHtml = ({ sessionId, customerEmail, customerName, amountTotal, lineItems, shippingAddress, emailType }) => {
  const orderNumber = generateOrderNumber(sessionId);
  const currentDate = new Date().toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' });
  const subtotal = Math.round(amountTotal / 1.25);
  const moms = amountTotal - subtotal;

  const statusMap = {
    'order-confirmation': {
      title: 'Bestilling modtaget',
      intro: 'Tak for din bestilling. Vi har registreret din ordre og behandler den nu.',
      message: 'Du vil modtage den endelige ordrebekræftelse, når designet er godkendt.',
    },
    'production-complete': {
      title: 'Produktion færdig',
      intro: 'Produktionen af din ordre er nu afsluttet.',
      message: 'Vi sender ordren videre til Danmark og opdaterer dig, når den er tjekket ind.',
    },
    'denmark-checked': {
      title: 'Tjekket i Danmark',
      intro: 'Din ordre er nu tjekket ind i Danmark og klar til levering.',
      message: 'Vi sender dig en opdatering, når den er på vej til dig.',
      icon: '',
    },
    'on-the-way': {
      title: 'På vej til dig',
      intro: 'Din ordre er nu på vej til din adresse.',
      message: 'Hold øje med din indbakke for leveringsopdateringer og sporingslink.',
    },
  };

  const status = statusMap[emailType] || statusMap['order-confirmation'];

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f0ea; }
    .container { max-width: 620px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #b5a087 0%, #9e8a72 100%); padding: 40px 32px; text-align: center; color: white; }
    .header h1 { font-size: 30px; font-weight: 800; letter-spacing: 4px; margin-bottom: 6px; }
    .header p { font-size: 13px; opacity: 0.85; letter-spacing: 1px; }
    .content { padding: 40px 32px; }
    .status-icon { font-size: 48px; text-align: center; margin-bottom: 12px; }
    .page-title { font-size: 28px; font-weight: 800; color: #b5a087; margin-bottom: 6px; letter-spacing: -0.5px; text-align: center; }
    .page-subtitle { font-size: 14px; color: #888; margin-bottom: 28px; text-align: center; }
    .notice { background: #fff8f0; border-left: 4px solid #b5a087; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 28px; font-size: 13px; color: #666; line-height: 1.6; }
    .notice strong { color: #333; }
    .order-badge { background: linear-gradient(135deg, #b5a087, #9e8a72); border-radius: 10px; padding: 20px 24px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; }
    .order-badge-label { font-size: 10px; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
    .order-badge-value { font-size: 20px; font-weight: 800; color: white; font-family: monospace; letter-spacing: 1px; }
    .order-badge-date { text-align: right; font-size: 13px; color: rgba(255,255,255,0.85); }
    .section { margin-bottom: 28px; }
    .section-title { font-size: 11px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; border-bottom: 1px solid #e8ddd2; padding-bottom: 8px; }
    .info-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; color: #666; }
    .info-row strong { color: #333; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; }
    thead th { background: #f5f0ea; padding: 11px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 2px solid #e8ddd2; }
    thead th:last-child { text-align: right; }
    tbody td { padding: 12px; border-bottom: 1px solid #f0ebe4; font-size: 14px; color: #444; }
    tbody td:last-child { text-align: right; font-weight: 600; color: #333; }
    .totals { background: #f9f6f2; border-radius: 8px; padding: 18px 20px; margin-top: 4px; }
    .total-row { display: flex; justify-content: space-between; font-size: 14px; color: #666; margin-bottom: 8px; }
    .total-row.final { font-size: 17px; font-weight: 800; color: #b5a087; border-top: 2px solid #e8ddd2; padding-top: 12px; margin-top: 8px; }
    .footer { background: #f5f0ea; padding: 24px 32px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #e8ddd2; }
    .footer a { color: #b5a087; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>TRADYDK</h1>
      <p>PERSONALISEREDE PRODUKTER TIL DIN VIRKSOMHED</p>
    </div>
    <div class="content">
      <div class="status-icon">${status.icon}</div>
      <div class="page-title">${status.title}</div>
      <div class="page-subtitle">${status.intro}</div>
      <div class="notice"><strong>${status.message}</strong></div>

      <div class="order-badge">
        <div>
          <div class="order-badge-label">Ordre nummer</div>
          <div class="order-badge-value">${orderNumber}</div>
        </div>
        <div class="order-badge-date">
          <div style="font-size:10px;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Dato</div>
          ${currentDate}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Kundeoplysninger</div>
        ${customerName ? `<div class="info-row"><span>Navn</span><strong>${customerName}</strong></div>` : ''}
        <div class="info-row"><span>Email</span><strong>${customerEmail}</strong></div>
        ${shippingAddress ? `<div class="info-row"><span>Leveringsadresse</span><strong>${shippingAddress.line1}, ${shippingAddress.postal_code} ${shippingAddress.city}</strong></div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Dine produkter</div>
        <table>
          <thead>
            <tr>
              <th>Beskrivelse</th>
              <th style="text-align:center;">Antal</th>
              <th>Pris</th>
            </tr>
          </thead>
          <tbody>
            ${lineItems.map(item => `
            <tr>
              <td>${item.name}</td>
              <td style="text-align:center;">${item.quantity} stk</td>
              <td>${formatPriceRounded(item.price)} kr</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div class="totals">
          <div class="total-row"><span>Subtotal ekskl. moms</span><span>${formatPriceRounded(subtotal)} kr</span></div>
          <div class="total-row"><span>Moms (25%)</span><span>${formatPriceRounded(moms)} kr</span></div>
          <div class="total-row"><span>Forsendelse</span><span style="color:#22c55e;font-weight:700;">Gratis</span></div>
          <div class="total-row final"><span>I alt betalt</span><span>${formatPriceRounded(amountTotal)} kr</span></div>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>Spørgsmål? Kontakt os på <a href="mailto:support@tradydk.dk">support@tradydk.dk</a></p>
      <p style="margin-top:8px;">© ${new Date().getFullYear()} TRADYDK · Alle rettigheder forbeholdt</p>
    </div>
  </div>
</body>
</html>`;
};

const buildFakturaHtml = ({ sessionId, customerEmail, customerName, amountTotal, lineItems, shippingAddress, fakturaNumber, cvr }) => {
  const orderNumber = generateOrderNumber(sessionId);
  const fNum = fakturaNumber || generateFakturaNumber(sessionId);
  const currentDate = new Date().toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' });
  const dueDateObj = new Date();
  dueDateObj.setDate(dueDateObj.getDate() + 14);
  const dueDate = dueDateObj.toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' });

  const subtotal = Math.round(amountTotal / 1.25);
  const moms = amountTotal - subtotal;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; background: #f5f0ea; color: #222; }
    .container { max-width: 680px; margin: 0 auto; background: white; }

    /* ── HEADER ── */
    .header { background: linear-gradient(135deg, #b5a087 0%, #8a7560 100%); padding: 36px 40px; display: flex; justify-content: space-between; align-items: center; }
    .header-brand h1 { font-size: 28px; font-weight: 900; letter-spacing: 5px; color: white; font-family: -apple-system, sans-serif; }
    .header-brand p { font-size: 11px; color: rgba(255,255,255,0.75); letter-spacing: 2px; margin-top: 3px; font-family: -apple-system, sans-serif; }
    .header-faktura { text-align: right; }
    .header-faktura .faktura-label { font-size: 32px; font-weight: 900; color: white; letter-spacing: -1px; font-family: -apple-system, sans-serif; }
    .header-faktura .faktura-num { font-size: 13px; color: rgba(255,255,255,0.85); font-family: monospace; margin-top: 4px; letter-spacing: 1px; }

    /* ── META ROW ── */
    .meta-row { background: #2c2420; display: grid; grid-template-columns: repeat(4, 1fr); }
    .meta-cell { padding: 14px 20px; border-right: 1px solid rgba(255,255,255,0.08); }
    .meta-cell:last-child { border-right: none; }
    .meta-cell .label { font-size: 9px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; font-family: -apple-system, sans-serif; }
    .meta-cell .value { font-size: 13px; color: white; font-weight: 600; font-family: -apple-system, sans-serif; }

    /* ── PARTIES ── */
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-bottom: 3px solid #b5a087; }
    .party { padding: 28px 40px; }
    .party:first-child { border-right: 1px solid #e8ddd2; }
    .party-label { font-size: 9px; color: #b5a087; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; font-family: -apple-system, sans-serif; font-weight: 700; }
    .party-name { font-size: 17px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; font-family: -apple-system, sans-serif; }
    .party-detail { font-size: 13px; color: #666; line-height: 1.7; font-family: -apple-system, sans-serif; }

    /* ── ITEMS TABLE ── */
    .items-wrap { padding: 0 40px; }
    table { width: 100%; border-collapse: collapse; margin-top: 28px; }
    thead tr { border-bottom: 2px solid #2c2420; }
    thead th { padding: 10px 12px; text-align: left; font-size: 10px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1.2px; font-family: -apple-system, sans-serif; }
    thead th.right { text-align: right; }
    tbody tr { border-bottom: 1px solid #ede8e2; }
    tbody tr:last-child { border-bottom: 2px solid #2c2420; }
    tbody td { padding: 14px 12px; font-size: 14px; color: #333; font-family: -apple-system, sans-serif; }
    tbody td.center { text-align: center; }
    tbody td.right { text-align: right; }
    tbody td.amount { text-align: right; font-weight: 700; color: #1a1a1a; }

    /* ── TOTALS ── */
    .totals-section { padding: 20px 40px 0; display: flex; justify-content: flex-end; }
    .totals-box { width: 260px; }
    .total-line { display: flex; justify-content: space-between; font-size: 13px; color: #666; padding: 7px 0; border-bottom: 1px solid #ede8e2; font-family: -apple-system, sans-serif; }
    .total-line.moms { color: #555; }
    .total-line.grand { font-size: 18px; font-weight: 900; color: #1a1a1a; padding: 14px 0 0; border-bottom: none; border-top: 3px solid #b5a087; margin-top: 6px; font-family: -apple-system, sans-serif; }
    .total-line.grand span:last-child { color: #b5a087; }

    /* ── BETALT STAMP ── */
    .stamp-row { padding: 24px 40px; display: flex; align-items: center; gap: 20px; }
    .stamp { display: inline-block; border: 3px solid #22c55e; color: #16a34a; font-size: 17px; font-weight: 900; padding: 8px 18px; border-radius: 6px; letter-spacing: 3px; transform: rotate(-4deg); font-family: -apple-system, sans-serif; }
    .stamp-note { font-size: 12px; color: #888; font-family: -apple-system, sans-serif; line-height: 1.6; }

    /* ── FOOTER ── */
    .footer-divider { height: 3px; background: linear-gradient(to right, #b5a087, #8a7560); margin: 0 40px; }
    .footer { padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }
    .footer-left { font-size: 11px; color: #aaa; font-family: -apple-system, sans-serif; line-height: 1.7; }
    .footer-right { font-size: 11px; color: #aaa; text-align: right; font-family: -apple-system, sans-serif; line-height: 1.7; }
    .footer a { color: #b5a087; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">

    <!-- HEADER -->
    <div class="header">
      <div class="header-brand">
        <h1>TRADYDK</h1>
        <p>PERSONALISEREDE PRODUKTER</p>
      </div>
      <div class="header-faktura">
        <div class="faktura-label">FAKTURA</div>
        <div class="faktura-num">${fNum}</div>
      </div>
    </div>

    <!-- META ROW -->
    <div class="meta-row">
      <div class="meta-cell">
        <div class="label">Fakturanummer</div>
        <div class="value">${fNum}</div>
      </div>
      <div class="meta-cell">
        <div class="label">Fakturadato</div>
        <div class="value">${currentDate}</div>
      </div>
      <div class="meta-cell">
        <div class="label">Betalingsdato</div>
        <div class="value">${currentDate}</div>
      </div>
      <div class="meta-cell">
        <div class="label">Ordrenummer</div>
        <div class="value">${orderNumber}</div>
      </div>
    </div>

    <!-- PARTIES -->
    <div class="parties">
      <div class="party">
        <div class="party-label">Sælger</div>
        <div class="party-name">TRADYDK</div>
        <div class="party-detail">
          tradydk.dk<br>
          support@tradydk.dk<br>
        </div>
      </div>
      <div class="party">
        <div class="party-label">Faktureres til</div>
        <div class="party-name">${customerName || customerEmail}</div>
        <div class="party-detail">
          ${customerEmail}${shippingAddress ? `<br>${shippingAddress.line1}<br>${shippingAddress.postal_code} ${shippingAddress.city}<br>${shippingAddress.country || 'DK'}` : ''}
        </div>
      </div>
    </div>

    <!-- ITEMS -->
    <div class="items-wrap">
      <table>
        <thead>
          <tr>
            <th>Beskrivelse</th>
            <th class="right" style="width:80px;">Antal</th>
            <th class="right" style="width:120px;">Stykpris</th>
            <th class="right" style="width:120px;">Beløb</th>
          </tr>
        </thead>
        <tbody>
          ${lineItems.map(item => {
            const unitPrice = item.quantity > 0 ? item.price / item.quantity : item.price;
            return `<tr>
              <td>${item.name}</td>
              <td class="center">${item.quantity} stk</td>
              <td class="right">${formatPriceRounded(unitPrice)} kr</td>
              <td class="amount">${formatPriceRounded(item.price)} kr</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- TOTALS -->
    <div class="totals-section">
      <div class="totals-box">
        <div class="total-line"><span>Subtotal</span><span>DKK ${formatPrice(subtotal)}</span></div>
        <div class="total-line moms"><span>Moms (25%)</span><span>DKK ${formatPrice(moms)}</span></div>
        <div class="total-line"><span>Forsendelse</span><span style="color:#22c55e;font-weight:700;">Gratis</span></div>
        <div class="total-line grand"><span>TOTAL</span><span>DKK ${formatPrice(amountTotal)}</span></div>
      </div>
    </div>

    <!-- STAMP -->
    <div class="stamp-row">
      <div class="stamp">BETALT</div>
      <div class="stamp-note">
        Betaling modtaget via Stripe.<br>
        Denne faktura fungerer som kvittering for din betaling.
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer-divider"></div>
    <div class="footer">
      <div class="footer-left">
        <strong style="color:#555;">TRADYDK</strong><br>
        support@tradydk.dk<br>
        tradydk.dk
      </div>
      <div class="footer-right">
        Spørgsmål til fakturaen?<br>
        <a href="mailto:support@tradydk.dk">support@tradydk.dk</a><br>
        © ${new Date().getFullYear()} TRADYDK
      </div>
    </div>

  </div>
</body>
</html>`;
};

const sendOrderEmail = async (orderData) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey) throw new Error('Missing RESEND_API_KEY');
  if (!fromEmail) throw new Error('Missing RESEND_FROM_EMAIL');
  if (fromEmail.endsWith('@resend.dev')) throw new Error('Use a verified custom domain for RESEND_FROM_EMAIL');

  const resend = new Resend(apiKey);
  const emailType = orderData.emailType || 'order-confirmation';
  const htmlContent = emailType === 'order-confirmation'
    ? buildOrderHtml(orderData)
    : buildStatusHtml(orderData);

  const orderNum = generateOrderNumber(orderData.sessionId);
  const subjects = {
    'order-confirmation':  `Bestilling modtaget: ${orderNum}`,
    'production-complete': `Produktion færdig: ${orderNum}`,
    'denmark-checked':     `Tjekket i Danmark: ${orderNum}`,
    'on-the-way':          `På vej til dig: ${orderNum}`,
  };

  return await resend.emails.send({
    from: fromEmail,
    to: orderData.customerEmail,
    subject: subjects[emailType] || subjects['order-confirmation'],
    html: htmlContent,
  });
};

const sendFakturaEmail = async (orderData) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FAKTURA_EMAIL || process.env.RESEND_FROM_EMAIL;
  if (!apiKey) throw new Error('Missing RESEND_API_KEY');
  if (!fromEmail) throw new Error('Missing RESEND_FAKTURA_EMAIL or RESEND_FROM_EMAIL');

  const resend = new Resend(apiKey);
  const fNum = generateFakturaNumber(orderData.sessionId);
  const htmlContent = buildFakturaHtml(orderData);

  return await resend.emails.send({
    from: fromEmail,
    to: orderData.customerEmail,
    subject: `Faktura ${fNum} – TRADYDK`,
    html: htmlContent,
  });
};

const sendReceiptEmail = async (orderData) => {
  return sendOrderEmail({ ...orderData, emailType: 'order-confirmation' });
};

const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  try {
    const orderData = JSON.parse(event.body);
    const emailType = orderData.emailType || 'order-confirmation';

    const response = emailType === 'faktura'
      ? await sendFakturaEmail(orderData)
      : await sendOrderEmail(orderData);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, messageId: response.id }),
    };
  } catch (error) {
    console.error('Email fejl:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

module.exports = { handler, sendReceiptEmail, sendOrderEmail, sendFakturaEmail };