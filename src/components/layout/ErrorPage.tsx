import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-[#f5f0e8] flex flex-col">
      <header className="w-full px-6 py-4 md:px-8 md:py-6">
        <button 
          onClick={handleGoBack}
          className="transition-opacity hover:opacity-70"
          aria-label="Gå til forsiden"
        >
          <img className="w-auto h-11" src="images/landing/navbar/navtext.png" alt="" />
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-6">
        <article className="max-w-2xl w-full text-center">
          <h1 className="text-7xl md:text-9xl font-bold text-[#2c2c2c] mb-6">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-[#2c2c2c] mb-4">
            Øv! Denne side findes ikke
          </h2>
          
          <p className="text-base md:text-lg text-[#5a5a5a] mb-8 leading-relaxed">
            Tjek om du har skrevet den rigtige webadresse, eller klik på Trady-logoet eller knappen nedenfor for at komme tilbage til forsiden.
          </p>
          
          <button
            onClick={handleGoBack}
            className="inline-block bg-[#6b7c5e] text-white font-medium px-8 py-3 rounded-sm transition-all hover:bg-[#5a6b4e] hover:shadow-md"
          >
            Tilbage til forsiden
          </button>
        </article>
      </div>

      <footer className="w-full bg-[#7a7868] py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white">
            <div className="flex items-center gap-2">
            <button 
              onClick={handleGoBack}
              className="cursor-pointer"
              aria-label="Gå til forsiden"
            >
              <img className="w-auto h-11" src="images/landing/navbar/navtext.png" alt="" />
            </button>
            </div>
            
            <nav className="flex gap-8 text-sm">
              <a href="/om-os" className="hover:opacity-70 transition-opacity">
                Om os
              </a>
              <a href="/kontakt" className="hover:opacity-70 transition-opacity">
                Kontakt
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default ErrorPage;