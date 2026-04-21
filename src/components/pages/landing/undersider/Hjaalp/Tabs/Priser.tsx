

const Priser = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <main className="grow">
        <section className="bg-linear-to-br from-gray-50 to-gray-100 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Priser & Betaling
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Se vores priser og betalingsmuligheder
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          
          <section className="mb-16 max-w-4xl mx-auto">
            <p className="text-xl text-gray-700 leading-relaxed text-center">
              Hos Trady tilbyder vi konkurrencedygtige priser på alle vores produkter uden at gå 
              på kompromis med kvaliteten. Her finder du en oversigt over vores priser og 
              betalingsmuligheder.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
              Produktpriser
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">T-shirt</h3>
                  <p className="text-gray-600 text-sm mb-4">Classic fit, 100% bomuld</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    199,-
                  </p>
                  <p className="text-gray-600 text-sm">Fra pris pr. stk.</p>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Alle farver</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Alle størrelser</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Custom design</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Polo t-shirt</h3>
                  <p className="text-gray-600 text-sm mb-4">Elegant design, bomuld</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    249,-
                  </p>
                  <p className="text-gray-600 text-sm">Fra pris pr. stk.</p>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Alle farver</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Alle størrelser</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Custom design</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Hoodie</h3>
                  <p className="text-gray-600 text-sm mb-4">Blød og varm, bomuld mix</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    399,-
                  </p>
                  <p className="text-gray-600 text-sm">Fra pris pr. stk.</p>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Alle farver</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Alle størrelser</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Custom design</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Lynlås hoodie</h3>
                  <p className="text-gray-600 text-sm mb-4">Praktisk med fuld lynlås</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    449,-
                  </p>
                  <p className="text-gray-600 text-sm">Fra pris pr. stk.</p>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Alle farver</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Alle størrelser</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Custom design</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
              <p className="text-gray-700 text-center">
                <strong>Bemærk:</strong> Priserne er fra-priser og kan variere afhængigt af design, 
                antal farver i printet og størrelse. Den endelige pris vises i indkøbskurven.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
              Mængderabat
            </h2>
            
            <p className="text-gray-700 text-center mb-8 max-w-3xl mx-auto">
              Jo flere produkter du bestiller, jo mere sparer du. Vores mængderabatter gælder 
              automatisk ved checkout.
            </p>

            <div className="max-w-3xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Antal produkter</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rabat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-gray-700">1-4 stk.</td>
                      <td className="px-6 py-4 text-gray-700">Normal pris</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-700">5-9 stk.</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">5% rabat</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-700">10-19 stk.</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">10% rabat</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-700">20-49 stk.</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">15% rabat</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-700">50+ stk.</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">Kontakt os for særpris</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
              Forsendelse
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Standard levering</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">39,-</p>
                <p className="text-gray-600 mb-4">Leveringstid: 2-4 hverdage</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>PostNord eller GLS</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>Tracking nummer inkluderet</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>Levering til pakkeshop</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Hjemmelevering</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">79,-</p>
                <p className="text-gray-600 mb-4">Leveringstid: 1-3 hverdage</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>Levering til din hoveddør</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>Tracking nummer inkluderet</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>Hurtigere levering</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 max-w-4xl mx-auto text-center">
              <p className="text-gray-700">
                <strong className="text-green-700">Gratis fragt</strong> på alle ordrer over 500 kr.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
              Betalingsmuligheder
            </h2>
            
            <p className="text-gray-700 text-center mb-8 max-w-3xl mx-auto">
              Vi accepterer følgende betalingsmuligheder. Alle transaktioner er sikre og 
              krypterede.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Dankort</h3>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Visa / Mastercard</h3>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">MobilePay</h3>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Apple Pay / Google Pay</h3>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                Sikker betaling
              </h3>
              <p className="text-gray-700 text-center text-sm">
                Alle betalinger behandles sikkert via vores betalingsudbyder. Vi gemmer ikke dine 
                kortoplysninger, og alle transaktioner er SSL-krypterede.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
              Ofte stillede spørgsmål om priser
            </h2>
            
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Er der ekstra omkostninger for komplekse designs?
                </h3>
                <p className="text-gray-700">
                  Nej, prisen er den samme uanset hvor komplekst dit design er. Du betaler kun for 
                  produktet og eventuelt ekstra for særlige printplaceringer.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Kan jeg få en rabatkode?
                </h3>
                <p className="text-gray-700">
                  Vi sender jævnligt rabatkoder ud til vores nyhedsbrevmodtagere. Tilmeld dig 
                  vores nyhedsbrev for at modtage særlige tilbud og kampagner.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Inkluderer prisen moms?
                </h3>
                <p className="text-gray-700">
                  Ja, alle priser er inklusiv dansk moms (25%). Prisen du ser i kurven, er den 
                  endelige pris du betaler.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Hvornår trækkes betalingen?
                </h3>
                <p className="text-gray-700">
                  Betalingen trækkes, når du afgiver din ordre. Vi starter først produktion, når 
                  betalingen er godkendt.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Tilbyder I fakturabetaling til virksomheder?
                </h3>
                <p className="text-gray-700">
                  Ja, vi tilbyder fakturabetaling til erhvervskunder. Kontakt os for at få oprettet 
                  en erhvervskonto med fakturabetaling.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Har du spørgsmål til priser?
            </h2>
            <p className="text-gray-700 mb-6 text-center max-w-2xl mx-auto">
              Hvis du har spørgsmål til vores priser, mængderabatter eller betalingsmuligheder, 
              er du velkommen til at kontakte os.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/kontakt"
                className="inline-block bg-[#b5a087] text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                Kontakt os
              </a>
              <a
                href="/start-design"
                className="inline-block bg-white border border-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Start design
              </a>
            </div>
          </section>
        </div>
      </main>

    </div>
  );
};

export default Priser;