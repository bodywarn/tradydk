
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Faktura = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <main className="grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Indlæser...</p>
          </div>
        </main>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">

        <main className="grow">
          <section className="bg-linear-to-br from-gray-50 to-gray-100 py-16 sm:py-20 lg:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Du er allerede logget ind
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
                Gå til din konto for at se dine fakturaer og kvitteringer
              </p>
              <button
                onClick={() => navigate('/konto')}
                className="inline-block bg-[#b5a087] text-white font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Gå til min konto
              </button>
            </div>
          </section>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <section className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
                Hvad kan du gøre i din konto?
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ordrehistorik
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Se alle dine tidligere ordrer og bestil dem igen med et enkelt klik.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Fakturaer & kvitteringer
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Download alle dine fakturaer og kvitteringer når som helst.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Spor ordrer
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Følg dine ordrer i realtid og se, hvor de befinder sig.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Gemte designs
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Gem dine favorit designs og genbestil nemt ved senere lejligheder.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Hurtigere checkout
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Gem dine leveringsoplysninger og betal hurtigere næste gang.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Eksklusive tilbud
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Modtag særlige tilbud og rabatter kun for medlemmer.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <main className="grow">
        <section className="bg-linear-to-br from-gray-50 to-gray-100 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Min konto
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Få adgang til dine fakturaer og kvitteringer
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          
          <section className="mb-16">
            <div className="max-w-md mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Log ind på din konto
                </h2>
                
                <form className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      E-mail
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

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                      Adgangskode
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#b5a087] text-white font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Log ind
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <a href="/glemt-adgangskode" className="text-blue-600 hover:text-blue-800 text-sm">
                    Glemt adgangskode?
                  </a>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-gray-600 mb-4">Har du ikke en konto?</p>
                  <a
                    href="/opret-konto"
                    className="inline-block bg-white border border-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Opret konto
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
              Fordele ved at have en konto
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ordrehistorik
                </h3>
                <p className="text-gray-600 text-sm">
                  Se alle dine tidligere ordrer og bestil dem igen med et enkelt klik.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Fakturaer & kvitteringer
                </h3>
                <p className="text-gray-600 text-sm">
                  Download alle dine fakturaer og kvitteringer når som helst.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Spor ordrer
                </h3>
                <p className="text-gray-600 text-sm">
                  Følg dine ordrer i realtid og se, hvor de befinder sig.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gemte designs
                </h3>
                <p className="text-gray-600 text-sm">
                  Gem dine favorit designs og genbestil nemt ved senere lejligheder.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Hurtigere checkout
                </h3>
                <p className="text-gray-600 text-sm">
                  Gem dine leveringsoplysninger og betal hurtigere næste gang.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-[#b5a087] text-white rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Eksklusive tilbud
                </h3>
                <p className="text-gray-600 text-sm">
                  Modtag særlige tilbud og rabatter kun for medlemmer.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Fakturaer & Kvitteringer
            </h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Når du logger ind på din konto, får du adgang til alle dine fakturaer og kvitteringer. 
                Du kan downloade dem som PDF-filer og gemme dem til dit eget arkiv.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Hvad indeholder en faktura?
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    <span>Ordrenummer og dato</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    <span>Produktdetaljer og priser</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    <span>Moms og totalbeløb</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    <span>Leveringsadresse</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    <span>Virksomhedsoplysninger (CVR-nummer)</span>
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Brug for en faktura nu?
                </h3>
                <p className="text-gray-700 mb-4">
                  Hvis du ikke har en konto, men har brug for en faktura til en tidligere ordre, kan 
                  du kontakte os med dit ordrenummer, så sender vi dig fakturaen via e-mail.
                </p>
                <a
                  href="mailto:kontakt@trady.dk"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Kontakt os →
                </a>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ofte stillede spørgsmål
            </h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Er det gratis at oprette en konto?
                </h3>
                <p className="text-gray-700">
                  Ja, det er helt gratis at oprette en konto hos Trady. Du får adgang til mange 
                  fordele uden nogen form for binding eller omkostninger.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Hvordan downloader jeg mine fakturaer?
                </h3>
                <p className="text-gray-700">
                  Log ind på din konto, gå til "Ordrehistorik", vælg den relevante ordre, og klik 
                  på "Download faktura". Fakturaen downloades som en PDF-fil.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Kan jeg ændre mine kontooplysninger?
                </h3>
                <p className="text-gray-700">
                  Ja, du kan til enhver tid ændre dine oplysninger som navn, adresse, telefonnummer 
                  og adgangskode under "Kontoindstillinger".
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Hvor længe gemmes mine oplysninger?
                </h3>
                <p className="text-gray-700">
                  Vi gemmer dine kontooplysninger så længe din konto er aktiv. Du kan til enhver tid 
                  slette din konto under "Kontoindstillinger".
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Kan jeg bestille uden en konto?
                </h3>
                <p className="text-gray-700">
                  Ja, du kan godt bestille som gæst uden at oprette en konto. Dog får du ikke adgang 
                  til ordrehistorik og andre kontofordele.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Brug for hjælp med din konto?
            </h2>
            <p className="text-gray-700 mb-6">
              Hvis du har problemer med at logge ind, oprette en konto, eller downloade fakturaer, 
              er du velkommen til at kontakte vores kundeservice.
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

export default Faktura;