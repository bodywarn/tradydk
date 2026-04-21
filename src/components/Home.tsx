import React from "react";

import Header from "./layout/Header";
import Hero from "./pages/landing/Hero";
import Produkter from "./pages/landing/Produkter";
import Behandler from "./pages/landing/Behandler";
import Footer from "./layout/Footer";

const Home: React.FC = () => {
  return (
    <>
      <div className="bg-[#0a0a0a] text-white">
        <Header />
        <Hero />
        <Produkter />
        <Behandler />
        <Footer />
      </div>
    </>
  );
};
export default Home;
