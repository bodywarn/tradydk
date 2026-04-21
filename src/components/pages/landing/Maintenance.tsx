const Maintenance = () => {
  return (
    <div className="min-h-screen bg-[#d4c5b0] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/60 shadow-lg">
              <svg 
                className="w-10 h-10 text-gray-700 animate-spin-slow" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ animationDuration: '3s' }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-white/20 rounded-full animate-ping opacity-20" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Shoppen er under udvikling
        </h1>

        <p className="text-xl text-gray-600 mb-16">
          Kig tilbage senere
        </p>

        <p className="text-gray-700 text-base max-w-md mx-auto mb-16">
          Vi arbejder på at gøre oplevelsen endnu bedre.<br />
          Udgivelsesdato er endnu ukendt.
        </p>

        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default Maintenance