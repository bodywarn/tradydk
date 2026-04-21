

const DesignGuide = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <main className="grow">
        <section className="bg-linear-to-br from-gray-50 to-gray-100 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Design hjælp
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Få hjælp til at designe det perfekte produkt
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          
          <section className="mb-16">
            <p className="text-xl text-gray-700 leading-relaxed">
              Velkommen til vores designguide! Her finder du alle de tips og tricks, du har brug 
              for, for at skabe det perfekte custom produkt. Uanset om du designer for første gang 
              eller er en erfaren designer, hjælper denne guide dig til det bedste resultat.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Kom i gang med at designe
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="shrink-0 w-10 h-10 bg-[#b5a087] text-white rounded-full flex items-center justify-center font-bold mr-4">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Vælg dit produkt
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Start med at vælge, hvilket produkt du vil designe - t-shirt, hoodie, polo eller 
                    lynlås hoodie. Hver produkttype har forskellige designmuligheder og placeringer.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="shrink-0 w-10 h-10 bg-[#b5a087] text-white rounded-full flex items-center justify-center font-bold mr-4">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Vælg farve og størrelse
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vælg farven på dit produkt. Tænk over, hvordan dit design vil se ud på den 
                    valgte farve. Vælg også den korrekte størrelse ved at tjekke vores størrelsesguide.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="shrink-0 w-10 h-10 bg-[#b5a087] text-white rounded-full flex items-center justify-center font-bold mr-4">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Upload dit design
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Upload dit design eller logo. Du kan uploade billeder i formaterne PNG, JPG eller 
                    PDF. For bedste kvalitet anbefaler vi PNG med transparent baggrund.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="shrink-0 w-10 h-10 bg-[#b5a087] text-white rounded-full flex items-center justify-center font-bold mr-4">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Placer og tilpas
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Placer dit design på produktet, og tilpas størrelsen. Du kan se et preview af, 
                    hvordan det endelige produkt vil se ud.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="shrink-0 w-10 h-10 bg-[#b5a087] text-white rounded-full flex items-center justify-center font-bold mr-4">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Gennemgå og bestil
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Gennemgå dit design nøje, før du lægger det i kurven. Sørg for, at alt ser 
                    korrekt ud - farver, placering og størrelse.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Krav til designfiler
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">✓ Anbefalede formater</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>PNG med transparent baggrund</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>JPG med hvid baggrund</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>PDF (vektor format)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Minimum 300 DPI opløsning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Minimum 2000 x 2000 pixels</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">✗ Undgå disse problemer</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Lav opløsning (under 150 DPI)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Pixelerede eller uskarpe billeder</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Forkert filformat (BMP, GIF)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>For små filer (under 500 x 500 pixels)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Ophavsretsbeskyttede billeder</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Pro tip</h3>
              <p className="text-gray-700">
                For det bedste resultat anbefaler vi at bruge PNG-filer med transparent baggrund og 
                en opløsning på minimum 300 DPI. Dette sikrer, at dit design ser skarpt og professionelt 
                ud på det færdige produkt.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Farver og kontrast
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Valget af farver er vigtigt for, at dit design skiller sig ud og ser godt ud på det 
              færdige produkt.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-gray-900 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Kontrast er nøglen
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Sørg for god kontrast mellem dit design og produktfarven. Et mørkt design fungerer 
                  bedst på lyse produkter og omvendt. Undgå at printe hvidt på hvidt eller sort på sort.
                </p>
              </div>

              <div className="border-l-4 border-gray-900 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  RGB vs. CMYK
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Vi printer i RGB-farver. Vær opmærksom på, at farver kan se lidt anderledes ud på 
                  skærm end på det fysiske produkt. Vi anbefaler at bruge standardfarver for det mest 
                  forudsigelige resultat.
                </p>
              </div>

              <div className="border-l-4 border-gray-900 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Test dine farver
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Brug vores preview-funktion til at se, hvordan dit design ser ud på forskellige 
                  produktfarver, før du bestiller.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Placering af design
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Bryst (front)
                </h3>
                <p className="text-gray-700 mb-3">
                  Perfekt til logoer og mindre designs.
                </p>
                <p className="text-gray-600 text-sm">
                  Anbefalet størrelse: 20-30 cm bred
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Ryg
                </h3>
                <p className="text-gray-700 mb-3">
                  Stor printflade, ideel til store designs og grafik.
                </p>
                <p className="text-gray-600 text-sm">
                  Anbefalet størrelse: 30-35 cm bred
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Ærme
                </h3>
                <p className="text-gray-700 mb-3">
                  Mindre design på ærmet, godt til detaljer.
                </p>
                <p className="text-gray-600 text-sm">
                  Anbefalet størrelse: 8-12 cm bred
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Lommepåtryk
                </h3>
                <p className="text-gray-700 mb-3">
                  Lille, diskret design perfekt til minimalister.
                </p>
                <p className="text-gray-600 text-sm">
                  Anbefalet størrelse: 8-10 cm bred
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Tips og tricks
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Hold det simpelt
                </h3>
                <p className="text-gray-700">
                  Enkle designs printer ofte bedst. Undgå for mange små detaljer, der kan forsvinde 
                  eller blive utydelige i printet.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tjek størrelsesguiden
                </h3>
                <p className="text-gray-700">
                  Brug altid vores størrelsesguide for at sikre, at du vælger den rigtige størrelse. 
                  Målene kan variere mellem forskellige produkttyper.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Test før du printer
                </h3>
                <p className="text-gray-700">
                  Brug preview-funktionen til at se dit design fra alle vinkler. Zoom ind for at 
                  tjekke detaljer og sørg for, at placeringen er præcis, som du ønsker det.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Husk ophavsret
                </h3>
                <p className="text-gray-700">
                  Sørg for, at du har rettigheder til det design, logo eller billede, du uploader. 
                  Vi kan ikke printe ophavsretsbeskyttede designs uden tilladelse.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gem dit design
                </h3>
                <p className="text-gray-700">
                  Når du har lavet et design, du er tilfreds med, kan du gemme det til senere brug. 
                  Det gør det nemt at genbestille eller lave variationer.
                </p>
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
                  Hvilken opløsning skal mit design have?
                </h3>
                <p className="text-gray-700">
                  For det bedste resultat anbefaler vi minimum 300 DPI og mindst 2000 x 2000 pixels. 
                  Jo højere opløsning, jo skarpere bliver dit print.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Kan jeg bruge billeder fra internettet?
                </h3>
                <p className="text-gray-700">
                  Du skal have rettighederne til de billeder, du uploader. Vær forsigtig med billeder 
                  fra Google eller andre søgemaskiner, da de ofte er ophavsretsbeskyttede.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Hvordan får jeg transparent baggrund?
                </h3>
                <p className="text-gray-700">
                  Brug et billedredigeringsprogram som Photoshop, GIMP eller online værktøjer som 
                  Remove.bg til at fjerne baggrunden. Gem derefter filen som PNG.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Kan I hjælpe med at designe?
                </h3>
                <p className="text-gray-700">
                  Vi tilbyder ikke designservice, men vores designværktøj er meget intuitivt og nemt 
                  at bruge. Følg denne guide for at komme i gang.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Hvor stort kan mit design være?
                </h3>
                <p className="text-gray-700">
                  Det afhænger af placeringen. Brystprint kan være op til 30 cm bredt, mens et 
                  rygprint kan være op til 35 cm. Vores designværktøj viser dig de maksimale størrelser.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Brug for mere hjælp?
            </h2>
            <p className="text-gray-700 mb-6">
              Hvis du har spørgsmål til design eller har brug for hjælp til at komme i gang, er du 
              velkommen til at kontakte vores kundeservice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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

export default DesignGuide;