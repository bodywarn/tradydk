import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Check, ShoppingCart, ChevronLeft, ChevronRight, Sparkles, Info, X, Truck } from 'lucide-react';
import { useCart, type PrintType } from '@/context/CartContext';
import type { CartItem } from '@/context/CartContext';

interface Color { name: string; hex: string; stock: number; image_url?: string; }
interface Size { name: string; stock: number; }
interface TierPrice { minQuantity: number; maxQuantity: number | null; price: number; }
interface Product {
  id: string; name: string; category: string; price: number; stock: number;
  image_url: string; images?: string[]; status: string; description?: string;
  features?: string[]; colors?: Color[]; sizes?: Size[]; discount?: number;
  tierPrices?: TierPrice[]; customizable?: boolean;
}
interface PrintTypeOption { id: PrintType; name: string; description: string; price: number; }

const printTypeOptions: PrintTypeOption[] = [
  { id: 'screen', name: 'Silketryk', description: 'Klassisk og holdbar printmetode, perfekt til store oplag', price: 15 },
  { id: 'embroidery', name: 'Broderi', description: 'Premium kvalitet med broderet logo', price: 35 },
  { id: 'dtg', name: 'DTG Print', description: 'Digital tekstilprint med høj detaljegrad', price: 25 },
  { id: 'vinyl', name: 'Vinyl', description: 'Flex/flock print med stærke farver', price: 20 },
];

function getDeliveryRange() {
  const today = new Date();
  const from = new Date(today); from.setDate(today.getDate() + 11);
  const to = new Date(today); to.setDate(today.getDate() + 63);
  const fmt = (d: Date) => d.toLocaleDateString('da-DK', { day: 'numeric', month: 'long' });
  return { from: fmt(from), to: fmt(to) };
}

const DeliveryModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="absolute inset-0 bg-black/50" />
    <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 z-10" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#b5a087]" /> Leveringstid
        </h3>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
        <p>
          Når vi har modtaget din ordre, sender vi et <strong>korrekturprint til godkendelse</strong>.
          Godkendelse af print tager typisk <strong>1–3 hverdage</strong> og er ofte klaret allerede inden for 1 dag.
        </p>
        <p>
          Herefter påbegyndes <strong>produktionen</strong>, som normalt tager <strong>5–15 hverdage</strong>,
          og i mange tilfælde er færdig inden for cirka 1 uge.
        </p>
        <p>
          <strong>Forsendelsestiden</strong> afhænger af ordrestørrelsen. Mindre ordrer leveres typisk inden for{" "}
          <strong>5–15 dage</strong>, mens større ordrer har en leveringstid på ca. <strong>30–45 dage</strong>.
        </p>

        <div className="bg-[#f5f0ea] rounded-xl p-4 space-y-3">
          <p className="font-semibold text-gray-900">Samlet leveringstid:</p>
          <div className="flex items-start gap-2">
            <span className="text-[#b5a087] font-bold">•</span>
            <span><strong>Mindre ordrer:</strong> ca. 11–33 dage</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#b5a087] font-bold">•</span>
            <span><strong>Større ordrer:</strong> ca. 36–63 dage</span>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full py-3 bg-[#b5a087] hover:bg-[#a08f76] text-white rounded-lg font-semibold transition"
      >
        Forstået
      </button>
    </div>
  </div>
);

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewingColorImage, setViewingColorImage] = useState(false);
  const [selectedPrintType, setSelectedPrintType] = useState<PrintType | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const delivery = getDeliveryRange();

  useEffect(() => { loadProduct(); }, [id]);
  useEffect(() => {
    if (product?.colors?.length) {
      setSelectedColor(product.colors[0]);
      if (product.colors[0].image_url) setViewingColorImage(true);
    }
  }, [product]);

  const loadProduct = async () => {
    if (!id) return;
    try {
      const productDoc = await getDoc(doc(db, 'products', id));
      if (productDoc.exists()) { setProduct({ ...productDoc.data() as Product, id: productDoc.id }); }
      else { navigate('/'); }
    } catch (err) { console.error(err); navigate('/'); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#b5a087]" />
        <p className="mt-4 text-gray-600">Indlæser produkt...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produkt ikke fundet</h1>
        <button onClick={() => navigate('/')} className="text-[#b5a087] hover:underline flex items-center gap-2 mx-auto"><ArrowLeft className="w-4 h-4" /> Tilbage</button>
      </div>
    </div>
  );

  const getCartQuantityForProduct = () => cartItems.filter(i => i.productId === product.id).reduce((s, i) => s + i.quantity, 0);

  const getPriceForQuantity = (qty: number): number => {
    if (!product.tierPrices?.length) return product.price;
    const validTiers = product.tierPrices.filter(tp => tp.price > 0);
    if (!validTiers.length) return product.price;
    const totalQty = qty + getCartQuantityForProduct();
    const tier = validTiers.find(t => totalQty >= t.minQuantity && (t.maxQuantity === null || totalQty <= t.maxQuantity));
    return tier ? tier.price : product.price;
  };

  const getPriceRange = () => {
    if (!product.tierPrices?.length) return null;
    const validPrices = product.tierPrices.filter(tp => tp.price > 0).map(tp => tp.price);
    if (!validPrices.length) return null;
    const maxTier = product.tierPrices.find(tp => tp.maxQuantity === null);
    const minTier = product.tierPrices.find(tp => tp.minQuantity === 1);
    return { minPrice: Math.min(...validPrices), maxPrice: Math.max(...validPrices), minQty: minTier?.maxQuantity || 10, maxQty: maxTier?.minQuantity || 200 };
  };

  const currentPrice = getPriceForQuantity(quantity);
  const printPrice = selectedPrintType ? printTypeOptions.find(p => p.id === selectedPrintType)?.price || 0 : 0;
  const totalPricePerItem = currentPrice + printPrice;
  const discountedPrice = product.discount ? Math.floor(totalPricePerItem * (1 - product.discount / 100)) : totalPricePerItem;
  const priceRange = getPriceRange();
  const cartQuantity = getCartQuantityForProduct();
  const images = product.images?.length ? product.images : [product.image_url];
  const totalImages = images.length + (selectedColor?.image_url ? 1 : 0);

  const getDisplayImage = () => viewingColorImage && selectedColor?.image_url ? selectedColor.image_url : images[currentImageIndex] || product.image_url;
  const nextImage = () => { if (viewingColorImage) { setViewingColorImage(false); setCurrentImageIndex(0); } else { setCurrentImageIndex(p => (p + 1) % images.length); } };
  const prevImage = () => { if (viewingColorImage) { setViewingColorImage(false); setCurrentImageIndex(images.length - 1); } else { setCurrentImageIndex(p => (p - 1 + images.length) % images.length); } };
  const handleColorSelect = (color: Color) => { setSelectedColor(color); if (color.image_url) { setViewingColorImage(true); } else { setViewingColorImage(false); setCurrentImageIndex(0); } };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length) { alert('Vælg venligst en størrelse'); return; }
    addToCart({ productId: product.id, name: product.name, price: discountedPrice, quantity, size: selectedSize || 'Ingen størrelse', color: selectedColor?.name || 'Standard', image: getDisplayImage(), basePrice: currentPrice, printType: selectedPrintType || undefined } as CartItem);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      {showDeliveryModal && <DeliveryModal onClose={() => setShowDeliveryModal(false)} />}
      <div className="bg-white text-gray-900 min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
              <ArrowLeft className="w-5 h-5" /> Tilbage
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              <div className="space-y-4">
                <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group">
                  <img src={getDisplayImage()} alt={product.name} className="w-full h-full object-cover" />
                  {product.stock === 0 ? (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">Udsolgt</div>
                  ) : product.stock < 10 ? (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">Få tilbage</div>
                  ) : null}
                  {totalImages > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft className="w-6 h-6 text-gray-900" /></button>
                      <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-6 h-6 text-gray-900" /></button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {selectedColor?.image_url && <button onClick={() => setViewingColorImage(true)} className={`w-2 h-2 rounded-full transition ${viewingColorImage ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}`} />}
                        {images.map((_, idx) => <button key={idx} onClick={() => { setViewingColorImage(false); setCurrentImageIndex(idx); }} className={`w-2 h-2 rounded-full transition ${!viewingColorImage && idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}`} />)}
                      </div>
                    </>
                  )}
                </div>

                {totalImages > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {selectedColor?.image_url && (
                      <button onClick={() => setViewingColorImage(true)} className={`aspect-square rounded-lg overflow-hidden border-2 transition relative ${viewingColorImage ? 'border-[#b5a087] ring-2 ring-blue-300' : 'border-gray-300 hover:border-gray-400'}`}>
                        <img src={selectedColor.image_url} alt={`${selectedColor.name} farve`} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">Farve</div>
                      </button>
                    )}
                    {images.map((img, idx) => (
                      <button key={idx} onClick={() => { setViewingColorImage(false); setCurrentImageIndex(idx); }} className={`aspect-square rounded-lg overflow-hidden border-2 transition ${!viewingColorImage && idx === currentImageIndex ? 'border-[#b5a087] ring-2 ring-blue-300' : 'border-gray-300 hover:border-gray-400'}`}>
                        <img src={img} alt={`${product.name} billede ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {product.colors?.length && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Tilgængelige farver</h3>
                    <div className="flex gap-3 flex-wrap">
                      {product.colors.map(color => (
                        <button key={color.name} onClick={() => handleColorSelect(color)}
                          className={`w-12 h-12 rounded-full border-3 transition ${selectedColor?.name === color.name ? 'border-[#b5a087] ring-2 ring-blue-300' : 'border-gray-300 hover:border-gray-400'} ${color.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          style={{ backgroundColor: color.hex }} title={`${color.name}${color.stock === 0 ? ' (Udsolgt)' : ''}`} disabled={color.stock === 0} />
                      ))}
                    </div>
                    {selectedColor && (
                      <p className="text-sm text-gray-600 mt-2">Valgt: <span className="font-medium text-gray-900 capitalize">{selectedColor.name}</span>
                        {selectedColor.stock === 0 ? <span className="text-red-600 ml-2">(Udsolgt)</span> : <span className="text-green-600 ml-2">(På lager)</span>}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide">{product.category}</p>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                  <div className="space-y-3">
                    {priceRange ? (
                      <div className="bg-[#efe7da] border border-[#b5a087] rounded-lg p-4 shadow-sm shadow-[#b5a087]/20">
                        <p className="text-sm text-[#735d44] mb-2 font-semibold">Mængderabatter tilgængelig</p>
                        <p className="text-2xl font-bold text-gray-900">{priceRange.minPrice}–{priceRange.maxPrice} kr/stk</p>
                        <p className="text-xs text-green-700 font-medium mt-1 flex items-center gap-1"><Truck className="w-3 h-3" /> Inklusiv fragt</p>
                        <p className="text-xs text-gray-700 mt-1">Pris pr. stk falder ved køb af flere – blandede farver og størrelser tæller sammen!</p>
                        {cartQuantity > 0 && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded"><p className="text-xs text-green-800">✓ Du har allerede {cartQuantity} stk i kurven</p></div>}
                        <div className="mt-3 pt-3 border-t border-[#b5a087]">
                          <p className="text-sm text-[#735d44] mb-1">Din pris ved {quantity + cartQuantity} stk i alt:</p>
                          <div className="flex items-center gap-3">
                            <p className="text-2xl font-bold text-gray-900">{currentPrice} kr/stk</p>
                            {selectedPrintType && <p className="text-sm text-gray-700">+ {printPrice} kr (print)</p>}
                          </div>
                          <p className="text-lg text-gray-700 mt-1">= {(discountedPrice * quantity).toFixed(0)} kr for {quantity} stk</p>
                        </div>
                        <div className="mt-4 space-y-1">
                          <p className="text-xs font-semibold text-[#735d44] mb-2">Prisstruktur (basis pris):</p>
                          {product.tierPrices?.filter(tp => tp.price > 0).map((tier, idx) => {
                            const isActive = (quantity + cartQuantity) >= tier.minQuantity && (tier.maxQuantity === null || (quantity + cartQuantity) <= tier.maxQuantity);
                            return <div key={idx} className={`flex justify-between text-xs ${isActive ? 'text-gray-900 font-bold' : 'text-gray-600'}`}><span>{tier.minQuantity}–{tier.maxQuantity === null ? '+' : tier.maxQuantity} stk:</span><span>{tier.price} kr/stk</span></div>;
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <p className="text-3xl font-bold text-gray-900">{discountedPrice} kr</p>
                        {product.discount && <><p className="text-lg text-gray-500 line-through">{product.price} kr</p><span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">-{product.discount}%</span></>}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    {product.stock === 0 ? <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-bold">Udsolgt</span> : <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold">✓ På lager</span>}
                    <button onClick={() => setShowDeliveryModal(true)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#b5a087] transition group">
                      <Truck className="w-4 h-4 text-[#b5a087]" />
                      <span>Forventet levering: mellem <strong>{delivery.from}</strong> og <strong>{delivery.to}</strong><span className="text-xs ml-1 text-gray-400">(oftest ~5-7 uger)</span></span>
                      <Info className="w-3 h-3 text-gray-400 group-hover:text-[#b5a087] transition" />
                    </button>
                  </div>
                </div>

                {product.customizable && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vælg tryk type (valgfrit)</h3>
                    <div className="space-y-3">
                      <button onClick={() => setSelectedPrintType(null)} className={`w-full p-4 rounded-lg border-2 transition text-left ${selectedPrintType === null ? 'border-[#b5a087] bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                        <div className="flex items-center justify-between"><div><p className="font-semibold text-gray-900">Ingen tryk</p><p className="text-sm text-gray-600">Blank produkt uden tryk</p></div>{selectedPrintType === null && <Check className="w-5 h-5 text-[#b5a087]" />}</div>
                      </button>
                      {printTypeOptions.map(pt => (
                        <button key={pt.id} onClick={() => setSelectedPrintType(pt.id)} className={`w-full p-4 rounded-lg border-2 transition text-left ${selectedPrintType === pt.id ? 'border-[#b5a087] bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                          <div className="flex items-center justify-between"><div><p className="font-semibold text-gray-900">{pt.name}</p><p className="text-sm text-gray-600">{pt.description}</p><p className="text-sm font-medium text-[#b5a087] mt-1">+{pt.price} kr per stk</p></div>{selectedPrintType === pt.id && <Check className="w-5 h-5 text-[#b5a087]" />}</div>
                        </button>
                      ))}
                    </div>
                    {selectedPrintType && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                        <Info className="w-4 h-4 text-yellow-700 mt-0.5 shrink-0" />
                        <p className="text-sm text-yellow-800">Bemærk: Forskellige tryk typer kan ikke kombineres for mængderabat.</p>
                      </div>
                    )}
                  </div>
                )}

                {product.sizes?.length && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vælg størrelse</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {product.sizes.map(size => (
                        <button key={size.name} onClick={() => setSelectedSize(size.name)} disabled={size.stock === 0}
                          className={`py-3 px-4 rounded-lg font-semibold transition border-2 ${selectedSize === size.name ? 'bg-[#b5a087] text-white border-[#b5a087]' : size.stock === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-900 border-gray-300 hover:border-[#b5a087]'}`}>
                          {size.name}<span className="text-xs block">{size.stock === 0 ? 'Udsolgt' : 'På lager'}</span>
                        </button>
                      ))}
                    </div>
                    {selectedSize && <p className="text-sm text-gray-600 mt-3">✓ Størrelse <span className="font-medium">{selectedSize}</span> valgt</p>}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mængde</h3>
                  <div className="flex items-center gap-4 bg-gray-100 w-fit rounded-lg p-2">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-200 transition font-bold text-xl">−</button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-200 transition font-bold text-xl">+</button>
                  </div>
                  {priceRange && <p className="text-sm text-gray-600 mt-2">💡 Køb flere for bedre pris! Ved {quantity + cartQuantity} stk i alt betaler du {currentPrice} kr/stk</p>}
                </div>




                <div className="grid grid-cols-2 gap-4">

                  <button
                    onClick={() => navigate(`/produkt/${product.id}/studio/`)}
                    disabled={product.stock === 0}
                    className={`py-4 px-6 rounded-lg font-bold text-lg transition flex items-center justify-center gap-3 ${product.stock === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#b5a087] to-[#9d8976] text-white hover:shadow-xl hover:scale-105'
                      }`}
                  >
                    <Sparkles className="w-5 h-5" /> Tilpas
                  </button>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`py-4 px-6 rounded-lg font-bold text-lg transition flex items-center justify-center gap-3 ${addedToCart ? 'bg-green-600 text-white' : product.stock === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#fff] border border-2 border-[#b5a087] text-[#b5a087] hover:bg-[#b5a087] hover:text-white hover:shadow-xl hover:scale-105'}`}
                  >
                    {addedToCart ? <><Check className="w-5 h-5" /> Tilføjet!</> : product.stock === 0 ? 'Udsolgt' : <><ShoppingCart className="w-5 h-5" />{selectedPrintType ? 'Køb uden logo' : 'Køb nu'}</>}
                  </button>

                </div>

                <p className="text-sm text-gray-600 text-center -mt-4">💡 Upload dit logo for at se hvordan det ser ud på produktet</p>

                {product.description && (
                  <div className="border-t pt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Om produktet</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                  </div>
                )}

                <div className="border-t pt-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Produktinformation</h3>
                  {product.features?.length ? <ul className="space-y-2 text-gray-600">{product.features.map((f, i) => <li key={i}>✓ {f}</li>)}</ul> : <p className="text-gray-600">Ingen produktinformation tilgængelig</p>}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProductDetail;