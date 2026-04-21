import { useState, useEffect } from 'react';

const Cookies = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [preferences, setPreferences] = useState({
    necessary: true, 
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAllCookies = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const continueWithoutAccepting = () => {
    const essentialOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(essentialOnly));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {!showSettings && <div className="fixed inset-0 bg-black/20 z-40" />}

      {!showSettings ? (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-white rounded-2xl shadow-2xl z-50 max-w-md w-[calc(100%-2rem)] md:w-full">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                Cookies,
                <br />
                på dine vilkår.
              </h2>
              <button
                onClick={continueWithoutAccepting}
                className="text-sm text-gray-600 underline hover:text-gray-800 whitespace-nowrap ml-4 mt-1"
              >
                Fortsæt uden at acceptere
              </button>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed mb-2">
              VistaPrint og dets partnere bruger cookies og andre teknologier til at levere og forbedre vores tjenester, 
              til at målrette din oplevelse af hjemmesiden og til at vise personlige annoncer. Du kan justere dine 
              præferencer ved at vælge "Administrer indstillinger". Se vores{' '}
              <a href="/cookiepolitik" className="underline text-gray-900 font-medium hover:text-gray-700">
                Cookiemeddelelse
              </a>{' '}
              for at få mere at vide.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => setShowSettings(true)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Administrer indstillinger
              </button>
              <button
                onClick={acceptAllCookies}
                className="flex-1 px-4 py-3 bg-[#b5a087] text-white font-semibold rounded-lg hover:bg-[#a08c72] transition-colors text-sm"
              >
                Acceptér alle cookies
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
            <div className="p-6 overflow-y-auto max-h-[85vh]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Cookie-indstillinger</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6 mb-8">
                <div className="border-b pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">Nødvendige cookies</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Altid aktiv</span>
                      <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Disse cookies er nødvendige for at hjemmesiden kan fungere og kan ikke slås fra i vores systemer. 
                    De indstilles normalt kun som reaktion på handlinger, du foretager, som svarer til en anmodning om tjenester.
                  </p>
                </div>

                <div className="border-b pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">Analyse og ydeevne cookies</h3>
                    <button
                      onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        preferences.analytics ? 'bg-[#b5a087]' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.analytics ? 'translate-x-6 right-1' : 'left-1'
                        }`}
                      ></div>
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Disse cookies giver os mulighed for at tælle besøg og trafikkilder, så vi kan måle og forbedre vores 
                    hjemmesides ydeevne. De hjælper os med at vide, hvilke sider der er mest og mindst populære.
                  </p>
                </div>

                <div className="border-b pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">Marketing cookies</h3>
                    <button
                      onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        preferences.marketing ? 'bg-[#b5a087]' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.marketing ? 'translate-x-6 right-1' : 'left-1'
                        }`}
                      ></div>
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Disse cookies kan indstilles via vores hjemmeside af vores reklamepartnere. De kan bruges til at opbygge 
                    en profil af dine interesser og vise dig relevante annoncer på andre hjemmesider.
                  </p>
                </div>

                <div className="pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">Personaliserings cookies</h3>
                    <button
                      onClick={() => setPreferences({ ...preferences, personalization: !preferences.personalization })}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        preferences.personalization ? 'bg-[#b5a087]' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.personalization ? 'translate-x-6 right-1' : 'left-1'
                        }`}
                      ></div>
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Disse cookies gør det muligt for hjemmesiden at levere forbedret funktionalitet og personalisering. 
                    De kan indstilles af os eller af tredjepartsudbydere.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <button
                  onClick={savePreferences}
                  className="flex-1 px-6 py-3 bg-[#b5a087] text-white font-semibold rounded-lg hover:bg-[#a08c72] transition-colors"
                >
                  Gem indstillinger
                </button>
                <button
                  onClick={acceptAllCookies}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Acceptér alle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cookies;