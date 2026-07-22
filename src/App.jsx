import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Contact from "./components/Contact";
import WhatsAppButton from "./components/WhatsAppButton";
import Lifestyle from "./components/Lifestyle";

import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductPage from "./pages/ProductPage";

import CartDrawer from "./components/cart/CartDrawer";

import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentPendingPage from "./pages/PaymentPendingPage";
import PaymentFailurePage from "./pages/PaymentFailurePage";

function LandingPage() {
  return (
    <>
      <Hero />
      <Benefits />
      <Lifestyle />
      <Contact />
    </>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/producto" element={<ProductPage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pago/exitoso" element={<PaymentSuccessPage />} />
        <Route path="/pago/pendiente" element={<PaymentPendingPage />} />
        <Route path="/pago/error" element={<PaymentFailurePage />} />
      </Routes>
    </>
  );
}

export default App;