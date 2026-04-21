import React from "react";

const Behandler: React.FC = () => {
  const processImage = "images/landing/behandler/imgbehandler.png";

  return (
    <section className="bg-[#f5f0ea] py-16 sm:py-20" aria-labelledby="process-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <figure className="order-2 lg:order-1">
            <img
              src={processImage}
              alt="TRADY bestillingsproces - du bestiller, vi klarer den svære del med produktion hos asiatisk fabrik og leverer dit tøj"
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </figure>

          <article className="order-1 lg:order-2">
            <header className="mb-6">
              <h2 id="process-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Du bestiller.
                <br />
                Vi klare den svære del
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Vi samarbejder med asiatiske partnere om produktionen af dit tøj, hvilket sikrer os nogle af markedets laveste priser, uden at gå på kompromis med kvaliteten.
              </p>
            </header>

            <a
              href="om-os"
              className="inline-block bg-white hover:bg-gray-50 text-gray-900 font-medium px-6 py-3 rounded-lg border-2 border-gray-900 transition-colors duration-300"
            >
              Se mere
            </a>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Behandler;