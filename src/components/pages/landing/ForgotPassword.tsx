import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/firebase";

const disposableEmailDomains = [
  "tempmail.com", "guerrillamail.com", "mailinator.com", "10minutemail.com",
  "throwaway.email", "temp-mail.org", "yopmail.com", "maildrop.cc",
  "sharklasers.com", "getnada.com", "dispostable.com", "trashmail.com",
];

const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Ugyldig email format" };
  }
  const domain = email.split("@")[1]?.toLowerCase();
  if (disposableEmailDomains.some((d) => domain?.includes(d))) {
    return { valid: false, error: "Midlertidige email-adresser er ikke tilladt" };
  }
  return { valid: true };
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [oobCode, setOobCode] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("oobCode");
    if (!code) return;

    setResetMode(true);
    setOobCode(code);
    setLoading(true);
    verifyPasswordResetCode(auth, code)
      .then((emailFromCode) => {
        setResetEmail(emailFromCode || "");
      })
      .catch(() => {
        setError("Linket er udløbet eller ugyldigt. Prøv at anmode om et nyt link.");
        setResetMode(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  const handleSubmit = async () => {
    setError("");

    if (!email.trim()) {
      setError("Indtast venligst din email adresse");
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.error!);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/send-reset-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.error || "Kunne ikke sende nulstillingslink. Prøv igen.");
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message || "Noget gik galt. Prøv igen senere.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    setError("");

    if (!password || password.length < 6) {
      setError("Adgangskoden skal være mindst 6 tegn");
      return;
    }
    if (password !== confirmPassword) {
      setError("Adgangskoderne matcher ikke");
      return;
    }
    if (!oobCode) {
      setError("Ugyldigt link. Prøv igen.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setResetSuccess(true);
    } catch (err: any) {
      setError("Noget gik galt. Prøv igen med et nyt link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4"
      role="main"
    >
      <div className="w-full max-w-md">
        <header className="text-center mb-8" role="banner">
          <div
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"
            aria-hidden="true"
          >
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {resetMode ? "Sæt ny adgangskode" : "Glemt adgangskode?"}
          </h1>
          <p className="text-gray-600">
            {resetMode
              ? "Angiv en ny adgangskode for din konto."
              : "Ingen bekymringer – vi sender dig et nulstillingslink."}
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-xl p-8">
          {resetMode ? (
            resetSuccess ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Adgangskode nulstillet
                </h2>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Din adgangskode er opdateret. Du kan nu logge ind med din nye adgangskode.
                </p>
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Tilbage til login
                </a>
              </div>
            ) : (
              <>
                {error && (
                  <div
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                  >
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email adresse
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={resetEmail}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Ny adgangskode
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="••••••••"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Gentag adgangskode
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    onClick={handleConfirmReset}
                    disabled={loading}
                    type="button"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sender..." : "Opdater adgangskode"}
                  </button>
                </div>
                <div className="mt-6 text-center">
                  <a
                    href="/login"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Tilbage til login
                  </a>
                </div>
              </>
            )
          ) : sent ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Email sendt!
              </h2>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Hvis der findes en konto med{" "}
                <span className="font-medium text-gray-800">{email}</span>, vil du modtage en email fra{" "}
                <span className="font-medium text-gray-800">support@trady.dk</span>{" "}
                med et link til at nulstille din adgangskode inden for få minutter.
              </p>
              <p className="text-xs text-gray-500 mb-6">
                Husk at tjekke din spam-mappe, hvis du ikke ser emailen.
              </p>
              <a
                href="/login"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Tilbage til login
              </a>
            </div>
          ) : (
            <>
              {error && (
                <div
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email adresse *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="din@email.dk"
                      autoFocus
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Indtast den email du brugte til at oprette din konto
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  type="button"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sender...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Send nulstillingslink</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center">
                <a
                  href="/login"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Tilbage til login
                </a>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ForgotPassword;