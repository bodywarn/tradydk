import { useEffect, useState, type ChangeEventHandler } from "react"
import { LayoutDashboard, Package, ShoppingCart, Users, Plus, Edit2, Trash2, Search, DollarSign, Save, X, Upload, Link as LinkIcon, Check, AlertCircle, ChevronDown, ChevronUp, RefreshCw, Ban, CheckCircle2, Home, FileText } from "lucide-react"
import { useAuth } from "../../../hooks/useAuth"
import { db } from "@/lib/firebase"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { getMaintenanceMode, setMaintenanceMode as saveMaintenance } from "@/lib/maintenanceMode"
import {
  collection, query, orderBy, getDocs, addDoc, updateDoc,
  deleteDoc, doc, getDoc, setDoc, Timestamp
} from "firebase/firestore"
import { useNavigate } from "react-router"

interface Color { name: string; hex: string; stock: number; image_url?: string }
interface Size { name: string; stock: number }
interface TierPrice { minQuantity: number; maxQuantity: number | null; price: number }
interface PrintType { id: string; name: string; description: string; extraPrice: number; enabled: boolean }
interface DecorationArea { left: number; top: number; width: number; height: number }
interface Product {
  id: string; name: string; category: string; price: number; stock: number;
  image_url: string; images?: string[]; status: string; description?: string;
  features?: string[]; colors?: Color[]; sizes?: Size[]; discount?: number;
  tierPrices?: TierPrice[]; printTypes?: PrintType[]; updated_at: string;
  decorationAreaFront?: DecorationArea; decorationAreaBack?: DecorationArea;
  backImage?: string;
}
interface StripeOrder {
  id: string; sessionId: string; paymentIntentId: string; customerEmail: string
  customerName: string; amountTotal: number; status: 'pending' | 'accepted' | 'rejected' | 'refunded'
  stripeStatus: string; lineItems: { name: string; quantity: number; price: number; description?: string; image?: string }[]
  shippingAddress?: { line1: string; city: string; postal_code: string; country: string }
  created_at: string; notes?: string
}
interface Customer { id: string; email: string; name: string; phone: string; role: string; created_at: string }
interface Customization {
  id: string; user_id: string; user_email: string; product_id: string; product_name: string;
  customization_data: { logoImage: string; logoPosition: { x: number; y: number; scale: number; rotation: number }; decorationSide: 'front' | 'back'; selectedColor: string; selectedSize: string };
  status: 'pending' | 'approved' | 'rejected'; created_at: string; notes: string;
  deliveryStatus?: string;
  sessionId?: string;
}

const DEFAULT_PRINT_TYPES: PrintType[] = [
  { id: 'dtg',     name: 'DTG (Direct to Garment)', description: 'Standard digital print direkte på stoffet — inkluderet i prisen', extraPrice: 0,  enabled: true  },
  { id: 'broderi', name: 'Broderi',                 description: 'Syet direkte ind i tøjet — holdbart og eksklusivt',              extraPrice: 25, enabled: false },
]

const DEFAULT_TIER_PRICES: TierPrice[] = [
  { minQuantity: 1,   maxQuantity: 10,  price: 0 },
  { minQuantity: 11,  maxQuantity: 30,  price: 0 },
  { minQuantity: 31,  maxQuantity: 50,  price: 0 },
  { minQuantity: 51,  maxQuantity: 100, price: 0 },
  { minQuantity: 101, maxQuantity: 200, price: 0 },
  { minQuantity: 201, maxQuantity: null, price: 0 },
]

const DEFAULT_DECORATION_AREA: DecorationArea = { left: 22, top: 22, width: 56, height: 52 }

const formatOrderNumber = (sessionId: string, createdAt: string) => {
  const clean = (sessionId || '').replace(/^cs_(test|live)_/, '');
  return `ORD-${new Date(createdAt).getFullYear()}-${clean.slice(0, 8).toUpperCase()}`;
};

// ─── DECORATION AREA EDITOR ────────────────────────────────────────────────
const DecorationAreaEditor = ({ label, area, previewImage, onChange }: {
  label: string; area: DecorationArea; previewImage: string; onChange: (area: DecorationArea) => void
}) => {
  const fields: { key: keyof DecorationArea; label: string; min: number; max: number }[] = [
    { key: 'left',   label: 'Venstre (%)', min: 0, max: 80 },
    { key: 'top',    label: 'Top (%)',      min: 0, max: 80 },
    { key: 'width',  label: 'Bredde (%)',  min: 5, max: 90 },
    { key: 'height', label: 'Højde (%)',   min: 5, max: 90 },
  ]
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
      <p className="text-sm font-bold text-gray-700">{label}</p>
      <div className="flex gap-4 items-start">
        <div className="relative w-36 h-36 shrink-0 bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          {previewImage ? <img src={previewImage} alt="preview" className="absolute inset-0 w-full h-full object-contain" /> : <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">Intet billede</div>}
          <div className="absolute border-2 border-dashed border-[#b5a087] rounded" style={{ left: `${area.left}%`, top: `${area.top}%`, width: `${area.width}%`, height: `${area.height}%`, backgroundColor: 'rgba(181,160,135,0.12)' }} />
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{f.label}</label>
              <div className="flex items-center gap-1.5">
                <input type="range" min={f.min} max={f.max} step="1" value={area[f.key]} onChange={e => onChange({ ...area, [f.key]: parseInt(e.target.value) })} className="flex-1 accent-[#b5a087]" />
                <span className="text-xs font-mono w-7 text-right text-gray-600">{area[f.key]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button type="button" onClick={() => onChange({ ...DEFAULT_DECORATION_AREA })} className="text-xs text-gray-400 hover:text-[#b5a087] transition">↺ Nulstil til standard</button>
    </div>
  )
}

