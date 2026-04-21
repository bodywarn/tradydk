import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingCart, User, Menu, Info, Mail, LayoutDashboard, Trash2 } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  stock: number;
  status: string;
}

type CachedAuth = { url: string; text: string; icon: "user" | "dashboard" }
const CACHE_KEY = "header_auth_link"
function readCache(): CachedAuth {
  try { const s = localStorage.getItem(CACHE_KEY); if (s) return JSON.parse(s); } catch {}
  return { url: "/login", text: "Log ind", icon: "user" }
}
function writeCache(v: CachedAuth) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(v)); } catch {} }

const PRINT_TYPE_NAMES: Record<string, string> = {
  'dtg':        'DTG Print',
  'broderi':    'Broderi',
  'screen':     'Silketryk',
  'embroidery': 'Broderi',
  'vinyl':      'Vinyl',
}
const getPrintTypeName = (p?: string) => p ? (PRINT_TYPE_NAMES[p] ?? p) : ''
const getSideName = (s?: string) => s === 'front' ? 'Forside' : s === 'back' ? 'Bagside' : s === 'both' ? 'Begge sider' : ''

const Z = {
  header: 100000,
  cartBackdrop: 200000,
  cartPanel: 200001,
  menuBackdrop: 300000,
  menuPanel: 300001,
} as const;

const Header: React.FC = () => {
  const [active, setActive] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const { user, role, loading } = useAuth();
  const { cartItems, removeFromCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const logoUrl = "/images/landing/navbar/navtext.png";

  const navItems = [
    { name: "T-shirt",       category: "t-shirt",       url: "/produkter?category=t-shirt" },
    { name: "Polo t-shirt",  category: "polo",          url: "/produkter?category=polo" },
    { name: "Hoodie",        category: "hoodie",        url: "/produkter?category=hoodie" },
    { name: "Lynlås hoodie", category: "lynlas-hoodie", url: "/produkter?category=lynlas-hoodie" },
  ];

  const [authLink, setAuthLink] = useState<CachedAuth>(readCache);
  const AuthIcon = authLink.icon === "dashboard" ? LayoutDashboard : User;

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, [searchOpen]);

  useEffect(() => {
    if (loading) return;
    const resolved: CachedAuth = !user
      ? { url: "/login",     text: "Log ind",   icon: "user" }
      : role === "admin"
      ? { url: "/dashboard", text: "Dashboard", icon: "dashboard" }
      : { url: "/konto", text: "Min konto", icon: "user" };
    setAuthLink(resolved);
    writeCache(resolved);
  }, [user, role, loading]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) {
      const match = navItems.find((i) => i.category === cat);
      if (match) setActive(match.name);
    } else if (location.pathname === "/produkter") {
      setActive("");
    }
  }, [location]);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearchResults(false);
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) setShowSearchResults(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

    useEffect(() => {
      if (menuOpen) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      } else {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
      return () => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      };
    }, [menuOpen]);

  useEffect(() => {
    const run = async () => {
      if (searchQuery.trim().length < 2) { setSearchResults([]); setShowSearchResults(false); return; }
      try {
        const snap = await getDocs(collection(db, "products"));
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
        const q = searchQuery.toLowerCase();
        const filtered = all
          .filter((p) => p.status === "active" && (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)))
          .slice(0, 5);
        setSearchResults(filtered);
        setShowSearchResults(filtered.length > 0);
      } catch (e) { console.error("Search error:", e); }
    };
    const t = setTimeout(run, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleNavClick = (name: string) => { setActive(name); setMenuOpen(false); };
  const handleResultClick = (id: string) => { navigate(`/produkt/${id}`); setSearchQuery(""); setShowSearchResults(false); setSearchOpen(false); };
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) { navigate(`/produkter?search=${encodeURIComponent(searchQuery)}`); setShowSearchResults(false); setSearchOpen(false); }
  };
  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearchSubmit(); };
  const cartTotal = () => cartItems.reduce((t, i) => t + i.price * i.quantity, 0);

  const ResultsDropdown = ({ mobile = false }: { mobile?: boolean }) => (
    <AnimatePresence>
      {showSearchResults && searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className={`${mobile ? "mt-2" : "absolute top-full left-0 right-0 mt-2"} bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden`}
          style={{ zIndex: Z.header + 1 }}
        >
          <div className={`${mobile ? "max-h-64" : "max-h-80"} overflow-y-auto`}>
            {searchResults.map((p) => (
              <button key={p.id} onClick={() => handleResultClick(p.id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition text-left border-b last:border-b-0"
              >
                <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-600 capitalize">{p.category}</p>
                </div>
                <p className="text-sm font-bold text-gray-900">{p.price} kr</p>
              </button>
            ))}
          </div>
          <button onClick={handleSearchSubmit} className="w-full p-3 text-sm text-[#b5a087] hover:bg-gray-50 font-medium border-t">
            Se alle resultater for "{searchQuery}"
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

const CartContents = () => (
  <div className="p-4 overflow-y-auto max-h-[60vh] lg:max-h-96">
    {cartItems.length === 0 ? (
      <div className="text-center py-8">
        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">Din kurv er tom</p>
      </div>
    ) : (
      <>
        <div className="space-y-3 mb-4">
          {cartItems.map((item) => {
            const printName  = getPrintTypeName(item.printType)
            const sideName   = getSideName(item.decorationSide)
            const printExtra = item.printExtraPrice

            return (
              <div key={`${item.productId}-${item.size}-${item.color}-${item.customLogo ?? ''}`} className="flex gap-3 pb-3 border-b last:border-b-0">

                {/* Billede + logo-badge */}
                <div className="relative shrink-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  {item.customLogo && (
                    <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-[#b5a087] rounded-full border-2 border-white shadow flex items-center justify-center">
                      <img src={item.customLogo} alt="Logo" className="w-5 h-5 object-contain" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.size} / {item.color}</p>
                  <p className="text-xs text-gray-500">{item.quantity}× {item.price} kr</p>

                  {/* Tryk-info — vises kun hvis der er et logo */}
                  {item.customLogo && (printName || sideName) && (
                    <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs">
                      {sideName && (
                        <span className="text-gray-400">📍 {sideName}</span>
                      )}
                      {printName && (
                        <span className="flex items-center gap-1">
                          {sideName && <span className="text-gray-300">·</span>}
                          <span className="font-medium text-[#8a7560]">{printName}</span>
                          {printExtra && printExtra > 0
                            ? <span className="text-[#b5a087]">(+{printExtra} kr)</span>
                            : <span className="text-green-600">(inkl.)</span>
                          }
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-sm font-bold text-gray-900 mt-1">{(item.price * item.quantity).toFixed(0)} kr</p>
                </div>

                {/* Fjern-knap */}
                <button
                  onClick={() => removeFromCart(item.productId, item.size, item.color, item.customLogo)}
                  className="text-red-400 hover:text-red-600 shrink-0 self-start pt-0.5 transition"
                  aria-label={`Fjern ${item.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between font-bold text-gray-900 mb-4">
            <span>I alt:</span>
            <span>{cartTotal().toFixed(0)} kr</span>
          </div>
          <div className="space-y-2">
            <Link to="/kurv" onClick={() => setCartOpen(false)}
              className="block w-full text-center px-4 py-3 bg-[#b5a087] text-white rounded-lg hover:bg-[#a08f76] transition font-semibold text-sm">
              Gå til kurv
            </Link>
            <Link to="/checkout" onClick={() => setCartOpen(false)}
              className="block w-full text-center px-4 py-3 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] transition font-semibold text-sm">
              Gå til betaling
            </Link>
          </div>
        </div>
      </>
    )}
  </div>
);

  return (
    <>
      <div style={{ height: headerHeight }} aria-hidden="true" />

      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${isScrolled ? "bg-[#c9b8a3]/98 backdrop-blur-md shadow-md" : "bg-[#c9b8a3]"}`}
        style={{ zIndex: Z.header }}
        role="banner"
      >
        <nav className="border-b border-[#b5a087]" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">

            <a href="/" className="shrink-0" aria-label="TRADY - Gå til forsiden">
              <motion.img src={logoUrl} alt="TRADY Logo" className="h-10 sm:h-12 w-auto"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} />
            </a>

            <div className="hidden md:flex flex-1 max-w-xl mx-8" ref={searchRef}>
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7355]" />
                <input
                  type="search" placeholder="Søg" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={handleKey}
                  onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  className="w-full bg-white text-gray-800 placeholder-[#8b7355]/60 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
                  aria-label="Søg efter produkter"
                />
                <ResultsDropdown />
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-6">
              <a href="/om-os" className="text-white hover:text-white/80 transition-colors flex items-center space-x-2">
                <Info className="w-5 h-5" /><span className="text-sm font-medium">Om os</span>
              </a>
              <a href="/kontakt" className="text-white hover:text-white/80 transition-colors flex items-center space-x-2">
                <Mail className="w-5 h-5" /><span className="text-sm font-medium">Kontakt</span>
              </a>
              <a href={authLink.url} className="text-white hover:text-white/80 transition-colors flex items-center space-x-2" aria-label={authLink.text}>
                <AuthIcon className="w-5 h-5" />
                <span className="text-sm font-medium">{authLink.text}</span>
              </a>
              <div className="relative">
                <button onClick={() => setCartOpen(!cartOpen)}
                  className="relative cursor-pointer text-white hover:text-white/80 transition-colors flex items-center space-x-2"
                  aria-label="Indkøbskurv" aria-expanded={cartOpen}
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#8b7355] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">Kurv</span>
                </button>
              </div>
            </div>

            <div className="lg:hidden flex items-center space-x-3">
              <button onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors" aria-label="Søg">
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => setCartOpen(!cartOpen)}
                className="relative p-2 text-white" aria-label="Indkøbskurv">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#8b7355] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-b border-[#b5a087]" role="search"
            >
              <div className="px-4 py-3" ref={mobileSearchRef}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7355]" />
                  <input
                    type="search" placeholder="Søg efter produkter..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={handleKey}
                    onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                    className="w-full bg-white text-gray-800 placeholder-[#8b7355]/60 rounded-full pl-11 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
                    autoFocus aria-label="Søg efter produkter"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b7355]" aria-label="Luk søgning">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <ResultsDropdown mobile />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="bg-[#b5a087]" aria-label="Kategori navigation">
          <div className="max-w-7xl mx-auto">
            <div className="hidden md:flex items-center justify-center space-x-12 py-3">
              {navItems.map((item, idx) => (
                <motion.a key={item.name} href={item.url} onClick={() => handleNavClick(item.name)}
                  className="group relative pb-1 text-white/80 hover:text-white transition-colors duration-200"
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.25 }}
                  aria-current={active === item.name ? "page" : undefined}
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-white/40 rounded-full transition-all duration-300 group-hover:w-full" />
                  {active === item.name && (
                    <motion.span layoutId="active-underline"
                      className="absolute left-0 -bottom-0.5 h-0.5 w-full bg-white rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                  )}
                </motion.a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {createPortal(
        <AnimatePresence>
          {cartOpen && (
            <>
              <div
                className="fixed inset-0 hidden lg:block"
                style={{ zIndex: Z.cartBackdrop }}
                onClick={() => setCartOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="fixed hidden lg:block bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 w-80"
                style={{ zIndex: Z.cartPanel, top: headerHeight, right: 24 }}
                role="dialog" aria-label="Mini indkøbskurv"
              >
                <CartContents />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 lg:hidden"
                style={{ zIndex: Z.cartBackdrop }}
                onClick={() => setCartOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl lg:hidden"
                style={{ zIndex: Z.cartPanel }}
                role="dialog" aria-label="Indkøbskurv"
              >
                <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b">
                  <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Kurv
                    {cartItemCount > 0 && (
                      <span className="bg-[#b5a087] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {cartItemCount}
                      </span>
                    )}
                  </h2>
                  <button onClick={() => setCartOpen(false)} className="p-1 text-gray-500 hover:text-gray-900" aria-label="Luk kurv">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <CartContents />
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50"
                style={{ zIndex: Z.menuBackdrop }}
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }} transition={{ duration: 0.3 }}
                className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#c9b8a3] shadow-2xl overflow-y-auto"
                style={{ zIndex: Z.menuPanel }}
                role="dialog" aria-modal="true" aria-label="Mobil menu"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <img src={logoUrl} alt="TRADY" className="h-10 w-auto" />
                    <button onClick={() => setMenuOpen(false)}
                      className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors" aria-label="Luk menu">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-3">Kategorier</h3>
                      <div className="space-y-1">
                        {navItems.map((item) => (
                          <a key={item.name} href={item.url} onClick={() => handleNavClick(item.name)}
                            className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                              active === item.name ? "bg-white/20 text-white font-medium" : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </section>
                    <section className="pt-4 border-t border-white/20">
                      <div className="space-y-2">
                        <a href={authLink.url}
                          className="flex items-center space-x-3 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                          <AuthIcon className="w-5 h-5" /><span>{authLink.text}</span>
                        </a>
                        <a href="/om-os"
                          className="flex items-center space-x-3 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                          <Info className="w-5 h-5" /><span>Om os</span>
                        </a>
                        <a href="/kontakt"
                          className="flex items-center space-x-3 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                          <Mail className="w-5 h-5" /><span>Kontakt</span>
                        </a>
                      </div>
                    </section>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Header;