import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { cartItems, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Danmark',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/checkout');
    }
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user, authLoading, navigate]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CheckoutPage',
    url: window.location.href,
  };

  if (authLoading) {
    return (
      <div className="bg-white text-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#b5a087]" />
          <p className="mt-4 text-gray-600">Kontrollerer login...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (cartItems.length === 0) {
    return (
      <div className="bg-white text-gray-900 min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Din kurv er tom</h2>
            <Link
              to="/produkter"
              className="inline-block px-6 py-3 bg-[#b5a087] text-white rounded-lg hover:bg-[#9e8a72] transition font-medium"
            >
              Gå til produkter
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerPhone: formData.phone,
          items: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image ?? null,
            printType: item.printType ?? null,
            customLogo: item.customLogo ?? null,
            decorationSide: item.decorationSide ?? null,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ukendt fejl');
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      setError('Noget gik galt. Prøv igen eller kontakt os.');
      setLoading(false);
    }
  };

  const total = getCartTotal();

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <div className="bg-white text-gray-900 min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            <Link
              to="/kurv"
              className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Tilbage til kurv
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Dine oplysninger</h2>
                    <p className="text-sm text-gray-500 mb-4">
                      Leveringsadresse indtastes på Stripes sikre betalingsside
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Fornavn *</label>
                        <input
                          type="text" name="firstName" value={formData.firstName}
                          onChange={handleChange} required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b5a087] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Efternavn *</label>
                        <input
                          type="text" name="lastName" value={formData.lastName}
                          onChange={handleChange} required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b5a087] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email" name="email" value={formData.email}
                        onChange={handleChange} required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b5a087] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon *</label>
                      <input
                        type="tel" name="phone" value={formData.phone}
                        onChange={handleChange} required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b5a087] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Land *</label>
                    <select
                      name="country" value={formData.country} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b5a087] focus:border-transparent"
                    >
                      <option value="Danmark">Danmark</option>
                      <option value="Sverige">Sverige</option>
                      <option value="Norge">Norge</option>
                    </select>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-semibold mb-1">🔒 Sikker betaling via Stripe</p>
                    <p>Du sendes videre til Stripes betalingsside, hvor du betaler med kort, Apple Pay, Google Pay eller MobilePay. Din leveringsadresse indtastes der.</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#b5a087] text-white rounded-lg hover:bg-[#9e8a72] transition font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    {loading ? 'Sender dig videre...' : `Fortsæt til betaling — ${total.toFixed(0)} kr`}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-500 mb-2">Vi accepterer</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'MobilePay'].map((m) => (
                        <span key={m} className="text-xs px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-md font-medium text-gray-600">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 sticky top-8">
                  <h2 className="text-xl font-bold text-gray-900">Ordreopsummering</h2>

                  <div className="space-y-4 border-b pb-4 max-h-96 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={`${item.productId}-${item.size}-${item.color}-${item.customLogo}`} className="flex gap-3">
                        <div className="shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                          {item.customLogo && (
                            <div className="mt-1 text-center">
                              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">✨ Design</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-sm">
                          <div className="flex justify-between mb-0.5">
                            <span className="font-medium text-gray-900 pr-2">{item.name}</span>
                            <span className="text-gray-600 whitespace-nowrap font-semibold">{(item.price * item.quantity).toFixed(0)} kr</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.quantity}× — {item.size} / {item.color}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {item.price.toFixed(0)} kr/stk
                            {item.decorationSide && <span className="ml-1 text-blue-500">• {item.decorationSide === 'front' ? 'Forside' : 'Bagside'}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{total.toFixed(0)} kr</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Forsendelse</span>
                      <span className="text-green-600 font-medium">Gratis</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Moms</span>
                      <span>Inkluderet</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>I alt</span>
                      <span>{total.toFixed(0)} kr</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Checkout;