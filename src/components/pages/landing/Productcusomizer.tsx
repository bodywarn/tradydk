import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { ArrowLeft, Upload, X, RotateCcw, Check, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import type { CartItem } from '@/context/CartContext';

interface Color { name: string; hex: string; stock: number; image_url?: string }
interface Size  { name: string; stock: number }
interface TierPrice { minQuantity: number; maxQuantity: number | null; price: number }
interface DecorationArea { left: number; top: number; width: number; height: number }
interface PrintType { id: string; name: string; description: string; extraPrice: number; enabled: boolean }

interface Product {
  id: string; name: string; category: string; price: number; stock: number;
  image_url: string; images?: string[]; status: string; description?: string;
  colors?: Color[]; sizes?: Size[]; discount?: number;
  tierPrices?: TierPrice[];
  printTypes?: PrintType[];
  decorationAreaFront?: DecorationArea;
  decorationAreaBack?: DecorationArea;
  backImage?: string;
}

interface LogoState {
  image: string | null;
  x: number; y: number; scale: number; rotation: number;
  printTypeId: string;
}

const DEFAULT_LOGO: LogoState = { image: null, x: 50, y: 50, scale: 1, rotation: 0, printTypeId: 'dtg' }
const DEFAULT_AREA: DecorationArea = { left: 22, top: 22, width: 56, height: 52 }

const ProductCustomizer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct]               = useState<Product | null>(null);
  const [loading, setLoading]               = useState(true);
  const [selectedColor, setSelectedColor]   = useState<Color | null>(null);
  const [selectedSize, setSelectedSize]     = useState<string | null>(null);
  const [quantity, setQuantity]             = useState(1);
  const [addedToCart, setAddedToCart]       = useState(false);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [success, setSuccess]               = useState('');
  const [showLogoUpload, setShowLogoUpload] = useState<'front' | 'back' | null>(null);
  const [viewSide, setViewSide]             = useState<'front' | 'back'>('front');
  const [logoFront, setLogoFront]           = useState<LogoState>({ ...DEFAULT_LOGO });
  const [logoBack, setLogoBack]             = useState<LogoState>({ ...DEFAULT_LOGO });
  const [isDragging, setIsDragging]         = useState(false);
  const [showPriceTable, setShowPriceTable] = useState(false);

  const clipRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadProduct(); }, [id]);
  useEffect(() => {
    if (product?.colors?.length) setSelectedColor(product.colors[0]);
    if (product?.printTypes?.length) {
      const firstEnabled = product.printTypes.find(p => p.enabled);
      if (firstEnabled) {
        setLogoFront(prev => ({ ...prev, printTypeId: firstEnabled.id }));
        setLogoBack(prev => ({ ...prev, printTypeId: firstEnabled.id }));
      }
    }
  }, [product]);

  const loadProduct = async () => {
    if (!id) return;
    try {
      const snap = await getDoc(doc(db, 'products', id));
      if (snap.exists()) setProduct({ ...snap.data() as Product, id: snap.id });
      else navigate('/produkter');
    } catch { navigate('/produkter'); }
    finally { setLoading(false); }
  };

  const currentLogo    = viewSide === 'front' ? logoFront : logoBack;
  const setCurrentLogo = (updater: (prev: LogoState) => LogoState) =>
    viewSide === 'front' ? setLogoFront(updater) : setLogoBack(updater);

  const getProductImage = () => {
    if (viewSide === 'back' && product?.backImage) return product.backImage;
    return selectedColor?.image_url || product?.image_url || '';
  };

  const getDecorationArea = (): DecorationArea => {
    if (!product) return DEFAULT_AREA;
    return viewSide === 'front'
      ? (product.decorationAreaFront || DEFAULT_AREA)
      : (product.decorationAreaBack  || DEFAULT_AREA);
  };

  // Fjern "puff" fra listen af tryktyper i UI og prisberegning.
  // Hvis du foretrækker at styre det fra backend, så sæt enabled=false for puff i databasen.
  const availablePrintTypes = product?.printTypes?.filter(p => p.enabled && p.id !== 'puff') ?? [];

  const getActivePrintType = (logo: LogoState): PrintType | undefined =>
    availablePrintTypes.find(p => p.id === logo.printTypeId);

  const getPrintExtraPrice = (logo: LogoState): number =>
    getActivePrintType(logo)?.extraPrice ?? 0;

  const getBasePrice = (qty: number): number => {
    if (!product?.tierPrices?.length) return product?.price ?? 0;
    const match = product.tierPrices
      .filter(tp => qty >= tp.minQuantity && tp.price > 0)
      .sort((a, b) => b.minQuantity - a.minQuantity)[0];
    return match ? match.price : product.price;
  };

  const basePrice  = getBasePrice(quantity);
  const printExtra = (logoFront.image ? getPrintExtraPrice(logoFront) : 0)
                   + (logoBack.image  ? getPrintExtraPrice(logoBack)  : 0);
  const unitPrice  = basePrice + printExtra;
  const totalPrice = unitPrice * quantity;

  const nextTier = product?.tierPrices
    ?.filter(tp => tp.minQuantity > quantity && tp.price > 0)
    .sort((a, b) => a.minQuantity - b.minQuantity)[0];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Vælg venligst en billedfil'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Filen er for stor. Maks 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = ev.target?.result as string;
      const setter = side === 'front' ? setLogoFront : setLogoBack;
      setter(p => ({ ...p, image: img, x: 50, y: 50 }));
      setShowLogoUpload(null);
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!currentLogo.image) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !clipRef.current) return;
    const rect = clipRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left)  / rect.width)  * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top)   / rect.height) * 100));
    setCurrentLogo(prev => ({ ...prev, x, y }));
  };

  const handleMouseUp    = () => setIsDragging(false);
  const handleTouchStart = () => { if (currentLogo.image) setIsDragging(true); };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !clipRef.current) return;
    const rect = clipRef.current.getBoundingClientRect();
    const t = e.touches[0];
    const x = Math.max(5, Math.min(95, ((t.clientX - rect.left) / rect.width)  * 100));
    const y = Math.max(5, Math.min(95, ((t.clientY - rect.top)  / rect.height) * 100));
    setCurrentLogo(prev => ({ ...prev, x, y }));
  };

  const generateCompositeImage = (logo: LogoState, shirtSrc: string, area: DecorationArea): Promise<string> =>
    new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 600; canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(logo.image || ''); return; }
      const drawLogo = () => {
        if (!logo.image) { resolve(canvas.toDataURL('image/png')); return; }
        const img = new Image();
        img.onload = () => {
          const areaWpx = (area.width  / 100) * 600;
          const areaHpx = (area.height / 100) * 600;
          const logoW   = areaWpx * (logo.scale * 0.40);
          const logoH   = areaHpx * (logo.scale * 0.40);
          const canvasX = ((area.left + (logo.x / 100) * area.width)  / 100) * 600;
          const canvasY = ((area.top  + (logo.y / 100) * area.height) / 100) * 600;
          ctx.save();
          ctx.translate(canvasX, canvasY);
          ctx.rotate((logo.rotation * Math.PI) / 180);
          ctx.drawImage(img, -logoW / 2, -logoH / 2, logoW, logoH);
          ctx.restore();
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(canvas.toDataURL('image/png'));
        img.src = logo.image;
      };
      if (shirtSrc) {
        const shirt = new Image();
        shirt.crossOrigin = 'anonymous';
        shirt.onload  = () => { ctx.drawImage(shirt, 0, 0, 600, 600); drawLogo(); };
        shirt.onerror = () => { ctx.fillStyle = '#f5f0ea'; ctx.fillRect(0, 0, 600, 600); drawLogo(); };
        shirt.src = shirtSrc;
      } else {
        ctx.fillStyle = '#f5f0ea'; ctx.fillRect(0, 0, 600, 600); drawLogo();
      }
    });

  const handleAddToCart = async () => {
    if (!selectedSize && product?.sizes?.length) { alert('Vælg venligst en størrelse'); return; }
    if (!product) return;

    let compositeImage: string | undefined;
    const hasLogo = logoFront.image || logoBack.image;
    if (hasLogo) {
      setGeneratingPreview(true);
      try {
        const activeLogo = logoFront.image ? logoFront : logoBack;
        const area = logoFront.image
          ? (product.decorationAreaFront || DEFAULT_AREA)
          : (product.decorationAreaBack  || DEFAULT_AREA);
        compositeImage = await generateCompositeImage(activeLogo, getProductImage(), area);
      } catch {}
      setGeneratingPreview(false);
    }

    const frontPrintType = getActivePrintType(logoFront);
    const backPrintType  = getActivePrintType(logoBack);

    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: unitPrice,
      quantity,
      size: selectedSize || 'Ingen størrelse',
      color: selectedColor?.name || 'Standard',
      image: compositeImage || selectedColor?.image_url || product.image_url,
      customLogo: logoFront.image || logoBack.image || undefined,
      logoPosition: logoFront.image
        ? { x: logoFront.x, y: logoFront.y, scale: logoFront.scale, rotation: logoFront.rotation }
        : logoBack.image
          ? { x: logoBack.x, y: logoBack.y, scale: logoBack.scale, rotation: logoBack.rotation }
          : undefined,
      decorationSide: logoFront.image && logoBack.image ? 'both' as any
        : logoFront.image ? 'front'
        : logoBack.image  ? 'back'
        : undefined,
      printType: logoFront.image ? logoFront.printTypeId : logoBack.image ? logoBack.printTypeId : undefined,
      printExtraPrice: printExtra > 0 ? printExtra : undefined,
    };

    addToCart(cartItem);


    if (hasLogo) {
      try {
        const uploadLogo = async (logo: LogoState): Promise<string | null> => {
          if (!logo.image) return null;
          if (logo.image.startsWith('data:')) {
            const blob = await (await fetch(logo.image)).blob();
            const file = new File([blob], 'logo.png', { type: 'image/png' });
            return await uploadToCloudinary(file, 'tradydk/customizations');
          }
          return logo.image;
        };

        const primaryLogo  = logoFront.image ? logoFront : logoBack;
        const primarySide  = logoFront.image ? 'front' : 'back';
        const primaryPrint = primarySide === 'front' ? frontPrintType : backPrintType;
 
        const [frontUrl, backUrl] = await Promise.all([
          uploadLogo(logoFront),
          uploadLogo(logoBack),
        ]);

        const primaryUrl = primarySide === 'front' ? frontUrl : backUrl;
        if (!primaryUrl) throw new Error('Logo upload mislykkedes');

        const decorationSide = logoFront.image && logoBack.image
          ? 'both'
          : primarySide;

        await addDoc(collection(db, 'customizations'), {
          user_id:      user?.uid   || 'guest',
          user_email:   user?.email || 'Ikke logget ind',
          product_id:   product.id,
          product_name: product.name,
          customization_data: {
            logoImage:      primaryUrl,
            logoPosition: {
              x:        primaryLogo.x,
              y:        primaryLogo.y,
              scale:    primaryLogo.scale,
              rotation: primaryLogo.rotation,
            },
            decorationSide,
            selectedColor: selectedColor?.name || '',
            selectedSize:  selectedSize        || '',
            printType:     primaryLogo.printTypeId,
            printTypeName: primaryPrint?.name  || '',
            extraPrice:    primaryPrint?.extraPrice ?? 0,
            frontLogoUrl:  frontUrl  || null,
            backLogoUrl:   backUrl   || null,
            frontPrintType: logoFront.image ? logoFront.printTypeId  : null,
            backPrintType:  logoBack.image  ? logoBack.printTypeId   : null,
            decorationAreaFront: product.decorationAreaFront || DEFAULT_AREA,
            decorationAreaBack:  product.decorationAreaBack  || DEFAULT_AREA,
          },
          status:     'pending',
          created_at: new Date().toISOString(),
          notes:      '',
        });

        setSuccess('✓ Design sendt til godkendelse!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.warn('Design upload fejlede:', err);
      }
    }

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-[#b5a087] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-400 tracking-wide">Indlæser produkt…</p>
      </div>
    </div>
  );
  if (!product) return null;

  const area = getDecorationArea();

  return (
    <div className="min-h-screen bg-[#faf8f5]">

      {success && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium flex items-center gap-2">
          <Check className="w-4 h-4" /> {success}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
          Tilbage
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">

          <div className="space-y-3">

            <div className="flex gap-1 p-1 bg-white rounded-xl shadow-sm border border-gray-100 w-fit">
              {(['front', 'back'] as const).map(side => (
                <button
                  key={side}
                  onClick={() => setViewSide(side)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
                    viewSide === side ? 'bg-[#b5a087] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {side === 'front' ? 'Forside' : 'Bagside'}
                  {(side === 'front' ? logoFront : logoBack).image && (
                    <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-green-400 align-middle" />
                  )}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div
                className="relative aspect-square select-none"
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                onTouchMove={handleTouchMove}
              >
                <img
                  src={getProductImage()}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  draggable={false}
                />

                <div
                  ref={clipRef}
                  className="absolute overflow-hidden"
                  style={{
                    left:   `${area.left}%`,
                    top:    `${area.top}%`,
                    width:  `${area.width}%`,
                    height: `${area.height}%`,
                    cursor: currentLogo.image ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                >
                  {currentLogo.image && (
                    <div
                      className="absolute"
                      style={{
                        left:      `${currentLogo.x}%`,
                        top:       `${currentLogo.y}%`,
                        width:     `${currentLogo.scale * 40}%`,
                        height:    `${currentLogo.scale * 40}%`,
                        transform: `translate(-50%, -50%) rotate(${currentLogo.rotation}deg)`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease',
                      }}
                    >
                      <img
                        src={currentLogo.image}
                        alt="Logo"
                        className="w-full h-full object-contain drop-shadow-md"
                        draggable={false}
                      />
                    </div>
                  )}
                </div>

                <div
                  className="absolute pointer-events-none"
                  style={{
                    left:         `${area.left}%`,
                    top:          `${area.top}%`,
                    width:        `${area.width}%`,
                    height:       `${area.height}%`,
                    border:       '2px dashed rgba(181,160,135,0.7)',
                    borderRadius: '10px',
                  }}
                >
                  {!currentLogo.image && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#b5a087] text-white text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap font-medium">
                      Placer dit logo her
                    </div>
                  )}
                </div>

                {currentLogo.image && (
                  <button
                    className="absolute z-10 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-red-50 transition"
                    style={{
                      left:      `${area.left + area.width}%`,
                      top:       `${area.top}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => setCurrentLogo(p => ({ ...p, image: null }))}
                  >
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                )}

                {!currentLogo.image && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <button
                      className="pointer-events-auto bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-[#b5a087] rounded-2xl px-6 py-5 shadow-lg transition group text-center"
                      onClick={() => setShowLogoUpload(viewSide)}
                    >
                      <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#b5a087] mx-auto mb-1.5 transition" />
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-[#b5a087] transition">Upload logo</p>
                      <p className="text-xs text-gray-400 mt-0.5">PNG anbefales</p>
                    </button>
                  </div>
                )}
              </div>

              {currentLogo.image && (
                <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                        Størrelse <span className="font-normal normal-case">{Math.round(currentLogo.scale * 40)}%</span>
                      </label>
                      <input
                        type="range" min="0.3" max="2.5" step="0.05"
                        value={currentLogo.scale}
                        onChange={e => setCurrentLogo(p => ({ ...p, scale: parseFloat(e.target.value) }))}
                        className="w-full accent-[#b5a087]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                        Rotation <span className="font-normal normal-case">{currentLogo.rotation}°</span>
                      </label>
                      <input
                        type="range" min="-180" max="180" step="5"
                        value={currentLogo.rotation}
                        onChange={e => setCurrentLogo(p => ({ ...p, rotation: parseInt(e.target.value) }))}
                        className="w-full accent-[#b5a087]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentLogo(p => ({ ...p, x: 50, y: 50, scale: 1, rotation: 0 }))}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />Nulstil
                    </button>
                    <button
                      onClick={() => setCurrentLogo(p => ({ ...p, image: null }))}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white border border-red-100 text-xs font-medium text-red-500 hover:bg-red-50 transition"
                    >
                      <X className="w-3.5 h-3.5" />Fjern
                    </button>
                    <button
                      onClick={() => setShowLogoUpload(viewSide)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                    >
                      <Upload className="w-3.5 h-3.5" />Skift
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 text-sm text-gray-500 space-y-1">
              <p className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-2">Tips</p>
              <p>• PNG med transparent baggrund giver bedst resultat</p>
              <p>• Træk logoet inden for det stiplede område for at placere det</p>
              <p>• Tilføj logo på begge sider uafhængigt via knapperne øverst</p>
            </div>
          </div>

          <div className="space-y-4">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{product.name}</h1>

              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-bold text-gray-900">{unitPrice.toFixed(0)} kr</span>
                <span className="text-sm text-gray-400 mb-1">/ stk</span>
                {product?.tierPrices?.length && basePrice < product.price && (
                  <span className="mb-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Rabat aktiv</span>
                )}
              </div>

              {(logoFront.image || logoBack.image) && printExtra > 0 && (
                <div className="mt-2 mb-3 p-3 bg-[#f5f0ea] rounded-xl text-xs space-y-1">
                  <p className="font-semibold text-[#8a7560]">Prisopgørelse per stk:</p>
                  <div className="flex justify-between text-gray-600">
                    <span>Grundpris</span>
                    <span className="font-medium">{basePrice.toFixed(0)} kr</span>
                  </div>
                  {logoFront.image && getPrintExtraPrice(logoFront) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tryk forside ({getActivePrintType(logoFront)?.name})</span>
                      <span className="font-medium">+{getPrintExtraPrice(logoFront)} kr</span>
                    </div>
                  )}
                  {logoBack.image && getPrintExtraPrice(logoBack) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tryk bagside ({getActivePrintType(logoBack)?.name})</span>
                      <span className="font-medium">+{getPrintExtraPrice(logoBack)} kr</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-[#8a7560] border-t border-[#e8ddd2] pt-1 mt-1">
                    <span>I alt / stk</span>
                    <span>{unitPrice.toFixed(0)} kr</span>
                  </div>
                </div>
              )}

              {nextTier && (
                <p className="text-xs text-[#b5a087] mb-3">
                  Køb {nextTier.minQuantity - quantity} mere og spar — {nextTier.price.toFixed(0)} kr/stk
                </p>
              )}

              {product.tierPrices && product.tierPrices.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowPriceTable(p => !p)}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPriceTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    Se alle mængdepriser
                  </button>
                  {showPriceTable && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-gray-100">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-50 text-gray-500">
                            <th className="text-left px-3 py-2 font-semibold">Antal</th>
                            <th className="text-right px-3 py-2 font-semibold">Grundpris / stk</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...product.tierPrices]
                            .filter(tp => tp.price > 0)
                            .sort((a, b) => a.minQuantity - b.minQuantity)
                            .map((tp, i, arr) => {
                              const isActive = quantity >= tp.minQuantity && (!arr[i + 1] || quantity < arr[i + 1].minQuantity);
                              return (
                                <tr key={i} className={`border-t border-gray-100 ${isActive ? 'bg-[#f5f0ea]' : ''}`}>
                                  <td className="px-3 py-2 text-gray-700">
                                    {tp.minQuantity}{tp.maxQuantity ? `–${tp.maxQuantity}` : '+'} stk
                                    {isActive && <span className="ml-1.5 text-[#b5a087] font-bold">←</span>}
                                  </td>
                                  <td className="px-3 py-2 text-right font-semibold text-gray-900">{tp.price.toFixed(0)} kr</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
                {product.stock > 0 ? 'På lager' : 'Udsolgt'}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
                    Farve {selectedColor && <span className="font-normal normal-case text-gray-700">— {selectedColor.name}</span>}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        disabled={color.stock === 0}
                        title={color.name}
                        className={`w-9 h-9 rounded-lg border-2 transition shadow-sm ${
                          selectedColor?.name === color.name ? 'border-[#b5a087] ring-2 ring-[#b5a087]/20' : 'border-gray-200 hover:border-gray-300'
                        } ${color.stock === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Størrelse</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size.name)}
                        disabled={size.stock === 0}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                          selectedSize === size.name ? 'bg-[#b5a087] text-white border-[#b5a087]'
                          : size.stock === 0 ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#b5a087]'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Antal</p>
                <div className="flex items-center bg-gray-100 rounded-xl w-fit">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center rounded-l-xl hover:bg-gray-200 transition font-bold text-gray-700 text-lg">−</button>
                  <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center rounded-r-xl hover:bg-gray-200 transition font-bold text-gray-700 text-lg">+</button>
                </div>
              </div>
            </div>

            {(logoFront.image || logoBack.image) && availablePrintTypes.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Tryk-type
                  <span className="ml-1.5 font-normal normal-case text-gray-400">
                    — {viewSide === 'front' ? 'Forside' : 'Bagside'}
                  </span>
                </p>
                <div className="flex flex-col gap-2">
                  {availablePrintTypes.map(pt => {
                    const isActive = currentLogo.printTypeId === pt.id;
                    return (
                      <button
                        key={pt.id}
                        onClick={() => setCurrentLogo(p => ({ ...p, printTypeId: pt.id }))}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition ${
                          isActive ? 'border-[#b5a087] bg-[#f5f0ea]' : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <p className={`text-sm font-bold ${isActive ? 'text-[#8a7560]' : 'text-gray-700'}`}>{pt.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{pt.description}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          {pt.extraPrice === 0 ? (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              Inkluderet
                            </span>
                          ) : (
                            <span className={`text-sm font-bold ${isActive ? 'text-[#b5a087]' : 'text-gray-500'}`}>
                              +{pt.extraPrice} kr
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{quantity} stk × {unitPrice.toFixed(0)} kr</span>
                <span className="font-semibold text-gray-900">{totalPrice.toFixed(0)} kr</span>
              </div>
              {(logoFront.image || logoBack.image) && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    Tryk:{' '}
                    {[
                      logoFront.image && `forside (${getActivePrintType(logoFront)?.name ?? logoFront.printTypeId})`,
                      logoBack.image  && `bagside (${getActivePrintType(logoBack)?.name  ?? logoBack.printTypeId})`
                    ].filter(Boolean).join(' + ')}
                  </span>
                  {printExtra > 0 ? (
                    <span className="font-medium text-[#b5a087]">+{printExtra} kr/stk</span>
                  ) : (
                    <span className="text-xs text-green-600 font-medium self-center">Inkluderet</span>
                  )}
                </div>
              )}
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>{totalPrice.toFixed(0)} kr</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || generatingPreview}
              className={`w-full py-4 rounded-xl font-bold text-base transition flex items-center justify-center gap-2.5 shadow-sm ${
                addedToCart         ? 'bg-green-600 text-white'
                : generatingPreview ? 'bg-amber-400 text-white cursor-wait'
                : product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#b5a087] text-white hover:bg-[#9e8a72]'
              }`}
            >
              {addedToCart          ? <><Check className="w-5 h-5" />Tilføjet til kurv!</>
                : generatingPreview ? 'Forbereder design…'
                : product.stock === 0 ? 'Udsolgt'
                : <><ShoppingCart className="w-4 h-4" />Læg i kurv — {totalPrice.toFixed(0)} kr</>
              }
            </button>

            {product.description && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Om produktet</p>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLogoUpload && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowLogoUpload(null)}
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Upload logo — {showLogoUpload === 'front' ? 'Forside' : 'Bagside'}
              </h2>
              <button onClick={() => setShowLogoUpload(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-200 hover:border-[#b5a087] hover:bg-[#faf8f5] rounded-xl p-8 text-center transition group">
                <input type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, showLogoUpload)} />
                <Upload className="w-10 h-10 text-gray-300 group-hover:text-[#b5a087] mx-auto mb-3 transition" />
                <p className="font-semibold text-sm text-gray-600 group-hover:text-[#b5a087] transition">Vælg fil</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, SVG — maks 5 MB</p>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCustomizer;