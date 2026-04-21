import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./router";
import "./index.css";
import { AuthProvider } from "./components/context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Cookies from "./components/layout/Cookies";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <Cookies />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
