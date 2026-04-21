import { createBrowserRouter, Outlet, Navigate } from "react-router";
import { useAuth } from "./hooks/useAuth";
import { useState, useEffect } from "react";
import { getMaintenanceMode } from "@/lib/maintenanceMode";

import Maintenance from "./components/pages/landing/Maintenance";
import Home from "./components/Home";
import Login from "./components/pages/landing/Login";
import Konto from "./components/pages/landing/Konto";
import ErrorPage from "./components/layout/ErrorPage";
import AdminDashboard from "./components/pages/backend/Dashboard";
import ProductDetail from "./components/pages/landing/ProductDetail";
import Kurv from "./components/pages/landing/Kurv";
import Checkout from "./components/pages/landing/Checkout";
import Produkter from "./components/pages/landing/Produkter";
import Privatlivspolitik from "./components/pages/landing/undersider/Privatlivspolitik";
import Cookiepolitik from "./components/pages/landing/undersider/Cookiepolitik";
import Omos from "./components/pages/landing/undersider/Omos/Omos";
import Kontakt from "./components/pages/landing/undersider/Hjaalp/Kontakt";
import OrderStatus from "./components/pages/landing/undersider/Hjaalp/Tabs/Ordrestatus";
import ReturReklamation from "./components/pages/landing/undersider/Hjaalp/Tabs/ReturReklamation";
import DesignGuide from "./components/pages/landing/undersider/Hjaalp/Tabs/Designhjaalp";
import Faktura from "./components/pages/landing/undersider/Hjaalp/Tabs/Faktura";
import Samarbejde from "./components/pages/landing/undersider/Hjaalp/Tabs/Samarbejde";
import Priser from "./components/pages/landing/undersider/Hjaalp/Tabs/Priser";
import Faq from "./components/pages/landing/undersider/Hjaalp/Faq";
import ProductCustomizer from "./components/pages/landing/Productcusomizer";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Reset from "./components/pages/landing/ForgotPassword";
import OrdreBekraeftelse from "./components/pages/landing/Ordrebeкraeftelse";

const CACHE_KEY = "trady_maintenance"

function getSavedMaintenance(): boolean | null {
  try {
    const v = sessionStorage.getItem(CACHE_KEY)
    if (v === "true")  return true
    if (v === "false") return false
  } catch {}
  return null
}

function RootIndexRoute() {
  const [maintenance, setMaintenance] = useState<boolean | null>(getSavedMaintenance)

  useEffect(() => {
    getMaintenanceMode().then(val => {
      setMaintenance(val)
      try { sessionStorage.setItem(CACHE_KEY, String(val)) } catch {}
    })
  }, [])


  if (maintenance === null) {
    return (
      <div className="min-h-screen bg-[#d4c5b0] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-white/40 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return maintenance ? <Maintenance /> : <Home />
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth()
  if (loading || typeof role === "undefined") return null
  if (!user) return <Navigate to="/login" replace />
  if (role !== "admin") return <Navigate to="/konto" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth()
  if (loading || (user && typeof role === "undefined")) return null
  if (user) return <Navigate to={role === "admin" ? "/dashboard" : "/konto"} replace />
  return <>{children}</>
}

function RootLayout() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Outlet />
    </div>
  )
}

function SharedLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <RootIndexRoute /> },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Header />
            <Login />
            <Footer />
          </PublicRoute>
        ),
      },
      {
        element: <SharedLayout />,
        children: [
          { path: "produkt/:id",        element: <ProductDetail /> },
          { path: "produkt/:id/studio", element: <ProductCustomizer /> },
          { path: "produkter",          element: <Produkter /> },
          { path: "kurv",               element: <Kurv /> },
          { path: "checkout",           element: <Checkout /> },
          { path: "ordre-bekraeftelse", element: <OrdreBekraeftelse /> },
          { path: "privatlivspolitik",  element: <Privatlivspolitik /> },
          { path: "cookiepolitik",      element: <Cookiepolitik /> },
          { path: "om-os",              element: <Omos /> },
          { path: "kontakt",            element: <Kontakt /> },
          { path: "Order-Status",       element: <OrderStatus /> },
          { path: "Retur-Reklamation",  element: <ReturReklamation /> },
          { path: "Design-guide",       element: <DesignGuide /> },
          { path: "Faktura",            element: <Faktura /> },
          { path: "Samarbejde",         element: <Samarbejde /> },
          { path: "Priser",             element: <Priser /> },
          { path: "Faq",                element: <Faq /> },
          { path: "forgotpassword",     element: <Reset /> },
        ],
      },
    ],
  },
  {
    path: "/konto",
    element: (
      <AuthRoute>
        <Konto />
      </AuthRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
])

export default router