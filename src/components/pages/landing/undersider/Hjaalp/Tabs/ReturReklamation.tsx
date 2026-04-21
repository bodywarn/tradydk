

const ReturReklamation = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <main className="grow">
        <section className="bg-linear-to-br from-gray-50 to-gray-100 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Retur & Reklamation
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Læs om vores returpolitik og reklamationsret
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          
          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Fortrydelsesret
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Da alle vores produkter er tilpassede og produceret specielt til dig efter din 
                bestilling, kan vi desværre ikke tilbyde returret på customized produkter i henhold 
                til forbrugeraftalelovens undtagelsesbestemmelser.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Personligt tilpassede varer er undtaget fra fortrydelsesretten, da de er fremstillet 
                efter dine specifikationer og ikke kan videresælges.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <p className="text-gray-700">
                  <strong>Vigtigt:</strong> Sørg derfor for at kontrollere dit design, størrelse og 
                  alle detaljer grundigt, før du afgiver din ordre.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Reklamationsret - 24 måneder
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Du har 24 måneders reklamationsret i henhold til købeloven. Det betyder, at hvis 
                dit produkt har en fejl eller mangel, som eksisterede, da du modtog det, kan du 
                reklamere over produktet.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">
                Hvornår kan du reklamere?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Du kan reklamere, hvis produktet:
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">•</span>
                  <span>Har produktionsfejl eller materiale defekter</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">•</span>
                  <span>Ikke matcher det design, du bestilte</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">•</span>
                  <span>Har forkert størrelse i forhold til din ordre</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">•</span>
                  <span>Er beskadiget ved modtagelsen</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">•</span>
                  <span>Har printfejl eller dårlig printkvalitet</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">
                Hvad dækker reklamationsretten ikke?
              </h3>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">•</span>
                  <span>Skader opstået ved normal slitage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">•</span>
                  <span>Forkert vask eller vedligeholdelse</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">•</span>
                  <span>Designfejl i dit eget uploadede design</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">•</span>
                  <span>Fortrydelse efter produktionen er påbegyndt</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Sådan reklamerer du
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="shrink-0 w-10 h-10 bg-[#b5a087] text-white rounded-full flex items-center justify-center font-bold mr-4">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Kontakt os
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Send os en e-mail på{' '}
                    <a href="mailto:kontakt@trady.dk" className="text-blue-600 hover:text-blue-800 underline">
                      kontakt@trady.dk
                    </a>
                    {' '}med dit ordrenummer og en beskrivelse af problemet.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="shrink-0 w-10 h-10 bg-[#b5a087] text-white rounded-full flex items-center justify-center font-bold mr-4">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Send billeder
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vedhæft tydelige billeder af produktet, som viser fejlen eller manglen. Dette 
                    hjælper os med at vurdere sagen hurtigere.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="shrink-0 w-10 h-10 bg-[#b5a087] text-white rounded-full flex items-center justify-center font-bold mr-4">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Vi behandler din reklamation
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vi vurderer din reklamation og vender tilbage til dig inden for 2-3 hverdage 
                    med en løsning.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="shrink-0 w-10 h-10 bg-[#b5a087] text-white rounded-full flex items-center justify-center font-bold mr-4">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Løsning
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Hvis reklamationen er berettiget, producerer vi et nyt produkt til dig uden 
                    ekstra omkostninger, eller du modtager en refundering.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Returadresse
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Hvis vi beder dig om at returnere produktet, skal det sendes til følgende adresse. 
              Kontakt os altid først, før du sender noget retur.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-900 font-semibold mb-1">Trady</p>
              <p className="text-gray-700 mb-1">Returafdelingen</p>
              <p className="text-gray-700 mb-1">[Adresse]</p>
              <p className="text-gray-700 mb-1">[Postnummer og By]</p>
              <p className="text-gray-700">Danmark</p>
            </div>
            <p className="text-gray-600 text-sm mt-4">
              Husk at pakke produktet sikkert og vedlægge dit ordrenummer i pakken.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ofte stillede spørgsmål
            </h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Kan jeg fortryde mit køb?
                </h3>
                <p className="text-gray-700">
                  Da produkterne er customized og fremstillet efter dine specifikationer, er de 
                  undtaget fra fortrydelsesretten. Vi anbefaler derfor, at du nøje gennemgår dit 
                  design og alle detaljer, før du afgiver din ordre.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Hvad hvis jeg bestilte den forkerte størrelse?
                </h3>
                <p className="text-gray-700">
                  Hvis du ved en fejl har valgt den forkerte størrelse, kan vi desværre ikke 
                  tilbyde ombytning eller refundering, da produktet er tilpasset efter din ordre. 
                  Sørg for at tjekke størrelsesguiden før bestilling.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Hvem betaler for returforsendelse?
                </h3>
                <p className="text-gray-700">
                  Hvis reklamationen er berettiget, dækker vi forsendelsesomkostningerne. Kontakt 
                  os først, så vi kan give dig instruktioner om returneringen.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Hvor lang tid tager det at få en ny vare?
                </h3>
                <p className="text-gray-700">
                  Når vi har modtaget og godkendt din reklamation, producerer vi et nyt produkt til 
                  dig. Dette tager typisk 3-5 hverdage plus forsendelsestid.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Kan jeg få pengene tilbage i stedet for et nyt produkt?
                </h3>
                <p className="text-gray-700">
                  Ja, hvis du foretrækker det, kan du få refunderet dit køb i stedet for at modtage 
                  et nyt produkt. Pengene vil blive returneret til den betalingsmetode, du brugte 
                  ved købet.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Har du spørgsmål til retur eller reklamation?
            </h2>
            <p className="text-gray-700 mb-6">
              Vi er her for at hjælpe dig. Kontakt vores kundeservice, hvis du har brug for 
              vejledning eller ønsker at reklamere over et produkt.
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
                kontakt@trady.dk
              </a>
            </div>
          </section>
        </div>
      </main>

    </div>
  );
};

export default ReturReklamation;