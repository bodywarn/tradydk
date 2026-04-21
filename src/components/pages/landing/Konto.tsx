import { useEffect, useState } from "react";
import { User, Package, Lock, MapPin, LogOut, Edit2, Save, X, Plus, Eye, EyeOff, AlertCircle } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, updatePassword, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  status: string;
  order_items?: { product_name: string; quantity: number }[];
}

interface Address {
  id: string;
  type: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  created_at?: string;
}

interface Profile {
  name: string;
  phone: string;
}

interface Customization {
  id: string
  product_name: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  notes: string
  customization_data: {
    logoImage: string
  }
}

const Konto = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  const [profile, setProfile] = useState<Profile>({
    name: "",
    phone: ""
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [customizations, setCustomizations] = useState<Customization[]>([]);

  const [passwordForm, setPasswordForm] = useState({
    new: "",
    confirm: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });

  const [newAddress, setNewAddress] = useState({
    type: "Hjem",
    name: "",
    street: "",
    city: "",
    zip: "",
    country: "Danmark"
  });

  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserEmail(currentUser.email || "");
        await loadProfile(currentUser.uid);
        await loadOrders(currentUser.uid);
        await loadAddresses(currentUser.uid);
        await loadCustomizations(currentUser.uid);
      } else {
        window.location.href = '/login';
      }
    });

    return () => unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const profileData = docSnap.data();
        setProfile({
          name: profileData.name || "",
          phone: profileData.phone || ""
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const loadOrders = async (userId: string) => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('user_id', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      const ordersData: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({
          id: doc.id,
          ...doc.data()
        } as Order);
      });
      
      ordersData.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
      
      setOrders(ordersData);
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  const loadAddresses = async (userId: string) => {
    try {
      const addressesRef = collection(db, 'addresses');
      const q = query(
        addressesRef,
        where('user_id', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      const addressesData: Address[] = [];
      querySnapshot.forEach((doc) => {
        addressesData.push({
          id: doc.id,
          ...doc.data()
        } as Address);
      });
      
      addressesData.sort((a, b) => {
        if (!a.created_at || !b.created_at) return 0;
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; 
      });
      
      setAddresses(addressesData);
    } catch (err) {
      console.error('Error loading addresses:', err);
    }
  };

  const loadCustomizations = async (userId: string) => {
    try {
      const customizationsRef = collection(db, 'customizations');
      const q = query(
        customizationsRef,
        where('user_id', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      const customizationsData: Customization[] = [];
      querySnapshot.forEach((doc) => {
        customizationsData.push({
          id: doc.id,
          ...doc.data()
        } as Customization);
      });
      
      customizationsData.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
      
      setCustomizations(customizationsData);
    } catch (err) {
      console.error('Error loading customizations:', err);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const docRef = doc(db, 'profiles', user.uid);
      await updateDoc(docRef, {
        name: profile.name,
        phone: profile.phone,
        updated_at: new Date().toISOString()
      });

      setSuccess("Profil opdateret!");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Kunne ikke opdatere profil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (passwordForm.new !== passwordForm.confirm) {
      setError("Adgangskoderne matcher ikke");
      setLoading(false);
      return;
    }

    if (passwordForm.new.length < 6) {
      setError("Ny adgangskode skal være mindst 6 tegn");
      setLoading(false);
      return;
    }

    try {
      if (!user) throw new Error('Ingen bruger logget ind');

      await updatePassword(user, passwordForm.new);
      
      setSuccess("Adgangskode opdateret!");
      setPasswordForm({ new: "", confirm: "" });
    } catch (err: any) {
      console.error('Password update error:', err);
      
      let errorMessage = 'Kunne ikke opdatere adgangskode';
      
      if (err.code === 'auth/requires-recent-login') {
        errorMessage = 'For sikkerhed skal du logge ind igen for at ændre adgangskode';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Adgangskoden er for svag';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!user) return;
    
    setLoading(true);
    setError("");
    setSuccess("");

    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.zip) {
      setError("Udfyld venligst alle felter");
      setLoading(false);
      return;
    }

    try {
      const addressesRef = collection(db, 'addresses');
      await addDoc(addressesRef, {
        user_id: user.uid,
        ...newAddress,
        created_at: new Date().toISOString()
      });

      setSuccess("Adresse tilføjet!");
      setNewAddress({
        type: "Hjem",
        name: "",
        street: "",
        city: "",
        zip: "",
        country: "Danmark"
      });
      setShowAddressForm(false);
      await loadAddresses(user.uid);
    } catch (err: any) {
      setError(err.message || "Kunne ikke tilføje adresse");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette denne adresse?")) return;

    try {
      await deleteDoc(doc(db, 'addresses', id));
      setSuccess("Adresse slettet!");
      if (user) await loadAddresses(user.uid);
    } catch (err: any) {
      setError(err.message || "Kunne ikke slette adresse");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      setError('Kunne ikke logge ud');
    }
  };

  const tabs = [
    { id: "profile", label: "Min Profil", icon: User },
    { id: "customizations", label: "Mine Designs", icon: AlertCircle },
    { id: "orders", label: "Ordrehistorik", icon: Package },
    { id: "password", label: "Adgangskode", icon: Lock },
    { id: "addresses", label: "Adressebog", icon: MapPin },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('da-DK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    document.title = `Min Konto - ${profile.name || 'Bruger'}`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Administrer din profil, ordrer, adresser og kontoindstillinger i vores webshop.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Administrer din profil, ordrer, adresser og kontoindstillinger i vores webshop.';
      document.head.appendChild(meta);
    }

    const metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
    }
  }, [profile.name]);

  return (
    <main className="min-h-screen bg-gray-50" role="main" aria-labelledby="page-title">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6" role="banner">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 id="page-title" className="text-3xl font-bold text-gray-900">Min Konto</h1>
              <p className="text-gray-600 mt-1" aria-label="Din email adresse">{userEmail}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              aria-label="Log ud af din konto"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Log ud
            </button>
          </div>
        </header>

        {error && (
          <aside className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="assertive">
            <p className="text-red-600">{error}</p>
          </aside>
        )}

        {success && (
          <aside className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg" role="status" aria-live="polite">
            <p className="text-green-600">{success}</p>
          </aside>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1" aria-label="Konto navigation">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => {
                          setActiveTab(tab.id);
                          setError("");
                          setSuccess("");
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                          activeTab === tab.id
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-current={activeTab === tab.id ? "page" : undefined}
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
                        <span className="font-medium">{tab.label}</span>
                        {tab.id === "customizations" && customizations.filter(c => c.status === 'pending').length > 0 && (
                          <span className="ml-auto bg-yellow-500 text-white text-xs rounded-full px-2 py-1">
                            {customizations.filter(c => c.status === 'pending').length}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <section className="lg:col-span-3" aria-label="Konto indhold">
            <article className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === "profile" && (
                <section aria-labelledby="profile-heading">
                  <div className="flex justify-between items-center mb-6">
                    <h2 id="profile-heading" className="text-2xl font-bold text-gray-900">Min Profil</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        aria-label="Rediger profil"
                      >
                        <Edit2 className="w-4 h-4" aria-hidden="true" />
                        Rediger
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                          aria-label="Gem profil ændringer"
                        >
                          <Save className="w-4 h-4" aria-hidden="true" />
                          Gem
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            if (user) loadProfile(user.uid);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                          aria-label="Annuller redigering"
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                          Annuller
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-2">Navn</label>
                      <input
                        id="profile-name"
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        id="profile-email"
                        type="email"
                        value={userEmail}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        aria-describedby="email-help"
                      />
                      <p id="email-help" className="text-sm text-gray-500 mt-1">Email kan ikke ændres</p>
                    </div>
                    <div>
                      <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                      <input
                        id="profile-phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="+45 12 34 56 78"
                      />
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "orders" && (
                <section aria-labelledby="orders-heading">
                  <h2 id="orders-heading" className="text-2xl font-bold text-gray-900 mb-6">Ordrehistorik</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
                      <p className="text-gray-500">Du har ingen ordrer endnu</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {orders.map((order) => (
                        <li key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <article className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <header className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg text-gray-900">{order.order_number}</h3>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                  order.status === "Leveret" ? "bg-green-100 text-green-800" : 
                                  order.status === "Sendt" ? "bg-blue-100 text-blue-800" :
                                  "bg-yellow-100 text-yellow-800"
                                }`} aria-label={`Status: ${order.status}`}>
                                  {order.status}
                                </span>
                              </header>
                              <p className="text-gray-600">
                                <time dateTime={order.created_at}>Dato: {formatDate(order.created_at)}</time>
                              </p>
                              <p className="text-gray-600">
                                {order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0} produkter
                              </p>
                            </div>
                            <div className="flex flex-col justify-between items-end">
                              <p className="text-2xl font-bold text-gray-900" aria-label={`Total: ${order.total.toFixed(2)} kroner`}>
                                {order.total.toFixed(2)} kr
                              </p>
                            </div>
                          </article>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}

              {activeTab === "password" && (
                <section aria-labelledby="password-heading">
                  <h2 id="password-heading" className="text-2xl font-bold text-gray-900 mb-6">Skift Adgangskode</h2>
                  <div className="max-w-md space-y-4">
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">Ny adgangskode</label>
                      <div className="relative">
                        <input
                          id="new-password"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.new}
                          onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                          className="w-full px-4 py-2 pr-12 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Mindst 6 tegn"
                          aria-required="true"
                          aria-describedby="password-requirements"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label={showPasswords.new ? "Skjul adgangskode" : "Vis adgangskode"}
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p id="password-requirements" className="text-xs text-gray-500 mt-1">Adgangskoden skal være mindst 6 tegn lang</p>
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">Bekræft ny adgangskode</label>
                      <div className="relative">
                        <input
                          id="confirm-password"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                          className="w-full px-4 py-2 pr-12 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                          aria-required="true"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label={showPasswords.confirm ? "Skjul bekræftelse adgangskode" : "Vis bekræftelse adgangskode"}
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                      aria-label="Skift adgangskode"
                    >
                      {loading ? "Opdaterer..." : "Skift Adgangskode"}
                    </button>
                  </div>
                </section>
              )}

              {activeTab === "addresses" && (
                <section aria-labelledby="addresses-heading">
                  <div className="flex justify-between items-center mb-6">
                    <h2 id="addresses-heading" className="text-2xl font-bold text-gray-900">Adressebog</h2>
                    <button 
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      aria-label="Tilføj ny adresse"
                      aria-expanded={showAddressForm}
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                      Tilføj Adresse
                    </button>
                  </div>

                  {showAddressForm && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h3 className="font-semibold text-gray-900 mb-4">Ny Adresse</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="address-type" className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                          <select
                            id="address-type"
                            value={newAddress.type}
                            onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Hjem">Hjem</option>
                            <option value="Arbejde">Arbejde</option>
                            <option value="Anden">Anden</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="address-name" className="block text-sm font-medium text-gray-700 mb-2">Navn</label>
                          <input
                            id="address-name"
                            type="text"
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                            aria-required="true"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="address-street" className="block text-sm font-medium text-gray-700 mb-2">Gade</label>
                          <input
                            id="address-street"
                            type="text"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                            aria-required="true"
                          />
                        </div>
                        <div>
                          <label htmlFor="address-city" className="block text-sm font-medium text-gray-700 mb-2">By</label>
                          <input
                            id="address-city"
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                            aria-required="true"
                          />
                        </div>
                        <div>
                          <label htmlFor="address-zip" className="block text-sm font-medium text-gray-700 mb-2">Postnr.</label>
                          <input
                            id="address-zip"
                            type="text"
                            value={newAddress.zip}
                            onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                            aria-required="true"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={handleAddAddress}
                          disabled={loading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                          aria-label="Gem ny adresse"
                        >
                          Gem
                        </button>
                        <button
                          onClick={() => setShowAddressForm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                          aria-label="Annuller tilføjelse af adresse"
                        >
                          Annuller
                        </button>
                      </div>
                    </div>
                  )}

                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
                      <p className="text-gray-500">Ingen adresser tilføjet endnu</p>
                    </div>
                  ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <li key={address.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <article>
                            <header className="flex justify-between items-start mb-3">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {address.type}
                              </span>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-red-600 hover:text-red-700"
                                aria-label={`Slet adresse: ${address.name}, ${address.street}`}
                              >
                                <X className="w-5 h-5" aria-hidden="true" />
                              </button>
                            </header>
                            <address className="not-italic">
                              <p className="font-semibold text-gray-900">{address.name}</p>
                              <p className="text-gray-600">{address.street}</p>
                              <p className="text-gray-600">{address.zip} {address.city}</p>
                              <p className="text-gray-600">{address.country}</p>
                            </address>
                          </article>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}

              {activeTab === "customizations" && (
                <section aria-labelledby="customizations-heading">
                  <h2 id="customizations-heading" className="text-2xl font-bold text-gray-900 mb-6">Mine Design Anmodninger</h2>
                  {customizations.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Du har ingen design anmodninger endnu</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {customizations.map((custom) => (
                        <li key={custom.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <article className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2 min-h-24">
                              <img
                                src={custom.customization_data.logoImage}
                                alt={`Design for ${custom.product_name}`}
                                className="max-w-full max-h-20 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/808080/FFFFFF/png?text=Design'
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{custom.product_name}</p>
                              <p className="text-sm text-gray-600">
                                <time dateTime={custom.created_at}>{formatDate(custom.created_at)}</time>
                              </p>
                            </div>
                            <div className="flex items-center">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                custom.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                custom.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {custom.status === 'pending' ? '⏳ Venter' :
                                 custom.status === 'approved' ? '✓ Godkendt' :
                                 '✗ Afvist'}
                              </span>
                            </div>
                            {custom.status === 'rejected' && custom.notes && (
                              <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
                                <p className="font-semibold mb-1">Årsag til afvisning:</p>
                                <p>{custom.notes}</p>
                              </div>
                            )}
                          </article>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}
            </article>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Konto;