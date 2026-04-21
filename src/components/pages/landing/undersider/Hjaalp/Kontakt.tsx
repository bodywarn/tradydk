import { useState, type FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
}

const Kontakt = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consent: false,
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/.netlify/functions/send-kontakt-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          consent: false,
        });

        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <main className="grow">
        <section className="bg-linear-to-br from-gray-50 to-gray-100 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Kontakt os
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Vi er her for at hjælpe dig. Kontakt os, og vi vender tilbage så hurtigt som muligt
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send os en besked
              </h2>
              <p className="text-gray-600 mb-8">
                Udfyld formularen nedenfor, så vender vi tilbage til dig hurtigst muligt.
                Vi bestræber os på at svare inden for 24 timer på hverdage.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Navn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Dit fulde navn"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="din@email.dk"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                    Emne <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Vælg et emne</option>
                    <option value="Spørgsmål om ordre">Spørgsmål om ordre</option>
                    <option value="Hjælp til design">Hjælp til design</option>
                    <option value="Produktspørgsmål">Produktspørgsmål</option>
                    <option value="Levering og forsendelse">Levering og forsendelse</option>
                    <option value="Retur og reklamation">Retur og reklamation</option>
                    <option value="Samarbejde">Samarbejde</option>
                    <option value="Andet">Andet</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Besked <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    rows={6}
                    className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Skriv din besked her..."
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="mt-1 mr-3 h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-600">
                    Jeg accepterer at Trady behandler mine personoplysninger i henhold til{' '}
                    <a href="/privatlivspolitik" className="text-blue-600 hover:text-blue-800 underline">
                      privatlivspolitikken
                    </a>
                    .
                  </label>
                </div>

                {status === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    <p className="font-semibold">✓ Besked sendt!</p>
                    <p className="text-sm mt-1">Tak for din henvendelse. Vi vender tilbage hurtigst muligt.</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    <p className="font-semibold">✗ Noget gik galt</p>
                    <p className="text-sm mt-1">Der opstod en fejl. Prøv venligst igen eller kontakt os på kontakt@trady.dk</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#b5a087] text-white font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Sender...' : 'Send besked'}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Kontaktinformation
              </h2>

              <div className="space-y-8">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="shrink-0 w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">E-mail</h3>
                      <a
                        href="mailto:kontakt@trady.dk"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        kontakt@trady.dk
                      </a>
                      <p className="text-gray-600 text-sm mt-2">
                        Vi svarer normalt inden for 24 timer på hverdage
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="shrink-0 w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ofte stillede spørgsmål</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Find svar på de mest almindelige spørgsmål
                      </p>
                      <a
                        href="/faq"
                        className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                      >
                        Gå til FAQ →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Brug for hurtig hjælp?
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Tjek vores hjælpecenter for svar på almindelige spørgsmål om ordrer, design,
                  levering og meget mere. Du kan ofte finde svaret med det samme.
                </p>
              </div>
            </div>
          </div>

          <section className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Hvordan kan vi hjælpe dig?
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ordrestatus
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Tjek status på din ordre og se forventet leveringstid
                </p>
                <a href="/order-status" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Spor din ordre →
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Retur & Reklamation
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Læs om vores returpolitik og reklamationsret
                </p>
                <a href="/Retur-Reklamation" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Læs mere →
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Design hjælp
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Få hjælp til at designe det perfekte produkt
                </p>
                <a href="/design-guide" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Se designguide →
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Faktura & Kvittering
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Få adgang til dine fakturaer og kvitteringer
                </p>
                <a href="/Faktura" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Min konto →
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Samarbejde
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Interesseret i at samarbejde med Trady?
                </p>
                <a href="/Samarbejde" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Læs mere →
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Priser & Betaling
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Se vores priser og betalingsmuligheder
                </p>
                <a href="/priser" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Se priser →
                </a>
              </div>
            </div>
          </section>

          <div className="mt-16 bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vi er her for at hjælpe
            </h3>
            <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Vores dedikerede kundeservice team er klar til at besvare dine spørgsmål og hjælpe
              dig med alt fra ordrer til design. Vi bestræber os på at give dig den bedste oplevelse
              og svarer normalt inden for 24 timer på hverdage.
            </p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Kontakt;