import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingCart, Info } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface TierPrice {
  minQuantity: number;
  maxQuantity: number | null;
  price: number;
}

interface ProductData {
  id: string;
  tierPrices?: TierPrice[];
  price: number;
}

const PRINT_TYPE_NAMES: Record<string, string> = {
  'dtg':        'DTG Print',
  'broderi':    'Broderi',
  'screen':     'Silketryk',
  'embroidery': 'Broderi',
  'vinyl':      'Vinyl',
}

const getPrintTypeName = (printType?: string): string => {
  if (!printType) return ''
  return PRINT_TYPE_NAMES[printType] ?? printType
}

const getSideName = (side?: string): string => {
  if (side === 'front') return 'Forside'
  if (side === 'back')  return 'Bagside'
  if (side === 'both')  return 'Begge sider'
  return ''
}

const Kurv: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [productsData, setProductsData] = useState<Map<string, ProductData>>(new Map())

  const cartTotal     = getCartTotal()
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    document.title = 'Indkøbskurv - TRADY | Se dine valgte produkter'
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', 'Se og rediger produkterne i din indkøbskurv hos TRADY. Kvalitets t-shirts, polos og hoodies til konkurrencedygtige priser med gratis fragt.')
    return () => { document.title = 'TRADY' }
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!cartItems.length) return
      try {
        const ids = [...new Set(cartItems.map(i => i.productId))]
        const map = new Map<string, ProductData>()
        for (const productId of ids) {
          const snap = await getDocs(query(collection(db, 'products'), where('__name__', '==', productId)))
          snap.forEach(doc => {
            const d = doc.data()
            map.set(doc.id, { id: doc.id, tierPrices: d.tierPrices, price: d.price })
          })
        }
        setProductsData(map)
      } catch (err) { console.error('Error loading product data:', err) }
    }
    load()
  }, [cartItems])

  const getItemGroupKey = (item: typeof cartItems[0]) =>
    [item.productId, item.customLogo || 'no-logo', item.decorationSide || 'no-side', item.decorationArea || 'no-area', item.printType || 'no-print'].join('|')

  const groupedItems = React.useMemo(() => {
    const groups = new Map<string, typeof cartItems>()
    cartItems.forEach(item => {
      const key = getItemGroupKey(item)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(item)
    })
    return groups
  }, [cartItems])

  const getTierPriceForGroup = (items: typeof cartItems): number => {
    if (!items.length) return 0
    const productData = productsData.get(items[0].productId)
    if (!productData?.tierPrices?.length) return items[0].price
    const totalQty   = items.reduce((sum, i) => sum + i.quantity, 0)
    const validTiers = productData.tierPrices.filter(tp => tp.price > 0)
    if (!validTiers.length) return items[0].price
    const match = validTiers.find(t => totalQty >= t.minQuantity && (t.maxQuantity === null || totalQty <= t.maxQuantity))
    return match ? match.price : productData.price
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Hjem',        item: 'https://trady.dk/' },
      { '@type': 'ListItem', position: 2, name: 'Indkøbskurv', item: 'https://trady.dk/kurv' },
    ],
  }

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

      <div className="bg-white text-gray-900 min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            <Link to="/produkter" className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition" aria-label="Tilbage til produkter">
              <ArrowLeft className="w-5 h-5" />
              <span>Tilbage til produkter</span>
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Indkøbskurv</h1>
            {cartItems.length > 0 && (
              <p className="text-gray-600 mb-8">Du har {cartItemCount} {cartItemCount === 1 ? 'produkt' : 'produkter'} i kurven</p>
            )}

            {cartItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Din kurv er tom</h2>
                <p className="text-gray-600 mb-8">Tilføj produkter fra vores kollektion for at komme i gang</p>
                <Link to="/produkter" className="inline-block px-6 py-3 bg-[#b5a087] text-white rounded-lg hover:bg-[#a08f76] transition font-medium">
                  Gå til produkter
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-6">
                  {Array.from(groupedItems.entries()).map(([groupKey, items]) => {
                    const totalQty      = items.reduce((sum, i) => sum + i.quantity, 0)
                    const tierPrice     = getTierPriceForGroup(items)
                    const groupTotal    = items.reduce((sum, i) => sum + tierPrice * i.quantity, 0)
                    const hasCustom     = !!items[0].customLogo
                    const productData   = productsData.get(items[0].productId)
                    const hasTierPricing = !!(productData?.tierPrices?.length)
                    const printName     = getPrintTypeName(items[0].printType)
                    const sideName      = getSideName(items[0].decorationSide)
                    const printExtra    = items[0].printExtraPrice

                    return (
                      <div key={groupKey} className="bg-white rounded-lg shadow-sm p-6">

                        <div className="mb-4 pb-4 border-b">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h3 className="text-lg font-bold text-gray-900">{items[0].name}</h3>

                              {hasCustom && (
                                <div className="mt-2 space-y-1.5">
                                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f0ea] text-[#8a7560] rounded-full text-sm font-medium">
                                    ✨ Tilpasset
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-gray-600">
                                    {sideName && <span>📍 {sideName}</span>}

                                    {printName && (
                                      <span className="flex items-center gap-1">
                                        <span className="text-gray-400">·</span>
                                        <span className="font-semibold text-gray-800">{printName}</span>
                                        {printExtra && printExtra > 0
                                          ? <span className="text-[#b5a087] font-semibold">(+{printExtra} kr/stk)</span>
                                          : <span className="text-green-600 text-xs">(inkl.)</span>
                                        }
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              <p className="text-2xl font-bold text-gray-900">{groupTotal.toFixed(0)} kr</p>
                              {hasTierPricing && (
                                <p className="text-sm text-green-600 font-medium">{tierPrice.toFixed(0)} kr/stk ved {totalQty} stk</p>
                              )}
                            </div>
                          </div>

                          {hasTierPricing && productData?.tierPrices && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                                <div className="text-xs text-gray-700">
                                  <p className="font-semibold mb-1">Mængderabat aktiv</p>
                                  <p>I alt {totalQty} stk på tværs af farver og størrelser</p>
                                  <div className="mt-2 space-y-0.5">
                                    {productData.tierPrices.filter(tp => tp.price > 0).map((tier, idx) => {
                                      const active = totalQty >= tier.minQuantity && (tier.maxQuantity === null || totalQty <= tier.maxQuantity)
                                      return (
                                        <div key={idx} className="flex justify-between">
                                          <span className={active ? 'font-bold text-blue-700' : ''}>
                                            {tier.minQuantity}–{tier.maxQuantity === null ? '+' : tier.maxQuantity} stk:
                                          </span>
                                          <span className={active ? 'font-bold text-blue-700' : ''}>{tier.price} kr/stk</span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          {items.map(item => (
                            <article key={`${item.productId}-${item.size}-${item.color}-${item.customLogo}`} className="flex gap-4">
                              <div className="shrink-0 relative">
                                <img
                                  src={item.image}
                                  alt={`${item.name} i farven ${item.color}`}
                                  className="w-20 h-20 object-cover rounded-lg"
                                  loading="lazy"
                                />
                                {item.customLogo && (
                                  <div className="absolute -top-2 -right-2 w-9 h-9 bg-[#b5a087] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                    <img src={item.customLogo} alt="Logo" className="w-7 h-7 object-contain" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <dl className="text-sm text-gray-600 space-y-0.5">
                                  <div><dt className="inline">Farve: </dt><dd className="inline font-medium text-gray-900 capitalize">{item.color}</dd></div>
                                  <div><dt className="inline">Størrelse: </dt><dd className="inline font-medium text-gray-900">{item.size}</dd></div>
                                  <div><dt className="inline">Antal: </dt><dd className="inline font-medium text-gray-900">{item.quantity} stk</dd></div>
                                </dl>
                                <p className="text-sm text-gray-500 mt-1">
                                  {tierPrice.toFixed(0)} kr × {item.quantity} = {(tierPrice * item.quantity).toFixed(0)} kr
                                </p>
                              </div>

                              <div className="flex flex-col items-end gap-4">
                                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1" role="group">
                                  <button
                                    onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1, item.customLogo)}
                                    disabled={item.quantity <= 1}
                                    className="p-1.5 hover:bg-gray-200 rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
                                    aria-label={`Reducer antal for ${item.name}`}
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1, item.customLogo)}
                                    className="p-1.5 hover:bg-gray-200 rounded transition"
                                    aria-label={`Øg antal for ${item.name}`}
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.productId, item.size, item.color, item.customLogo)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                  aria-label={`Fjern ${item.name} fra kurven`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    )
                  })}

                  <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium hover:underline">
                    Tøm kurv
                  </button>
                </div>

                <aside className="lg:col-span-1" aria-label="Ordreopsummering">
                  <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Ordreopsummering</h2>

                    <dl className="space-y-2 border-b pb-4">
                      <div className="flex justify-between text-gray-600"><dt>Subtotal</dt><dd>{cartTotal.toFixed(0)} kr</dd></div>
                      <div className="flex justify-between text-gray-600"><dt>Forsendelse</dt><dd className="text-green-600 font-medium">Gratis</dd></div>
                      <div className="flex justify-between text-gray-600"><dt>Moms</dt><dd>Inkluderet</dd></div>
                    </dl>

                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>I alt</span>
                      <span>{cartTotal.toFixed(0)} kr</span>
                    </div>

                    <Link to="/checkout" className="w-full block text-center px-6 py-3 bg-[#b5a087] text-white rounded-lg hover:bg-[#a08f76] transition font-bold">
                      Gå til betaling
                    </Link>
                    <Link to="/produkter" className="w-full block text-center px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-medium">
                      Fortsæt shopping
                    </Link>

                    <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                      {[
                        'Gratis fragt på alle ordrer',
                        'Sikker betaling',
                      ].map(text => (
                        <div key={text} className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default Kurv