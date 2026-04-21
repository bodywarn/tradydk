import React from "react";
import { Facebook, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const logoUrl = "/images/landing/navbar/navtext.png";

  const footerLinks = {
    omOs: [
      { name: "Hvem er vi?", href: "/om-os" },
      { name: "Hvorfor os?", href: "/om-os" },
      { name: "Nyhedsbrev", href: "/om-os" },
    ],
    hjaelp: [
      { name: "Kontakt os", href: "/kontakt" },
      { name: "Ofte stillede spørgsmål", href: "/faq" },
      { name: "Handelsbetingelser", href: "/faq" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  ];

  const paymentMethods = [
    {
      name: "Visa",
      svg: (
        <svg viewBox="0 0 60 38" className="h-6 w-auto" aria-label="Visa">
          <rect width="60" height="38" rx="6" fill="#1A1F71" />
          <text x="30" y="26" textAnchor="middle" fill="white" fontSize="17" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="2">
            VISA
          </text>
        </svg>
      ),
    },
    {
      name: "Mastercard",
      svg: (
        <svg viewBox="0 0 60 38" className="h-6 w-auto" aria-label="Mastercard">
          <rect width="60" height="38" rx="6" fill="#1A1A1A" />
          <circle cx="22" cy="19" r="11" fill="#EB001B" />
          <circle cx="38" cy="19" r="11" fill="#F79E1B" />
          <path d="M30 10.1a11 11 0 0 1 0 17.8A11 11 0 0 1 30 10.1z" fill="#FF5F00" />
        </svg>
      ),
    },
    {
      name: "MobilePay",
      svg: (
        <svg viewBox="0 0 60 38" className="h-6 w-auto" aria-label="MobilePay">
          <rect width="60" height="38" rx="6" fill="#5C78FF" />
          {/* Phone icon */}
          <rect x="10" y="9" width="12" height="20" rx="2" fill="white" opacity="0.9" />
          <rect x="12" y="11" width="8" height="13" rx="1" fill="#5C78FF" />
          <circle cx="16" cy="26" r="1.2" fill="#5C78FF" />
          <text x="36" y="17" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif">
            Mobile
          </text>
          <text x="36" y="27" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif">
            Pay
          </text>
        </svg>
      ),
    },
    {
      name: "Apple Pay",
      svg: (
        <svg viewBox="0 0 60 38" className="h-6 w-auto" aria-label="Apple Pay">
          <rect width="60" height="38" rx="6" fill="#000000" />
          <path d="M17.5 10c.7-.9 1.2-2.1 1.1-3.3-1.1.1-2.4.7-3.2 1.7-.7.8-1.3 2-.1 3.1 1.1.1 2.4-.6 3.2-1.5z" fill="white" />
          <path d="M18.6 11.8c-1.8-.1-3.3 1-4.2 1-.9 0-2.2-.9-3.6-.9-1.9 0-3.6 1.1-4.5 2.8-1.9 3.3-.5 8.2 1.4 10.9.9 1.3 2 2.7 3.4 2.6 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.2-2.5.6-.9 1.1-1.9 1.5-3-1.6-.7-2.8-2.3-2.8-4.2 0-1.6.8-3.1 2.2-4-1-1.4-2.4-2.7-4.4-2.7z" fill="white" />
          <text x="43" y="24" textAnchor="middle" fill="white" fontSize="11" fontWeight="500" fontFamily="-apple-system, BlinkMacSystemFont, Arial, sans-serif">
            Pay
          </text>
        </svg>
      ),
    },
    {
      name: "Google Pay",
      svg: (
        <svg viewBox="0 0 60 38" className="h-6 w-auto" aria-label="Google Pay">
          <rect width="60" height="38" rx="6" fill="white" stroke="#e8e8e8" strokeWidth="1.5" />
          <text x="12" y="25" fill="#4285F4" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">G</text>
          <text x="24" y="25" fill="#3c3c3c" fontSize="11" fontWeight="500" fontFamily="Arial, sans-serif">Pay</text>
        </svg>
      ),
    },
    {
      name: "PayPal",
      svg: (
        <svg viewBox="0 0 60 38" className="h-6 w-auto" aria-label="PayPal">
          <rect width="60" height="38" rx="6" fill="#003087" />
          <text x="9" y="26" fill="#009CDE" fontSize="18" fontWeight="900" fontFamily="Arial, sans-serif">P</text>
          <text x="16" y="24" fill="white" fontSize="18" fontWeight="900" fontFamily="Arial, sans-serif">P</text>
          <text x="28" y="25" fill="white" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">ayPal</text>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#7a7868] text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <img src={logoUrl} alt="TRADY" className="h-12 w-auto mb-4" />
            <address className="not-italic text-white/90 space-y-1 text-sm">
              <p>CVR: 12345678</p>
              <p>
                Email:{" "}
                <a href="mailto:kontakt@trady.dk" className="hover:text-white transition-colors">
                  kontakt@trady.dk
                </a>
              </p>
            </address>
          </div>

          <nav aria-label="Om os links">
            <h3 className="text-lg font-semibold mb-4">Om os</h3>
            <ul className="space-y-2">
              {footerLinks.omOs.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Hjælp links">
            <h3 className="text-lg font-semibold mb-4">Hjælp</h3>
            <ul className="space-y-2">
              {footerLinks.hjaelp.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-lg font-semibold mb-4">Følg os</h3>
            <div className="flex items-center space-x-4 mb-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label={`Besøg os på ${social.name}`}
                  >
                    <IconComponent className="w-6 h-6" aria-hidden="true" />
                  </a>
                );
              })}
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Betalingsmetoder</h4>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="rounded-lg shadow-md flex items-center justify-center hover:scale-105 transition-transform duration-150 cursor-default"
                    title={method.name}
                  >
                    {method.svg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-white/70">
              &copy; {currentYear} TRADY. Alle rettigheder forbeholdes.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a href="/privatlivspolitik" className="text-white/70 hover:text-white transition-colors">
                Privatlivspolitik
              </a>
              <a href="/cookiepolitik" className="text-white/70 hover:text-white transition-colors">
                Cookiepolitik
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;