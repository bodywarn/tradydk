

const Cookiepolitik = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <main className="grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Cookiepolitik
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Denne cookiepolitik forklarer, hvordan Trady bruger cookies og lignende teknologier 
              på vores hjemmeside. Vi ønsker at være transparente om, hvilke data vi indsamler, 
              og hvordan du kan styre dine præferencer.
            </p>
          </header>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                1. Hvad er cookies?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies er små tekstfiler, som gemmes på din enhed (computer, tablet eller smartphone), 
                når du besøger en hjemmeside. Cookies hjælper hjemmesiden med at huske dine handlinger 
                og præferencer over en periode, så du ikke behøver at indtaste dem igen, hver gang du 
                besøger siden eller browser mellem forskellige sider.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Cookies kan også bruges til at analysere, hvordan brugere interagerer med hjemmesiden, 
                så vi kan forbedre brugeroplevelsen og tilpasse indholdet til dine interesser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                2. Hvilke typer cookies bruger vi?
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Nødvendige cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Disse cookies er essentielle for, at hjemmesiden kan fungere korrekt. De gør det 
                    muligt for dig at navigere på siden og bruge grundlæggende funktioner som 
                    indkøbskurv, login og sikre områder. Uden disse cookies kan visse tjenester ikke 
                    leveres.
                  </p>
                  <p className="text-gray-600 text-sm mt-2 italic">
                    Eksempler: Session-cookies, sikkerhedscookies, indkøbskurv
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Funktionelle cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Disse cookies gør det muligt for hjemmesiden at huske dine valg og præferencer, 
                    såsom dit foretrukne sprog, region eller brugerindstillinger. De forbedrer din 
                    brugeroplevelse ved at personalisere indholdet efter dine behov.
                  </p>
                  <p className="text-gray-600 text-sm mt-2 italic">
                    Eksempler: Sprogindstillinger, designpræferencer, tidligere søgninger
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Analytiske cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Disse cookies hjælper os med at forstå, hvordan besøgende bruger vores hjemmeside. 
                    De indsamler anonymiserede data om sidetal, besøgstid, klikrater og fejlmeddelelser. 
                    Disse oplysninger bruges til at forbedre hjemmesidens funktionalitet og 
                    brugeroplevelse.
                  </p>
                  <p className="text-gray-600 text-sm mt-2 italic">
                    Eksempler: Google Analytics, heatmaps, besøgsstatistik
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Marketing cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Disse cookies bruges til at vise relevante annoncer og markedsføringsmateriale 
                    baseret på dine interesser. De sporer også, om du har set en annonce eller klikket 
                    på den. Marketing cookies kan også bruges til at begrænse, hvor mange gange du ser 
                    den samme annonce.
                  </p>
                  <p className="text-gray-600 text-sm mt-2 italic">
                    Eksempler: Facebook Pixel, Google Ads, retargeting cookies
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                3. Tredjepartscookies
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vi bruger også tredjepartscookies fra eksterne tjenesteudbydere til at analysere trafik, 
                vise relevante annoncer og integrere sociale medier på vores hjemmeside. Disse 
                tredjeparter kan indsamle data om din browsingadfærd på tværs af forskellige hjemmesider.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Eksempler på tredjeparter, vi arbejder med, inkluderer:
              </p>
              <ul className="mt-3 space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">•</span>
                  <span>Google Analytics (analyse af hjemmesidetrafik)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">•</span>
                  <span>Facebook (markedsføring og sociale medier)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">•</span>
                  <span>Betalingsudbydere (sikker håndtering af transaktioner)</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                4. Hvor længe gemmes cookies?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies kan være enten midlertidige eller permanente:
              </p>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">Session-cookies (midlertidige)</h3>
                  <p className="text-gray-700">
                    Disse cookies slettes automatisk, når du lukker din browser. De bruges til at huske 
                    dine handlinger, mens du navigerer på hjemmesiden.
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">Permanente cookies</h3>
                  <p className="text-gray-700">
                    Disse cookies forbliver på din enhed i en fastsat periode eller indtil du manuelt 
                    sletter dem. De bruges til at huske dine præferencer ved næste besøg.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                5. Hvordan administrerer du cookies?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Du har fuld kontrol over, hvilke cookies du vil acceptere. De fleste browsere accepterer 
                automatisk cookies, men du kan ændre dine indstillinger for at blokere eller slette cookies.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Cookie-indstillinger i din browser:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-semibold">→</span>
                    <span><strong>Google Chrome:</strong> Indstillinger → Privatliv og sikkerhed → Cookies og andre websitedata</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-semibold">→</span>
                    <span><strong>Firefox:</strong> Indstillinger → Privatliv og sikkerhed → Cookies og webstedsdata</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-semibold">→</span>
                    <span><strong>Safari:</strong> Præferencer → Privatliv → Cookies og websitedata</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-semibold">→</span>
                    <span><strong>Microsoft Edge:</strong> Indstillinger → Cookies og webstedstilladelser</span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Vær opmærksom på, at hvis du blokerer eller sletter visse cookies, kan det påvirke 
                hjemmesidens funktionalitet, og nogle funktioner vil måske ikke virke korrekt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                6. Dit samtykke
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Når du første gang besøger vores hjemmeside, vil du se en cookie-banner, hvor du kan 
                vælge, hvilke typer cookies du vil acceptere. Du kan til enhver tid ændre dine 
                præferencer ved at klikke på cookie-indstillingerne i sidens footer.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Ved at fortsætte med at bruge vores hjemmeside accepterer du vores brug af cookies i 
                overensstemmelse med denne cookiepolitik.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                7. Ændringer til cookiepolitikken
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Vi kan opdatere denne cookiepolitik fra tid til anden for at afspejle ændringer i vores 
                brug af cookies eller lovgivningsmæssige krav. Alle opdateringer vil blive offentliggjort 
                på denne side, og vi opfordrer dig til at gennemgå politikken regelmæssigt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                8. Kontakt os
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Hvis du har spørgsmål om vores brug af cookies, eller hvis du ønsker at udøve dine 
                rettigheder vedrørende dine personoplysninger, er du velkommen til at kontakte os:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-900 font-semibold mb-2">Trady</p>
                <p className="text-gray-700">
                  E-mail:{' '}
                  <a 
                    href="mailto:kontakt@trady.dk" 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    kontakt@trady.dk
                  </a>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Sidst opdateret: Februar 2026
            </p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Cookiepolitik;