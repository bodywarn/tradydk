import { useEffect, useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, Phone } from "lucide-react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const disposableEmailDomains = [
  'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
  'throwaway.email', 'temp-mail.org', 'yopmail.com', 'maildrop.cc',
  'sharklasers.com', 'getnada.com', 'dispostable.com', 'trashmail.com'
];

const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Ugyldig email format" };
  }
  const domain = email.split('@')[1]?.toLowerCase();
  if (disposableEmailDomains.some(d => domain?.includes(d))) {
    return { valid: false, error: "Midlertidige email-adresser er ikke tilladt" };
  }
  return { valid: true };
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return "Godmorgen";
    if (hour >= 10 && hour < 13) return "God formiddag";
    if (hour >= 13 && hour < 18) return "Goddag";
    if (hour >= 18 && hour < 22) return "Godaften";
    return "Godnat";
  };

  const checkRoleAndRedirect = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'profiles', userId));
      const role = userDoc.data()?.role || 'customer';
      if (role === 'admin') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/konto';
      }
    } catch (err) {
      console.error('Error checking role:', err);
      window.location.href = '/konto';
    }
  };

  const handleEmailLogin = async () => {
    setError("");
    setSuccess("");

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      setError(emailValidation.error!);
      return;
    }
    if (!formData.password) {
      setError("Indtast venligst adgangskode");
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      await checkRoleAndRedirect(userCredential.user.uid);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/too-many-requests') {
        setError("For mange login forsøg. Vent venligst 1 minut.");
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Forkert email eller adgangskode");
      } else if (err.code === 'auth/invalid-credential') {
        setError("Forkert email eller adgangskode");
      } else if (err.code === 'auth/invalid-email') {
        setError("Ugyldig email adresse");
      } else {
        setError("Login fejlede. Tjek email og adgangskode.");
      }
      setLoading(false);
    }
  };

  const handleEmailRegister = async () => {
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Indtast venligst dit fulde navn");
      return;
    }
    if (formData.name.trim().length < 2) {
      setError("Navnet skal være mindst 2 tegn");
      return;
    }
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      setError(emailValidation.error!);
      return;
    }
    if (!formData.phone.trim()) {
      setError("Indtast venligst dit telefonnummer");
      return;
    }
    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setError("Telefonnummer skal være 8 cifre");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Adgangskoderne matcher ikke");
      return;
    }
    if (formData.password.length < 6) {
      setError("Adgangskoden skal være mindst 6 tegn");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await firebaseUpdateProfile(userCredential.user, {
        displayName: formData.name.trim()
      });
      await setDoc(doc(db, 'profiles', userCredential.user.uid), {
        name: formData.name.trim(),
        email: formData.email,
        phone: formData.phone.trim(),
        role: 'customer',
        createdAt: new Date()
      });

      setSuccess("Konto oprettet! Du kan nu logge ind.");
      setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
      setTimeout(() => {
        setIsLogin(true);
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Denne email er allerede i brug");
      } else if (err.code === 'auth/weak-password') {
        setError("Adgangskoden er for svag");
      } else if (err.code === 'auth/invalid-email') {
        setError("Ugyldig email adresse");
      } else {
        setError("Registrering fejlede. Prøv igen.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = () => {
    if (isLogin) {
      handleEmailLogin();
    } else {
      handleEmailRegister();
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    setSuccess("");

    if (!formData.email) {
      setError("Indtast venligst din email først");
      return;
    }
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      setError(emailValidation.error!);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/send-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Kunne ikke sende reset email. Prøv igen senere.');
      }

      setSuccess('Password reset email sendt! Tjek din indbakke / spam');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Kunne ikke sende reset email. Prøv igen senere.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const profileRef = doc(db, 'profiles', user.uid);
      const profileSnap = await getDoc(profileRef);
      if (!profileSnap.exists()) {
        await setDoc(profileRef, {
          name: user.displayName || '',
          email: user.email || '',
          phone: '',
          role: 'customer',
          createdAt: new Date()
        });
      }
      await checkRoleAndRedirect(user.uid);
    } catch (err: any) {
      console.error("Google auth error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Login aflyst");
      } else if (err.code === 'auth/cancelled-popup-request') {
      } else {
        setError("Google login fejlede. Prøv igen.");
      }
      setLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const profileRef = doc(db, 'profiles', user.uid);
      const profileSnap = await getDoc(profileRef);
      if (!profileSnap.exists()) {
        await setDoc(profileRef, {
          name: user.displayName || '',
          email: user.email || '',
          phone: '',
          role: 'customer',
          createdAt: new Date()
        });
      }
      await checkRoleAndRedirect(user.uid);
    } catch (err: any) {
      console.error("Facebook auth error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Login aflyst");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError("En konto med denne email eksisterer allerede");
      } else if (err.code === 'auth/cancelled-popup-request') {
      } else {
        setError("Facebook login fejlede. Prøv igen.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = isLogin ? 'Log ind | Din Webshop' : 'Opret konto | Din Webshop';
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = isLogin
      ? 'Log ind på din konto for at administrere ordrer og profil i vores webshop.'
      : 'Opret en gratis konto og få adgang til eksklusiv shopping og personlig ordrestyring.';
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
    }
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'login, registrering, opret konto, webshop login, bruger konto';
      document.head.appendChild(meta);
    }
  }, [isLogin]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4" role="main">
      <div className="w-full max-w-md">
        <header className="text-center mb-8" role="banner">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4" aria-hidden="true">
            {isLogin ? <LogIn className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? getGreeting() : "Opret konto"}
          </h1>
          <p className="text-gray-600">
            {isLogin ? "Log ind for at fortsætte til din konto" : "Opret en konto for at komme i gang"}
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-xl p-8" role="form" aria-labelledby="auth-form-title">
          <h2 id="auth-form-title" className="sr-only">{isLogin ? "Login formular" : "Registrerings formular"}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="assertive" aria-atomic="true">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg" role="status" aria-live="polite" aria-atomic="true">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Fulde navn *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name" type="text" name="name" value={formData.name}
                    onChange={handleInputChange} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email" type="email" name="email" value={formData.email}
                  onChange={handleInputChange} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full pl-10 pr-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="din@email.dk"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Telefonnummer *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="phone" type="tel" name="phone" value={formData.phone}
                    onChange={handleInputChange} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="w-full pl-10 pr-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="12345678" maxLength={8}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Adgangskode *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password" type={showPassword ? "text" : "password"} name="password" value={formData.password}
                  onChange={handleInputChange} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full pl-10 pr-12 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Skjul adgangskode" : "Vis adgangskode"}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Bekræft adgangskode *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword" type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword}
                    onChange={handleInputChange} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="ml-2 text-gray-600">Husk mig</span>
                </label>
                <button type="button" onClick={handlePasswordReset} className="text-blue-600 hover:text-blue-700 font-medium">
                  Glemt adgangskode?
                </button>
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} type="button"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Behandler...</span>
                </>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  <span>{isLogin ? "Log ind" : "Opret konto"}</span>
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Eller fortsæt med</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={handleGoogleAuth} disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium">Google</span>
              </button>

              <button type="button" onClick={handleFacebookAuth} disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-gray-700 font-medium">Facebook</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Har du ikke en konto?" : "Har du allerede en konto?"}
              {" "}
              <button type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                  setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
                }}
                className="text-blue-600 hover:text-blue-700 font-medium">
                {isLogin ? "Opret konto" : "Log ind"}
              </button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;