

const OrderStatus = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <main className="grow">
        <section className="bg-linear-to-br from-gray-50 to-gray-100 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Spor din ordre
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Tjek status på din ordre og se forventet leveringstid
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          
          <section className="mb-16">
            <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Find din ordre
              </h2>
              <p className="text-gray-600 mb-8">
                Indtast dit ordrenummer og din e-mailadresse for at se status på din ordre.
              </p>

              <form className="space-y-6">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-semibold text-gray-900 mb-2">
                    Ordrenummer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    required
                    placeholder="f.eks. TR-123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Du finder dit ordrenummer i din ordrebekræftelse via e-mail
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="din@email.dk"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#b5a087] text-white font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Spor ordre
                </button>
              </form>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Ordrestatus forklaring
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ordre modtaget</h3>
                    <p className="text-gray-600">
                      Vi har modtaget din ordre og begynder at behandle den. Du modtager en 
                      ordrebekræftelse på e-mail.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">I produktion</h3>
                    <p className="text-gray-600">
                      Dit produkt er nu i produktion. Vi designer og printer dit tøj med største 
                      omhu for at sikre den bedste kvalitet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Kvalitetskontrol</h3>
                    <p className="text-gray-600">
                      Dit produkt gennemgår vores grundige kvalitetskontrol for at sikre, at alt 
                      lever op til vores høje standarder.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pakket og klar til afsendelse</h3>
                    <p className="text-gray-600">
                      Din ordre er pakket sikkert og er klar til at blive sendt. Du modtager snart 
                      en forsendelsesbekræftelse med tracking nummer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Afsendt</h3>
                    <p className="text-gray-600">
                      Din ordre er afsendt og er på vej til dig. Du kan følge forsendelsen med det 
                      tracking nummer, du har modtaget via e-mail.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Forventet leveringstid
            </h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Standard levering</h3>
              <p className="text-gray-700 mb-2">
                <strong>Produktionstid:</strong> 3-5 hverdage
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Forsendelsestid:</strong> 2-4 hverdage
              </p>
              <p className="text-gray-700">
                <strong>Total tid:</strong> 5-9 hverdage
              </p>
            </div>

            <p className="text-gray-600 text-sm">
              Bemærk: Leveringstiderne er vejledende og kan variere afhængigt af produkttype, 
              destination og sæson. Du modtager en e-mail, når din ordre er afsendt, med forventet 
              leveringsdato.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Ofte stillede spørgsmål
            </h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Hvor finder jeg mit ordrenummer?
                </h3>
                <p className="text-gray-700">
                  Dit ordrenummer findes i den ordrebekræftelse, du modtog via e-mail, da du 
                  afgav din ordre. Det starter typisk med "TR-" efterfulgt af et 6-cifret nummer.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Kan jeg ændre min leveringsadresse?
                </h3>
                <p className="text-gray-700">
                  Hvis din ordre endnu ikke er afsendt, kan vi muligvis ændre leveringsadressen. 
                  Kontakt vores kundeservice hurtigst muligt på{' '}
                  <a href="mailto:kontakt@trady.dk" className="text-blue-600 hover:text-blue-800 underline">
                    kontakt@trady.dk
                  </a>
                  {' '}med dit ordrenummer.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Hvad gør jeg, hvis jeg ikke har modtaget en ordrebekræftelse?
                </h3>
                <p className="text-gray-700">
                  Tjek først din spam-mappe. Hvis du stadig ikke kan finde ordrebekræftelsen, 
                  kontakt os på{' '}
                  <a href="mailto:kontakt@trady.dk" className="text-blue-600 hover:text-blue-800 underline">
                    kontakt@trady.dk
                  </a>
                  {' '}med de oplysninger, du brugte ved bestillingen.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Min ordre er forsinket, hvad gør jeg?
                </h3>
                <p className="text-gray-700">
                  Hvis din ordre ikke er ankommet inden for den forventede leveringstid, bedes du 
                  kontakte os med dit ordrenummer. Vi vil hjælpe dig med at finde ud af, hvor din 
                  pakke er.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Har du brug for hjælp?
            </h2>
            <p className="text-gray-700 mb-6">
              Hvis du har spørgsmål til din ordre, eller hvis du ikke kan finde de oplysninger, 
              du søger, er du altid velkommen til at kontakte vores kundeservice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/kontakt"
                className="inline-block bg-[#b5a087] text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                Kontakt os
              </a>
              <a
                href="mailto:kontakt@trady.dk"
                className="inline-block bg-white border border-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Send e-mail
              </a>
            </div>
          </section>
        </div>
      </main>

    </div>
  );
};

export default OrderStatus;