// ─── DESIGN PREVIEW CARD (used inline in orders) ───────────────────────────
const DesignPreviewCard = ({ custom, products, onApprove, onReject, onUpdateDelivery, setSuccess, setError, loadCustomizations, formatDate }: {
  custom: Customization; products: Product[];
  onApprove: (id: string) => void; onReject: (id: string) => void;
  onUpdateDelivery: (id: string, status: 'received' | 'shipped' | 'failed') => void;
  setSuccess: (s: string) => void; setError: (s: string) => void;
  loadCustomizations: () => void; formatDate: (d: string) => string;
}) => {
  const [side, setSide] = useState<'front' | 'back'>('front')
  const data = custom.customization_data as any
  const logoImage = data.logoImage as string | undefined
  const logoPosition = data.logoPosition as { x: number; y: number; scale: number; rotation: number } | undefined
  const decorationSide = (data.decorationSide as string) || 'front'
  const selectedColor = data.selectedColor as string | undefined
  const selectedSize = data.selectedSize as string | undefined
  const printTypeName = data.printTypeName as string | undefined
  const printTypeId = data.printType as string | undefined
  const extraPrice = data.extraPrice as number | undefined
  const frontLogoUrl = (data.frontLogoUrl as string | null) || null
  const backLogoUrl = (data.backLogoUrl as string | null) || null
  const areaFront = data.decorationAreaFront || { left: 22, top: 22, width: 56, height: 52 }
  const areaBack = data.decorationAreaBack || { left: 22, top: 22, width: 56, height: 52 }
  const hasBothSides = !!(frontLogoUrl && backLogoUrl)
  const matched = products.find(p => p.name.toLowerCase().includes((custom.product_name || '').toLowerCase().split(' ')[0]))
  const frontShirtUrl = matched?.image_url || ''
  const backShirtUrl = (matched as any)?.backImage || matched?.image_url || ''
  const previewShirt = side === 'back' ? backShirtUrl : frontShirtUrl
  const previewLogoUrl = side === 'back' ? (backLogoUrl || logoImage || '') : (frontLogoUrl || logoImage || '')
  const previewArea = side === 'back' ? areaBack : areaFront
  const printBadgeClass: Record<string, string> = { dtg: 'bg-blue-100 text-blue-800', broderi: 'bg-purple-100 text-purple-800' }
  const printEmoji: Record<string, string> = { dtg: '🖨️', broderi: '🧵' }

  const handleDelete = async () => {
    if (!confirm("Slet dette design permanent?")) return
    try { await deleteDoc(doc(db, 'customizations', custom.id)); setSuccess("Design slettet!"); setTimeout(() => setSuccess(""), 3000); loadCustomizations() }
    catch (err: any) { setError(err.message) }
  }

  return (
    <div className="border border-[#e8ddd2] rounded-xl overflow-hidden bg-[#faf8f5]">
      <div className="px-4 py-2 bg-[#f0ebe4] border-b border-[#e8ddd2] flex items-center gap-2">
        <span className="text-xs font-bold text-[#8a7560] uppercase tracking-wider">Design tilknyttet ordre</span>
        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${custom.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : custom.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {custom.status === 'pending' ? '⏳ Afventer' : custom.status === 'approved' ? '✓ Godkendt' : '✗ Afvist'}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Preview */}
        <div className="bg-white flex flex-col" style={{ minHeight: '220px' }}>
          {hasBothSides && (
            <div className="flex gap-1 p-1.5 border-b border-gray-100">
              {(['front', 'back'] as const).map(s => (
                <button key={s} onClick={() => setSide(s)} className={`flex-1 py-1 rounded-lg text-xs font-semibold transition ${side === s ? 'bg-[#b5a087] text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  {s === 'front' ? '↑ Forside' : '↓ Bagside'}
                </button>
              ))}
            </div>
          )}
          <div className="relative flex-1" style={{ minHeight: '180px' }}>
            {previewShirt ? <img src={previewShirt} alt="Trøje" className="absolute inset-0 w-full h-full object-contain p-3" /> : <div className="absolute inset-0 flex items-center justify-center"><span className="text-gray-300 text-xs">Intet produktbillede</span></div>}
            {previewLogoUrl && logoPosition && (
              <div className="absolute pointer-events-none" style={{ left: `${previewArea.left}%`, top: `${previewArea.top}%`, width: `${previewArea.width}%`, height: `${previewArea.height}%` }}>
                <div className="absolute" style={{ left: `${logoPosition.x}%`, top: `${logoPosition.y}%`, width: `${logoPosition.scale * 40}%`, height: `${logoPosition.scale * 40}%`, transform: `translate(-50%, -50%) rotate(${logoPosition.rotation}deg)` }}>
                  <img src={previewLogoUrl} alt="Logo" className="w-full h-full object-contain drop-shadow-lg" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{hasBothSides ? (side === 'front' ? '↑ Forside' : '↓ Bagside') : decorationSide === 'back' ? '↓ Bagside' : '↑ Forside'}</div>
          </div>
        </div>
        {/* Info */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {selectedColor && <div><p className="text-gray-400 text-xs uppercase mb-0.5">Farve</p><p className="font-semibold text-gray-900">{selectedColor}</p></div>}
            {selectedSize && <div><p className="text-gray-400 text-xs uppercase mb-0.5">Størrelse</p><p className="font-semibold text-gray-900">{selectedSize}</p></div>}
            <div><p className="text-gray-400 text-xs uppercase mb-0.5">Produkt</p><p className="font-semibold text-gray-900 text-xs">{custom.product_name}</p></div>
            <div><p className="text-gray-400 text-xs uppercase mb-0.5">Dato</p><p className="font-semibold text-gray-900 text-xs">{formatDate(custom.created_at)}</p></div>
          </div>
          {(printTypeName || printTypeId) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${printBadgeClass[printTypeId || ''] || 'bg-gray-100 text-gray-700'}`}><span>{printEmoji[printTypeId || ''] || '🖨️'}</span>{printTypeName || printTypeId}</span>
              {typeof extraPrice === 'number' && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${extraPrice === 0 ? 'bg-green-100 text-green-700' : 'bg-[#f5f0ea] text-[#8a7560]'}`}>{extraPrice === 0 ? 'Inkluderet' : `+${extraPrice} kr/stk`}</span>}
            </div>
          )}
          <div className="flex gap-3 flex-wrap">
            {(frontLogoUrl || (!backLogoUrl && logoImage)) && <a href={frontLogoUrl || logoImage} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline font-medium">{hasBothSides ? '↗ Forside logo' : '↗ Logo fil'}</a>}
            {backLogoUrl && <a href={backLogoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline font-medium">↗ Bagside logo</a>}
          </div>
          <div className="pt-2 border-t border-gray-100">
            {custom.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => onApprove(custom.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-xs"><Check className="w-3.5 h-3.5" />Godkend design</button>
                <button onClick={() => onReject(custom.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-xs"><X className="w-3.5 h-3.5" />Afvis</button>
              </div>
            )}
            {custom.status === 'approved' && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Leveringsstatus</p>
                <div className="flex gap-1.5">
                  <button onClick={() => onUpdateDelivery(custom.id, 'received')} className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg border-2 transition font-semibold text-xs ${custom.deliveryStatus === 'received' ? 'border-blue-400 bg-blue-100 text-blue-800' : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'}`}><CheckCircle2 className="w-3 h-3" />Modtaget</button>
                  <button onClick={() => onUpdateDelivery(custom.id, 'shipped')} className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg border-2 transition font-semibold text-xs ${custom.deliveryStatus === 'shipped' ? 'border-green-400 bg-green-100 text-green-800' : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'}`}><Check className="w-3 h-3" />Sendt</button>
                  <button onClick={() => onUpdateDelivery(custom.id, 'failed')} className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg border-2 transition font-semibold text-xs ${custom.deliveryStatus === 'failed' ? 'border-red-400 bg-red-100 text-red-800' : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'}`}><Ban className="w-3 h-3" />Mislykket</button>
                </div>
                {custom.notes && <p className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1">Status: <span className="font-medium text-gray-700">{custom.notes}</span></p>}
              </div>
            )}
            {custom.status === 'rejected' && (
              <div className="space-y-2">
                {custom.notes && <p className="text-xs text-red-700 bg-red-50 px-2 py-1.5 rounded border border-red-100">✗ Årsag: {custom.notes}</p>}
                <button onClick={handleDelete} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-red-600 hover:bg-red-50 rounded-lg transition font-medium text-xs border border-red-100"><Trash2 className="w-3.5 h-3.5" />Slet design permanent</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── STANDALONE DESIGN TAB (for designs without matching orders) ───────────
const DesignTab = ({ customizations, products, handleApproveCustomization, handleRejectCustomization, loadCustomizations, setSuccess, setError, formatDate }: {
  customizations: Customization[]; products: Product[]
  handleApproveCustomization: (id: string) => void; handleRejectCustomization: (id: string) => void
  loadCustomizations: () => void; setSuccess: (s: string) => void; setError: (s: string) => void; formatDate: (d: string) => string
}) => {
  const [designTab, setDesignTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const handleUpdateDeliveryStatus = async (id: string, status: 'received' | 'shipped' | 'failed') => {
    const notes = status === 'shipped' ? 'Sendt til kunde' : status === 'failed' ? 'Mislykket' : 'Modtaget'
    try { await updateDoc(doc(db, 'customizations', id), { deliveryStatus: status, notes, updated_at: new Date().toISOString() }); setSuccess(`✓ Status: ${notes}`); setTimeout(() => setSuccess(""), 3000); loadCustomizations() }
    catch (err: any) { setError(err.message) }
  }
  const pending  = customizations.filter(c => c.status === 'pending')
  const approved = customizations.filter(c => c.status === 'approved')
  const rejected = customizations.filter(c => c.status === 'rejected')
  const tabDefs = [
    { id: 'pending'  as const, label: 'Afventer',  count: pending.length,  color: 'bg-yellow-100 text-yellow-800' },
    { id: 'approved' as const, label: 'Godkendte', count: approved.length, color: 'bg-green-100 text-green-800'   },
    { id: 'rejected' as const, label: 'Afviste',   count: rejected.length, color: 'bg-red-100 text-red-800'       },
  ]
  const current = designTab === 'pending' ? pending : designTab === 'approved' ? approved : rejected
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Design Godkendelser</h2>
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 w-fit">
        {tabDefs.map(t => (
          <button key={t.id} onClick={() => setDesignTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${designTab === t.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}{t.count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${t.color}`}>{t.count}</span>}
          </button>
        ))}
      </div>
      {current.length === 0 ? (
        <div className="text-center py-16"><p className="text-sm text-gray-400">Ingen {tabDefs.find(t => t.id === designTab)?.label.toLowerCase()} designs</p></div>
      ) : (
        <div className="space-y-4">
          {current.map(custom => (
            <DesignPreviewCard key={custom.id} custom={custom} products={products}
              onApprove={handleApproveCustomization} onReject={handleRejectCustomization}
              onUpdateDelivery={handleUpdateDeliveryStatus}
              setSuccess={setSuccess} setError={setError}
              loadCustomizations={loadCustomizations} formatDate={formatDate} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [uploadingImages, setUploadingImages] = useState(false)
  const [colorImageUrlInputs, setColorImageUrlInputs] = useState<{ [key: number]: string }>({})
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<StripeOrder[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customizations, setCustomizations] = useState<Customization[]>([])
  const [currentUserProfile, setCurrentUserProfile] = useState<{ name?: string; email?: string } | null>(null)
  const [maintenanceMode, setMaintenanceMode] = useState<boolean | null>(null)
  const [maintenanceLoading, setMaintenanceLoading] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({ name: "", category: "T-shirt", price: "", stock: "", image_url: "", description: "", status: "active", discount: "0", stockStatus: "in_stock" as "in_stock" | "out_of_stock", backImage: "" })
  const [productImages, setProductImages] = useState<string[]>([])
  const [colors, setColors] = useState<Color[]>([{ name: "", hex: "#000000", stock: 100, image_url: "" }])
  const [sizes, setSizes] = useState<Size[]>([{ name: "", stock: 100 }])
  const [features, setFeatures] = useState<string[]>([""])
  const [tierPrices, setTierPrices] = useState<TierPrice[]>(DEFAULT_TIER_PRICES)
  const [printTypes, setPrintTypes] = useState<PrintType[]>(DEFAULT_PRINT_TYPES)
  const [decorationAreaFront, setDecorationAreaFront] = useState<DecorationArea>({ ...DEFAULT_DECORATION_AREA })
  const [decorationAreaBack, setDecorationAreaBack] = useState<DecorationArea>({ ...DEFAULT_DECORATION_AREA })
  const categories = ["T-shirt", "Polo T-shirt", "Hoodie", "Hoodie med Lynlaas"]

  useEffect(() => { loadProducts(); loadOrders(); loadCustomers(); loadCustomizations(); loadCurrentUserProfile(); getMaintenanceMode().then(setMaintenanceMode) }, [])

  const loadCurrentUserProfile = async () => {
    if (!user) return
    try { const snap = await getDoc(doc(db, 'profiles', user.uid)); setCurrentUserProfile(snap.exists() ? { name: snap.data().name, email: user.email || '' } : { email: user.email || '' }) }
    catch { setCurrentUserProfile({ email: user.email || '' }) }
  }
  const loadProducts = async () => {
    try { const snap = await getDocs(query(collection(db, 'products'), orderBy('created_at', 'desc'))); setProducts(snap.docs.map(d => ({ id: d.id, ...d.data(), updated_at: d.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString() })) as Product[]) }
    catch (err) { console.error(err) }
  }
  const loadOrders = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'stripe_orders'), orderBy('created_at', 'desc')))
      const firestoreOrders = snap.docs.map(d => ({ id: d.id, ...d.data() })) as StripeOrder[]
      let stripeOrders: StripeOrder[] = []
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      if (!isLocal) {
        try { const res = await fetch('/.netlify/functions/get-orders'); const ct = res.headers.get('content-type') || ''; if (res.ok && ct.includes('application/json')) stripeOrders = (await res.json()).orders || [] }
        catch (err) { console.error('Stripe fetch fejl:', err) }
      }
      const ids = new Set(firestoreOrders.map(o => o.sessionId))
      const newFromStripe: StripeOrder[] = stripeOrders.filter(so => !ids.has(so.sessionId)).map(so => ({ ...so, id: so.sessionId, status: 'pending' as const, notes: '' }))
      setOrders([...firestoreOrders, ...newFromStripe].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
    } catch (err) { console.error('Orders fejl:', err) }
  }
  const loadCustomers = async () => {
    try { const snap = await getDocs(collection(db, 'profiles')); setCustomers(snap.docs.map(d => { const data = d.data(); return { id: d.id, email: data.email || d.id, name: data.name || '', phone: data.phone || '', role: data.role || 'customer', created_at: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString() } }) as Customer[]) }
    catch (err) { console.error(err) }
  }
  const loadCustomizations = async () => {
    try { const snap = await getDocs(query(collection(db, 'customizations'), orderBy('created_at', 'desc'))); setCustomizations(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Customization[]) }
    catch (err) { console.error(err) }
  }

  // Get customizations that belong to a specific order (by sessionId or by email+approximate time)
  const getOrderCustomizations = (order: StripeOrder): Customization[] => {
    // Primary: match by sessionId
    const bySession = customizations.filter(c => c.sessionId === order.sessionId)
    if (bySession.length > 0) return bySession
    // Fallback: match by email within ±2 hours of order
    const orderTime = new Date(order.created_at).getTime()
    return customizations.filter(c => {
      if (c.user_email !== order.customerEmail) return false
      const customTime = new Date(c.created_at).getTime()
      return Math.abs(customTime - orderTime) < 2 * 60 * 60 * 1000 // 2 hours
    })
  }

  const handleMaintenanceToggle = async () => {
    if (maintenanceMode === null) return; setMaintenanceLoading(true)
    try { const newVal = !maintenanceMode; await saveMaintenance(newVal); setMaintenanceMode(newVal); setSuccess(newVal ? "🔒 Vedligeholdelsestilstand aktiveret" : "✅ Shoppen er nu online!"); setTimeout(() => setSuccess(""), 4000) }
    catch (err: any) { setError(err.message || "Kunne ikke ændre vedligeholdelsestilstand") }
    finally { setMaintenanceLoading(false) }
  }
  const ensureOrderInFirestore = async (order: StripeOrder) => {
    const ref = doc(db, 'stripe_orders', order.id); const snap = await getDoc(ref)
    if (!snap.exists()) await setDoc(ref, { sessionId: order.sessionId, paymentIntentId: order.paymentIntentId || '', customerEmail: order.customerEmail || '', customerName: order.customerName || '', amountTotal: order.amountTotal || 0, status: 'pending', stripeStatus: order.stripeStatus || '', lineItems: order.lineItems || [], shippingAddress: order.shippingAddress || null, created_at: order.created_at || new Date().toISOString(), notes: '' })
  }
  const handleAcceptOrder = async (order: StripeOrder) => {
    setActionLoading(order.id)
    try {
      await ensureOrderInFirestore(order)
      await updateDoc(doc(db, 'stripe_orders', order.id), { status: 'accepted', updated_at: new Date().toISOString(), notes: 'Ordre godkendt af admin' })
      try {
        const res = await fetch('/.netlify/functions/resend-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: order.sessionId }) })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Kunne ikke sende ordrebekræftelse')
      } catch (emailErr) { console.error('Email send fejl:', emailErr) }
      setSuccess(`✓ Ordre godkendt og bekræftelse sendt til ${order.customerEmail}!`); setTimeout(() => setSuccess(""), 4000); loadOrders()
    } catch (err: any) { setError(err.message || "Kunne ikke godkende ordre") } finally { setActionLoading(null) }
  }
  const handleRejectOrder = async (order: StripeOrder) => {
    const reason = prompt("Årsag til afvisning:"); if (!reason) return; setActionLoading(order.id)
    try { await ensureOrderInFirestore(order); await updateDoc(doc(db, 'stripe_orders', order.id), { status: 'rejected', updated_at: new Date().toISOString(), notes: reason }); setSuccess("✗ Ordre afvist"); setTimeout(() => setSuccess(""), 4000); loadOrders() }
    catch (err: any) { setError(err.message || "Kunne ikke afvise ordre") } finally { setActionLoading(null) }
  }
  const handleRefundOrder = async (order: StripeOrder) => {
    if (!order.paymentIntentId) { setError("Ingen payment intent ID"); return }
    if (!confirm(`Refunder ${(order.amountTotal / 100).toFixed(0)} kr til ${order.customerEmail}?`)) return
    setActionLoading(order.id)
    try {
      const res = await fetch('/.netlify/functions/stripe-order-action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'refund', paymentIntentId: order.paymentIntentId }) })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      await ensureOrderInFirestore(order); await updateDoc(doc(db, 'stripe_orders', order.id), { status: 'refunded', updated_at: new Date().toISOString(), notes: `Refunderet via Stripe. Refund ID: ${data.refundId}` })
      setSuccess(`💸 Refund sendt!`); setTimeout(() => setSuccess(""), 4000); loadOrders()
    } catch (err: any) { setError(err.message || "Refund fejlede") } finally { setActionLoading(null) }
  }
  const handleSendOrderStatusEmail = async (order: StripeOrder, emailType: string, label: string) => {
    setActionLoading(order.id)
    try {
      const endpoint = emailType === 'order-confirmation' ? '/.netlify/functions/resend-email' : '/.netlify/functions/order-status-email'
      const body = emailType === 'order-confirmation' ? JSON.stringify({ sessionId: order.sessionId }) : JSON.stringify({ sessionId: order.sessionId, emailType })
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
      const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Kunne ikke sende mail')
      setSuccess(`${label} sendt til ${order.customerEmail}`); setTimeout(() => setSuccess(""), 4000)
    } catch (err: any) { setError(err.message || 'Kunne ikke sende mail') } finally { setActionLoading(null) }
  }
    const handleSendFaktura = async (order: StripeOrder) => {
      setActionLoading(order.id)
      try {
        const orderData = {
          sessionId: order.sessionId,
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          amountTotal: order.amountTotal,
          lineItems: (order.lineItems || []).map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: order.shippingAddress || null,
          emailType: 'faktura',
        }
        const res = await fetch('/.netlify/functions/resend-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Kunne ikke sende faktura')
        setSuccess(` Faktura sendt til ${order.customerEmail}`)
        setTimeout(() => setSuccess(""), 4000)
      } catch (err: any) {
        setError(err.message || 'Kunne ikke sende faktura')
      } finally {
        setActionLoading(null)
      }
    }
  const handleApproveCustomization = async (id: string) => {
    try { await updateDoc(doc(db, 'customizations', id), { status: 'approved', updated_at: new Date().toISOString() }); setSuccess("✓ Design godkendt!"); setTimeout(() => setSuccess(""), 3000); loadCustomizations() }
    catch (err: any) { setError(err.message) }
  }
  const handleRejectCustomization = async (id: string) => {
    const reason = prompt("Årsag til afvisning:"); if (!reason) return
    try { await updateDoc(doc(db, 'customizations', id), { status: 'rejected', notes: reason, updated_at: new Date().toISOString() }); setSuccess("✗ Design afvist!"); setTimeout(() => setSuccess(""), 3000); loadCustomizations() }
    catch (err: any) { setError(err.message) }
  }
  const handleUpdateDeliveryStatus = async (id: string, status: 'received' | 'shipped' | 'failed') => {
    const notes = status === 'shipped' ? 'Sendt til kunde' : status === 'failed' ? 'Mislykket' : 'Modtaget'
    try { await updateDoc(doc(db, 'customizations', id), { deliveryStatus: status, notes, updated_at: new Date().toISOString() }); setSuccess(`✓ Status: ${notes}`); setTimeout(() => setSuccess(""), 3000); loadCustomizations() }
    catch (err: any) { setError(err.message) }
  }
  const handleImageFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files; if (!files || files.length === 0) return; setUploadingImages(true)
    try { const urls = await Promise.all(Array.from(files).map(f => uploadToCloudinary(f, 'tradydk/products'))); setProductImages(prev => [...prev, ...urls]); if (productImages.length === 0 && urls.length > 0) setProductForm(prev => ({ ...prev, image_url: urls[0] })); setSuccess(`${urls.length} billede(r) uploadet!`); setTimeout(() => setSuccess(""), 3000) }
    catch (err: any) { setError("Fejl ved upload: " + err.message) } finally { setUploadingImages(false) }
  }
  const handleAddImageFromUrl = async () => {
    const url = productForm.image_url.trim(); if (!url || !url.startsWith('http')) { setError("Ugyldig URL"); return }; setUploadingImages(true)
    try { const blob = await (await fetch(url)).blob(); const uploadedUrl = await uploadToCloudinary(new File([blob], 'product-image.png', { type: blob.type }), 'tradydk/products'); setProductImages(prev => [...prev, uploadedUrl]); if (productImages.length === 0) setProductForm(prev => ({ ...prev, image_url: uploadedUrl })); setSuccess('Billede uploadet!'); setTimeout(() => setSuccess(""), 3000) }
    catch (err: any) { setError(err.message) } finally { setUploadingImages(false) }
  }
  const removeProductImage = (index: number) => { const n = productImages.filter((_, i) => i !== index); setProductImages(n); if (index === 0 && n.length > 0) setProductForm(prev => ({ ...prev, image_url: n[0] })); else if (n.length === 0) setProductForm(prev => ({ ...prev, image_url: "" })) }
  const handleColorImageUpload = async (index: number, file: File) => {
    setUploadingImages(true)
    try { const url = await uploadToCloudinary(file, 'tradydk/colors'); handleColorChange(index, 'image_url', url); setSuccess('Farvebillede uploadet!'); setTimeout(() => setSuccess(""), 3000) }
    catch (err: any) { setError(err.message) } finally { setUploadingImages(false) }
  }
  const handleAddColorImageFromUrl = async (index: number) => {
    const url = colorImageUrlInputs[index]?.trim(); if (!url || !url.startsWith('http')) { setError("Ugyldig URL"); return }; setUploadingImages(true)
    try { const blob = await (await fetch(url)).blob(); const uploadedUrl = await uploadToCloudinary(new File([blob], 'color-image.png', { type: blob.type }), 'tradydk/colors'); handleColorChange(index, 'image_url', uploadedUrl); setColorImageUrlInputs(prev => ({ ...prev, [index]: '' })); setSuccess('Farvebillede uploadet!'); setTimeout(() => setSuccess(""), 3000) }
    catch (err: any) { setError(err.message) } finally { setUploadingImages(false) }
  }
  const handleColorChange = (index: number, field: keyof Color, value: string | number) => { setColors(prev => { const n = [...prev]; n[index] = { ...n[index], [field]: value }; return n }) }
  const handleSizeChange = (index: number, field: keyof Size, value: string | number) => { setSizes(prev => { const n = [...prev]; n[index] = { ...n[index], [field]: value }; return n }) }
  const handleTierPriceChange = (index: number, value: number) => { setTierPrices(prev => { const n = [...prev]; n[index] = { ...n[index], price: value }; return n }) }
  const handlePrintTypeToggle = (index: number) => { setPrintTypes(prev => prev.map((p, i) => i === index ? { ...p, enabled: !p.enabled } : p)) }
  const handlePrintTypePrice = (index: number, value: number) => { setPrintTypes(prev => prev.map((p, i) => i === index ? { ...p, extraPrice: value } : p)) }
  const handleSaveProduct = async () => {
    setLoading(true); if (!productForm.name || !productForm.price) { setError("Udfyld alle påkrævede felter"); setLoading(false); return }
    try {
      const productData = { name: productForm.name, category: productForm.category, price: parseFloat(productForm.price), stock: productForm.stockStatus === 'out_of_stock' ? 0 : 100, image_url: productForm.image_url, images: productImages.length > 0 ? productImages : [productForm.image_url || 'https://placehold.co/400x400'], description: productForm.description || "", features: features.filter(f => f.trim()), status: productForm.status, discount: parseFloat(productForm.discount) || 0, colors: colors.filter(c => c.name.trim()), sizes: sizes.filter(s => s.name.trim()), tierPrices: tierPrices.filter(tp => tp.price > 0), printTypes, decorationAreaFront, decorationAreaBack, backImage: productForm.backImage || "", updated_at: Timestamp.now(), created_at: Timestamp.now() }
      if (editingProduct) await updateDoc(doc(db, 'products', editingProduct.id), productData); else await addDoc(collection(db, 'products'), productData)
      setSuccess(editingProduct ? "Produkt opdateret!" : "Produkt oprettet!"); setTimeout(() => setSuccess(""), 3000); resetForm(false); loadProducts()
    } catch (err: any) { setError(err.message) } finally { setLoading(false) }
  }
  const resetForm = (closeForm = true) => {
    setProductForm({ name: "", category: "T-shirt", price: "", stock: "", image_url: "", description: "", status: "active", discount: "0", stockStatus: "in_stock", backImage: "" })
    setProductImages([]); setColorImageUrlInputs({}); setColors([{ name: "", hex: "#000000", stock: 100, image_url: "" }]); setSizes([{ name: "", stock: 100 }]); setFeatures([""]); setTierPrices(DEFAULT_TIER_PRICES); setPrintTypes(DEFAULT_PRINT_TYPES); setDecorationAreaFront({ ...DEFAULT_DECORATION_AREA }); setDecorationAreaBack({ ...DEFAULT_DECORATION_AREA }); setEditingProduct(null)
    if (closeForm) setShowProductForm(false)
  }
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product); setProductForm({ name: product.name, category: product.category, price: product.price.toString(), stock: product.stock.toString(), image_url: product.image_url, description: product.description || "", status: product.status, discount: (product.discount || 0).toString(), stockStatus: product.stock === 0 ? 'out_of_stock' : 'in_stock', backImage: product.backImage || "" })
    setProductImages(product.images || [product.image_url]); setColors(product.colors?.length ? product.colors : [{ name: "", hex: "#000000", stock: 100, image_url: "" }]); setSizes(product.sizes?.length ? product.sizes : [{ name: "", stock: 100 }]); setFeatures(product.features?.length ? [...product.features, ""] : [""]); setTierPrices(product.tierPrices?.length ? product.tierPrices : DEFAULT_TIER_PRICES); setPrintTypes(product.printTypes?.length ? product.printTypes : DEFAULT_PRINT_TYPES); setDecorationAreaFront(product.decorationAreaFront ? { ...product.decorationAreaFront } : { ...DEFAULT_DECORATION_AREA }); setDecorationAreaBack(product.decorationAreaBack ? { ...product.decorationAreaBack } : { ...DEFAULT_DECORATION_AREA }); setShowProductForm(true)
  }
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Er du sikker?")) return
    try { await deleteDoc(doc(db, 'products', id)); setSuccess("Produkt slettet!"); setTimeout(() => setSuccess(""), 3000); loadProducts() }
    catch (err: any) { setError(err.message) }
  }
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const pendingDesigns = customizations.filter(c => c.status === 'pending').length
  const formatDate = (d: string) => new Date(d).toLocaleDateString('da-DK')
  const orderStatusConfig = {
    pending:  { label: 'Afventer',   color: 'bg-amber-100 text-amber-800',    icon: '⏳' },
    accepted: { label: 'Godkendt',   color: 'bg-emerald-100 text-emerald-800', icon: '✓'  },
    rejected: { label: 'Afvist',     color: 'bg-red-100 text-red-800',         icon: '✗'  },
    refunded: { label: 'Refunderet', color: 'bg-violet-100 text-violet-800',   icon: '💸' },
  }
  const tabs = [
    {                       label: "Trady",      icon: Home,            badge: 0 },
    { id: "dashboard",      label: "Dashboard",  icon: LayoutDashboard, badge: 0 },
    { id: "products",       label: "Produkter",  icon: Package,         badge: 0 },
    { id: "orders",         label: "Ordrer",     icon: ShoppingCart,    badge: pendingOrders },
    { id: "customizations", label: "Designs",    icon: AlertCircle,     badge: pendingDesigns },
    { id: "customers",      label: "Brugere",    icon: Users,           badge: 0 },
  ]
  const stats = [
    { label: "Total Omsætning", value: `${orders.filter(o => o.status !== 'refunded').reduce((s, o) => s + o.amountTotal, 0) / 100 | 0} kr`, icon: DollarSign, color: "bg-emerald-500" },
    { label: "Ordrer i alt",    value: orders.length.toString(),    icon: ShoppingCart, color: "bg-blue-500"   },
    { label: "Produkter",       value: products.length.toString(),  icon: Package,      color: "bg-violet-500" },
    { label: "Brugere",         value: customers.length.toString(), icon: Users,        color: "bg-orange-500" },
  ]
  const frontPreviewImage = productImages[0] || productForm.image_url || ''
  const backPreviewImage  = productForm.backImage || ''
  const orderNumber = (order: StripeOrder) => formatOrderNumber(order.sessionId || order.id, order.created_at)

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm">{currentUserProfile?.name || currentUserProfile?.email}</span>
              <button onClick={() => logout()} className="text-red-600 hover:text-red-700 font-medium text-sm">Log ud</button>
            </div>
          </div>
        </div>
      </header>

      {error && <div className="max-w-7xl mx-auto px-4 mt-4"><div className="p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center"><p className="text-red-600">{error}</p><button onClick={() => setError("")}><X className="w-5 h-5 text-red-600" /></button></div></div>}
      {success && <div className="max-w-7xl mx-auto px-4 mt-4"><div className="p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center"><p className="text-green-600">{success}</p><button onClick={() => setSuccess("")}><X className="w-5 h-5 text-green-600" /></button></div></div>}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <ul className="space-y-1">
                {tabs.map(tab => { const Icon = tab.icon; return (
                  <li key={tab.id ?? "home"}>
                    <button onClick={() => { if (tab.id) { setActiveTab(tab.id); setError(""); setSuccess("") } else navigate("/") }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === tab.id ? "bg-[#f5f0ea] text-[#b5a087] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
                      <Icon className="w-5 h-5 shrink-0" /><span className="font-medium">{tab.label}</span>
                      {tab.badge > 0 && <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">{tab.badge}</span>}
                    </button>
                  </li>
                )})}
              </ul>
            </nav>
          </aside>

          <section className="lg:col-span-4">

            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Vedligeholdelsestilstand</h2>
                      <p className="text-sm text-gray-500 mt-1">{maintenanceMode === null ? "Henter status..." : maintenanceMode ? "🔒 Shoppen er skjult" : "✅ Shoppen er online og synlig for alle"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${maintenanceMode ? "text-red-600" : "text-green-600"}`}>{maintenanceMode ? "Offline" : "Online"}</span>
                      <button onClick={handleMaintenanceToggle} disabled={maintenanceLoading || maintenanceMode === null} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-40 ${maintenanceMode ? "bg-red-500" : "bg-green-500"}`}>
                        {maintenanceLoading ? <span className="absolute inset-0 flex items-center justify-center"><RefreshCw className="w-4 h-4 text-white animate-spin" /></span> : <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-300 ${maintenanceMode ? "translate-x-7" : "translate-x-1"}`} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, i) => { const Icon = stat.icon; return (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                      <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}><Icon className="w-5 h-5 text-white" /></div>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                  )})}
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Seneste ordrer</h2>
                  {orders.length === 0 ? <p className="text-gray-500 text-center py-8">Ingen ordrer endnu</p> : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map(order => { const cfg = orderStatusConfig[order.status] || orderStatusConfig.pending; return (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div>
                            <p className="font-medium text-gray-900">{order.customerEmail}</p>
                            <p className="text-xs font-mono text-gray-400">{orderNumber(order)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-900">{(order.amountTotal / 100).toFixed(0)} kr</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                          </div>
                        </div>
                      )})}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Ordrehåndtering</h2>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">{pendingOrders} afventer</span>
                </div>
                {orders.length === 0 ? <p className="text-gray-500 text-center py-16">Ingen ordrer endnu</p> : (
                  <div className="space-y-4">
                    {orders.map(order => {
                      const cfg = orderStatusConfig[order.status] || orderStatusConfig.pending
                      const isExpanded = expandedOrder === order.id
                      const isLoading = actionLoading === order.id
                      const orderCustomizations = getOrderCustomizations(order)

                      return (
                        <div key={order.id} className="border rounded-xl overflow-hidden">
                          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50">
                            <div>
                              <p className="font-bold text-gray-900">{order.customerName || order.customerEmail}</p>
                              <p className="text-sm text-gray-500">{order.customerEmail}</p>
                              <p className="text-xs font-mono text-gray-400 mt-0.5">{orderNumber(order)}</p>
                              {orderCustomizations.length > 0 && (
                                <span className="inline-flex items-center gap-1 mt-1 text-xs bg-[#f5f0ea] text-[#8a7560] px-2 py-0.5 rounded-full font-medium">
                                  🎨 {orderCustomizations.length} design{orderCustomizations.length > 1 ? 's' : ''}
                                  {orderCustomizations.some(c => c.status === 'pending') && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">{(order.amountTotal / 100).toFixed(0)} kr</p>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                              </div>
                              <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)} className="p-2 hover:bg-gray-200 rounded-lg transition">
                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-5 border-t space-y-5">
                              {/* Order badge */}
                              <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#b5a087] to-[#b5a087] border text-white">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">Ordre nummer</p>
                                  <p className="text-xl font-mono font-bold text-white tracking-wide">{orderNumber(order)}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <p className="text-[10px] text-white uppercase tracking-widest">Oprettet</p>
                                  <p className="text-sm font-semibold text-slate-200">{formatDate(order.created_at)}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <p className="text-[10px] text-white uppercase tracking-widest">Beløb</p>
                                  <p className="text-lg font-bold text-white">{(order.amountTotal / 100).toFixed(0)} kr</p>
                                </div>
                              </div>

                              {/* Products */}
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Produkter</h4>
                                <div className="space-y-2">
                                  {order.lineItems?.map((item, idx) => {
                                    const matched = products.find(p => item.name && p.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]))
                                    const img = item.image || matched?.image_url || ''
                                    return (
                                      <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                                        {img ? <img src={img} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0" /> : <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center shrink-0"><Package className="w-6 h-6 text-gray-400" /></div>}
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                          {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                                          <p className="text-xs text-gray-400 mt-0.5">{item.quantity} stk</p>
                                        </div>
                                        <span className="font-semibold text-gray-900 text-sm shrink-0">{((item.price || 0) / 100).toFixed(0)} kr</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>

                              {/* ── DESIGNS TILKNYTTET ORDREN ── */}
                              {orderCustomizations.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                                    🎨 Designs ({orderCustomizations.length})
                                  </h4>
                                  <div className="space-y-3">
                                    {orderCustomizations.map(custom => (
                                      <DesignPreviewCard
                                        key={custom.id}
                                        custom={custom}
                                        products={products}
                                        onApprove={handleApproveCustomization}
                                        onReject={handleRejectCustomization}
                                        onUpdateDelivery={handleUpdateDeliveryStatus}
                                        setSuccess={setSuccess}
                                        setError={setError}
                                        loadCustomizations={loadCustomizations}
                                        formatDate={formatDate}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {order.shippingAddress && (
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Leveringsadresse</h4>
                                  <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                                    <p>{order.shippingAddress.line1}</p>
                                    <p>{order.shippingAddress.postal_code} {order.shippingAddress.city}</p>
                                    <p>{order.shippingAddress.country}</p>
                                  </div>
                                </div>
                              )}

                              {order.notes && (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                                  <span className="font-semibold">Note: </span>{order.notes}
                                </div>
                              )}

                              {/* Status mails */}
                              <div className="space-y-3 pt-2 border-t">
                                <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Send status-mail</h4>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  <button onClick={() => handleSendOrderStatusEmail(order, 'order-confirmation', 'Ordrebekræftelse')} disabled={isLoading} className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition disabled:opacity-50 text-sm">{isLoading ? 'Sender...' : 'Send ordrebekræftelse'}</button>
                                  <button onClick={() => handleSendOrderStatusEmail(order, 'production-complete', 'Produktion færdig')} disabled={isLoading} className="px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition disabled:opacity-50 text-sm">{isLoading ? 'Sender...' : 'Færdigproduceret og mod Danmark'}</button>
                                  <button onClick={() => handleSendOrderStatusEmail(order, 'denmark-checked', 'Tjekket i Danmark')} disabled={isLoading} className="px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition disabled:opacity-50 text-sm">{isLoading ? 'Sender...' : 'Tjekket i Danmark og mod kunde'}</button>
                                  <button onClick={() => handleSendOrderStatusEmail(order, 'on-the-way', 'På vej til kunde')} disabled={isLoading} className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition disabled:opacity-50 text-sm">{isLoading ? 'Sender...' : 'På vej til kunden'}</button>
                                  <button onClick={() => handleSendFaktura(order)} disabled={isLoading} className="px-4 py-3 bg-[#b5a087] hover:bg-[#9e8a72] text-white rounded-lg font-medium transition disabled:opacity-50 text-sm flex items-center justify-center gap-2 sm:col-span-2">
                                    <FileText className="w-4 h-4" />{isLoading ? 'Sender...' : 'Send faktura til kunde'}
                                  </button>
                                </div>
                              </div>

                              {order.status === 'pending' && (
                                <div className="flex flex-wrap gap-3 pt-2 border-t">
                                  <button onClick={() => handleAcceptOrder(order)} disabled={isLoading} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition disabled:opacity-50"><CheckCircle2 className="w-4 h-4" />{isLoading ? 'Behandler...' : 'Godkend ordre'}</button>
                                  <button onClick={() => handleRejectOrder(order)} disabled={isLoading} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50"><Ban className="w-4 h-4" />Afvis ordre</button>
                                  <button onClick={() => handleRefundOrder(order)} disabled={isLoading} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition disabled:opacity-50"><RefreshCw className="w-4 h-4" />Refunder</button>
                                </div>
                              )}
                              {order.status === 'accepted' && (
                                <div className="flex gap-3 pt-2 border-t">
                                  <button onClick={() => handleRefundOrder(order)} disabled={isLoading} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition disabled:opacity-50"><RefreshCw className="w-4 h-4" />{isLoading ? 'Behandler...' : 'Refunder ordre'}</button>
                                </div>
                              )}
                              {(order.status === 'refunded' || order.status === 'rejected') && (
                                <div className={`p-3 rounded-lg text-sm ${order.status === 'refunded' ? 'bg-violet-50 text-violet-800' : 'bg-red-50 text-red-800'}`}>
                                  {order.status === 'refunded' ? '💸 Denne ordre er refunderet via Stripe' : `✗ Afvist: ${order.notes}`}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "customizations" && (
              <DesignTab customizations={customizations} products={products} handleApproveCustomization={handleApproveCustomization} handleRejectCustomization={handleRejectCustomization} loadCustomizations={loadCustomizations} setSuccess={setSuccess} setError={setError} formatDate={formatDate} />
            )}

            {activeTab === "products" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Produktstyring</h2>
                  <button onClick={() => { setShowProductForm(true); resetForm(false) }} className="flex items-center gap-2 px-4 py-2 bg-[#b5a087] text-white rounded-lg hover:bg-[#9e8a72] transition"><Plus className="w-5 h-5" />Tilføj Produkt</button>
                </div>
                {showProductForm && (
                  <div className="mb-6 p-6 border-2 border-[#e8ddd2] rounded-xl bg-[#f5f0ea]/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{editingProduct ? "Rediger Produkt" : "Nyt Produkt"}</h3>
                      <button onClick={() => resetForm(true)}><X className="w-6 h-6 text-gray-500" /></button>
                    </div>
                    <div className="space-y-6">
                      <div className="border-t pt-6">
                        <h4 className="text-lg font-bold mb-4">Produktbilleder</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#b5a087] transition bg-white">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" /><span className="text-sm text-gray-600">Upload billeder</span>
                            <input type="file" multiple accept="image/*" onChange={handleImageFileChange} className="hidden" disabled={uploadingImages} />
                          </label>
                          <div className="flex flex-col gap-2">
                            <input type="url" value={productForm.image_url} onChange={e => setProductForm(prev => ({ ...prev, image_url: e.target.value.trim() }))} placeholder="https://example.com/image.jpg" className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5a087] focus:border-transparent" />
                            <button type="button" onClick={handleAddImageFromUrl} disabled={!productForm.image_url.trim() || uploadingImages} className="px-4 py-2 bg-[#b5a087] text-white rounded-lg hover:bg-[#9e8a72] transition text-sm disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"><LinkIcon className="w-4 h-4" />{uploadingImages ? 'Uploader...' : 'Tilføj via URL'}</button>
                          </div>
                        </div>
                        {productImages.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {productImages.map((img, idx) => (
                              <div key={idx} className="relative group aspect-square">
                                <img src={img} alt="" className="w-full h-full object-cover rounded-lg border-2 border-gray-200" />
                                <button type="button" onClick={() => removeProductImage(idx)} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"><X className="w-3 h-3" /></button>
                                {idx === 0 && <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[#b5a087] text-white text-xs rounded">Hoved</div>}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Bagside billede URL</label>
                          <input type="url" value={productForm.backImage} onChange={e => setProductForm(prev => ({ ...prev, backImage: e.target.value.trim() }))} placeholder="https://example.com/back.jpg" className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5a087] focus:border-transparent" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[['Produkt Navn *', 'text', 'name'], ['Pris (kr) *', 'number', 'price'], ['Rabat (%)', 'number', 'discount']].map(([label, type, key]) => (
                          <div key={key}><label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label><input type={type} value={(productForm as any)[key]} onChange={e => setProductForm(prev => ({ ...prev, [key]: e.target.value }))} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5a087] focus:border-transparent" /></div>
                        ))}
                        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label><select value={productForm.category} onChange={e => setProductForm(prev => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5a087]">{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Lagerstatus</label><select value={productForm.stockStatus} onChange={e => setProductForm(prev => ({ ...prev, stockStatus: e.target.value as "in_stock" | "out_of_stock" }))} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5a087]"><option value="in_stock">På lager</option><option value="out_of_stock">Udsolgt</option></select></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Status</label><select value={productForm.status} onChange={e => setProductForm(prev => ({ ...prev, status: e.target.value }))} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5a087]"><option value="active">Aktiv</option><option value="inactive">Inaktiv</option></select></div>
                      </div>
                      <div><label className="block text-sm font-semibold text-gray-700 mb-2">Beskrivelse</label><textarea value={productForm.description} onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))} rows={4} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5a087]" /></div>
                      <div className="border-t pt-6 space-y-4">
                        <div>
                          <h4 className="text-lg font-bold mb-1">Dekorterings-område</h4>
                          <p className="text-sm text-gray-500 mb-4">Juster den stiplede linje der vises i produktkustomizeren</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DecorationAreaEditor label="Forside" area={decorationAreaFront} previewImage={frontPreviewImage} onChange={setDecorationAreaFront} />
                            <DecorationAreaEditor label="Bagside" area={decorationAreaBack} previewImage={backPreviewImage} onChange={setDecorationAreaBack} />
                          </div>
                        </div>
                      </div>
                      <div className="border-t pt-6">
                        <h4 className="text-lg font-bold mb-3">Mængderabatter</h4>
                        <div className="space-y-2">
                          {tierPrices.map((tier, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-600 w-28 shrink-0">{tier.minQuantity}–{tier.maxQuantity === null ? '+' : tier.maxQuantity} stk:</span>
                              <input type="number" step="0.01" min="0" value={tier.price} onChange={e => handleTierPriceChange(i, parseFloat(e.target.value) || 0)} className="flex-1 px-3 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5a087] text-sm" placeholder="Pris per stk" />
                              <span className="text-sm text-gray-500">kr/stk</span>
                              {tier.price > 0 && <span className="text-green-600 text-xs font-medium">✓</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t pt-6">
                        <div className="mb-4"><h4 className="text-lg font-bold">Print-typer</h4><p className="text-sm text-gray-500 mt-0.5">Vælg hvilke print-metoder der er tilgængelige</p></div>
                        <div className="space-y-3">
                          {printTypes.map((pt, i) => (
                            <div key={pt.id} className={`rounded-xl border-2 transition-all duration-200 ${pt.enabled ? 'border-[#b5a087] bg-[#f5f0ea]/40' : 'border-gray-200 bg-gray-50'}`}>
                              <div className="p-4 flex items-center gap-4">
                                <button type="button" onClick={() => handlePrintTypeToggle(i)} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${pt.enabled ? 'bg-[#b5a087]' : 'bg-gray-300'}`}>
                                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${pt.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p className={`font-semibold text-sm ${pt.enabled ? 'text-gray-900' : 'text-gray-400'}`}>{pt.name}</p>
                                  <p className={`text-xs mt-0.5 ${pt.enabled ? 'text-gray-500' : 'text-gray-400'}`}>{pt.description}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`text-xs font-medium ${pt.enabled ? 'text-gray-600' : 'text-gray-400'}`}>Merpris:</span>
                                  <div className="relative">
                                    <input type="number" min="0" step="1" value={pt.extraPrice} disabled={!pt.enabled} onChange={e => handlePrintTypePrice(i, parseFloat(e.target.value) || 0)} className={`w-24 px-3 py-1.5 pr-8 border-2 rounded-lg text-sm text-right transition focus:outline-none focus:ring-2 focus:ring-[#b5a087] focus:border-transparent ${pt.enabled ? 'border-gray-200 bg-white text-gray-900' : 'border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed'}`} />
                                    <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none ${pt.enabled ? 'text-gray-400' : 'text-gray-300'}`}>kr</span>
                                  </div>
                                  {pt.enabled && <span className={`text-xs font-semibold w-16 text-right ${pt.extraPrice === 0 ? 'text-green-600' : 'text-[#b5a087]'}`}>{pt.extraPrice === 0 ? 'Inkluderet' : `+${pt.extraPrice} kr`}</span>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t pt-6">
                        <div className="flex justify-between mb-3"><h4 className="text-lg font-bold">Farver</h4><button type="button" onClick={() => setColors(prev => [...prev, { name: "", hex: "#000000", stock: 100, image_url: "" }])} className="text-sm text-[#b5a087] font-medium">+ Tilføj</button></div>
                        <div className="space-y-3">
                          {colors.map((color, i) => (
                            <div key={i} className="p-4 border rounded-lg space-y-3 bg-gray-50">
                              <div className="flex gap-3">
                                <input type="text" placeholder="Farvenavn" value={color.name} onChange={e => handleColorChange(i, 'name', e.target.value)} className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5a087] text-sm" />
                                <input type="color" value={color.hex} onChange={e => handleColorChange(i, 'hex', e.target.value)} className="w-12 h-10 border-2 border-gray-200 rounded-lg cursor-pointer" />
                                {colors.length > 1 && <button type="button" onClick={() => setColors(prev => prev.filter((_, ci) => ci !== i))} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>}
                              </div>
                              <div className="flex gap-2">
                                <label className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#b5a087] bg-white text-sm"><Upload className="w-4 h-4 text-gray-400" />Upload<input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleColorImageUpload(i, f) }} className="hidden" disabled={uploadingImages} /></label>
                                <input type="url" placeholder="Eller URL" value={colorImageUrlInputs[i] || ''} onChange={e => setColorImageUrlInputs(prev => ({ ...prev, [i]: e.target.value }))} className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#b5a087]" />
                                <button type="button" onClick={() => handleAddColorImageFromUrl(i)} disabled={!colorImageUrlInputs[i]?.trim() || uploadingImages} className="px-3 py-2 bg-[#b5a087] text-white rounded-lg disabled:bg-gray-300"><LinkIcon className="w-4 h-4" /></button>
                              </div>
                              {color.image_url && <div className="relative inline-block"><img src={color.image_url} alt={color.name} className="h-20 w-20 object-cover rounded border-2 border-gray-200" /><button type="button" onClick={() => handleColorChange(i, 'image_url', '')} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"><X className="w-3 h-3" /></button></div>}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t pt-6">
                        <div className="flex justify-between mb-3"><h4 className="text-lg font-bold">Størrelser</h4><button type="button" onClick={() => setSizes(prev => [...prev, { name: "", stock: 100 }])} className="text-sm text-[#b5a087] font-medium">+ Tilføj</button></div>
                        <div className="space-y-2">
                          {sizes.map((size, i) => (
                            <div key={i} className="flex gap-3">
                              <input type="text" placeholder="Størrelse (S, M, L...)" value={size.name} onChange={e => handleSizeChange(i, 'name', e.target.value)} className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5a087] text-sm" />
                              {sizes.length > 1 && <button type="button" onClick={() => setSizes(prev => prev.filter((_, si) => si !== i))} className="text-red-500"><Trash2 className="w-4 h-4" /></button>}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t pt-6">
                        <div className="flex justify-between mb-3"><h4 className="text-lg font-bold">Produktinformation</h4><button type="button" onClick={() => setFeatures(prev => [...prev, ""])} className="text-sm text-[#b5a087] font-medium">+ Tilføj</button></div>
                        <div className="space-y-2">
                          {features.map((feature, i) => (
                            <div key={i} className="flex gap-3">
                              <input type="text" placeholder="fx. Premium kvalitet" value={feature} onChange={e => setFeatures(prev => prev.map((f, fi) => fi === i ? e.target.value : f))} className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5a087] text-sm" />
                              {features.length > 1 && <button type="button" onClick={() => setFeatures(prev => prev.filter((_, fi) => fi !== i))} className="text-red-500"><Trash2 className="w-4 h-4" /></button>}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4 border-t">
                        <button onClick={handleSaveProduct} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"><Save className="w-5 h-5" />{loading ? 'Gemmer...' : 'Gem Produkt'}</button>
                        <button onClick={() => resetForm(true)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">Annuller</button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="search" placeholder="Søg produkter..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#b5a087]" /></div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b"><tr>{['Produkt', 'Kategori', 'Pris', 'Lager', 'Status', ''].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
                    <tbody className="bg-white divide-y">
                      {filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4"><div className="flex items-center gap-3"><img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover" /><div><p className="font-medium text-gray-900 text-sm">{product.name}</p>{product.printTypes?.some(pt => pt.enabled) && <div className="flex gap-1 mt-0.5 flex-wrap">{product.printTypes.filter(pt => pt.enabled).map(pt => <span key={pt.id} className="text-xs px-1.5 py-0.5 bg-[#f5f0ea] text-[#9e8a72] rounded font-medium">{pt.id === 'dtg' ? 'DTG' : 'Broderi'}{pt.extraPrice > 0 ? ` +${pt.extraPrice}` : ''}</span>)}</div>}</div></div></td>
                          <td className="px-4 py-4 text-sm text-gray-600">{product.category}</td>
                          <td className="px-4 py-4 text-sm font-semibold">{product.price} kr</td>
                          <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs ${product.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{product.stock === 0 ? 'Udsolgt' : 'På lager'}</span></td>
                          <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{product.status === 'active' ? 'Aktiv' : 'Inaktiv'}</span></td>
                          <td className="px-4 py-4"><div className="flex justify-end gap-2"><button onClick={() => handleEditProduct(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "customers" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Brugeradministration</h2>
                {customers.length === 0 ? <p className="text-gray-500 text-center py-8">Ingen brugere endnu</p> : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b"><tr>{['Navn', 'Email', 'Rolle', 'Oprettet'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
                      <tbody className="divide-y">
                        {customers.map(c => (
                          <tr key={c.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm">{c.name || '—'}</td>
                            <td className="px-6 py-4 text-sm">{c.email}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${c.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{c.role}</span></td>
                            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(c.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </section>
        </div>
      </div>
    </main>
  )
}

export default AdminDashboard