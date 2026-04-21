import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, User, ShoppingBag, Printer, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';

interface SessionData {
  customerEmail: string;
  customerName: string;
  amountTotal: number;
  lineItems: {
    description: string;
    quantity: number;
    amount: number;
  }[];
  shippingAddress: {
    line1: string;
    city: string;
    postal_code: string;
    country: string;
  } | null;
}

const OrdreBekraeftelse: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const generateOrderNumber = (id: string) => {
    return `ORD-${new Date().getFullYear()}-${id.slice(0, 8).toUpperCase()}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResendEmail = async () => {
    if (!sessionId) return;
    setResending(true);
    setResendMessage(null);
    try {
      const res = await fetch('/.netlify/functions/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setResendMessage('Email sendt igen!');
      } else {
        setResendMessage(`Fejl: ${data.error}`);
      }
    } catch (error) {
      setResendMessage('Kunne ikke sende email igen. Prøv igen senere.');
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    clearCart();

    const fetchSession = async () => {
      if (!sessionId) { setLoading(false); return; }
      try {
        const res = await fetch(`/.netlify/functions/get-session?session_id=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data);
        }
      } catch (err) {
        console.error('Kunne ikke hente session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#b5a087]" />
          <p className="mt-4 text-gray-600">Henter din ordre...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">

        <div className="flex justify-between items-center mb-6 print:hidden">
          <h1 className="text-2xl font-bold text-gray-900">Ordrebekræftelse</h1>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium"
          >
            <Printer className="w-4 h-4" />
            Print/Gem som PDF
          </button>
        </div>

        <div ref={receiptRef} className="bg-white shadow-lg">

          <div style={{ background: 'linear-gradient(to right, #b5a087, #9e8a72)' }} className="text-white px-8 py-12 text-center">
            <h1 className="text-4xl font-bold mb-2">TRADYDK</h1>
            <p className="text-white/80 text-sm tracking-wide">Personaliserede produkter til din virksomhed</p>
          </div>

          <div className="p-8">

            <div className="text-center mb-10 pb-8 border-b border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tak for din ordre!</h2>
              <p className="text-gray-600">Din betaling er modtaget og behandles nu</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Ordre Detaljer</h3>
                <div className="space-y-4">
                  {sessionId && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Ordre nummer</label>
                      <p className="text-lg font-bold text-gray-900 font-mono">{generateOrderNumber(sessionId)}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Ordre dato</label>
                    <p className="text-lg font-bold text-gray-900">{new Date().toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  {session?.amountTotal && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Total betalt</label>
                      <p className="text-2xl font-bold text-[#b5a087]">{(session.amountTotal / 100).toFixed(0)} kr</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Kundeoplysninger</h3>
                <div className="space-y-3 text-sm">
                  {(session?.customerName || user?.displayName) && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Navn</label>
                      <p className="text-gray-900 font-medium">{session?.customerName || user?.displayName}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Email</label>
                    <p className="text-gray-900 font-medium break-all">{session?.customerEmail || user?.email}</p>
                  </div>
                  {session?.shippingAddress && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Leveringsadresse</label>
                      <p className="text-gray-900 font-medium">
                        {session.shippingAddress.line1}<br />
                        {session.shippingAddress.postal_code} {session.shippingAddress.city}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 my-10"></div>

            {session?.lineItems && session.lineItems.length > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Bestilte Produkter</h3>
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Beskrivelse</th>
                        <th className="text-center py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Antal</th>
                        <th className="text-right py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Pris</th>
                      </tr>
                    </thead>
                    <tbody>
                      {session.lineItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-4 text-sm text-gray-700 font-medium">{item.description}</td>
                          <td className="py-4 text-center text-sm text-gray-700">{item.quantity} stk</td>
                          <td className="py-4 text-right text-sm font-bold text-gray-900">{(item.amount / 100).toFixed(0)} kr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 space-y-2 border-t-2 border-gray-200 pt-6">
                  <div className="flex justify-between text-gray-600">
                    <span className="text-sm">Subtotal</span>
                    <span className="text-sm">{session?.amountTotal ? `${((session.amountTotal * 0.95) / 100).toFixed(0)} kr` : '-'}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-sm">Forsendelse</span>
                    <span className="text-sm font-medium text-green-600">Gratis</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 bg-[#f5f0ea] -mx-8 px-8 py-4 mt-4">
                    <span>Total</span>
                    <span>{session?.amountTotal ? `${(session.amountTotal / 100).toFixed(0)} kr` : '-'}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[#f5f0ea] border-2 border-[#e8ddd2] rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#b5a087]" />
                Hvad sker der nu?
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-[#b5a087] min-w-6">1.</span>
                  <span>Ordrebekræftelse sendes til din email inden kort tid</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#b5a087] min-w-6">2.</span>
                  <span>Vi sender et korrekturprint til godkendelse (inden 1–3 arbejdsdage)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#b5a087] min-w-6">3.</span>
                  <span>Efter godkendelse starter produktion (5–15 arbejdsdage)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#b5a087] min-w-6">4.</span>
                  <span>Ordren sendes direkte til din adresse (2–5 arbejdsdage)</span>
                </li>
              </ol>
            </div>

            <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-500 space-y-2">
              <p>Tak fordi du valgte TRADYDK til dine personaliserede produkter</p>
              <p>Spørgsmål? Kontakt os på support@tradydk.dk eller se vores FAQ</p>
              <p className="pt-2 text-gray-400">Denne receipt er genereret automatisk og behøver ikke underskrift</p>
            </div>

          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 print:hidden">
          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="w-5 h-5" />
            {resending ? 'Sender...' : 'Send email igen'}
          </button>
          {resendMessage && (
            <p className="text-sm text-center text-gray-600 mt-2">{resendMessage}</p>
          )}
          <Link
            to="/konto"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#b5a087] text-white rounded-xl hover:bg-[#9e8a72] transition font-bold"
          >
            <User className="w-5 h-5" />
            Min konto
          </Link>
          <Link
            to="/produkter"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
          >
            <ShoppingBag className="w-5 h-5" />
            Fortsæt shopping
          </Link>
        </div>

      </div>

      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none; }
          .bg-gray-50 { background: white; }
          .shadow-lg { box-shadow: none; }
          a { color: #1f2937; text-decoration: none; }
          html, body { margin: 0; padding: 0; }
          .max-w-3xl { max-width: 100%; }
          .px-4 { padding: 0; }
          .py-8 { padding: 0; }
        }
      `}</style>
    </div>
  );
};

export default OrdreBekraeftelse;