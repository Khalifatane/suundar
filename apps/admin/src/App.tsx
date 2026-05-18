import { Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { AddressesPage } from "./pages/AddressesPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutNotLoggedInPage } from "./pages/CheckoutNotLoggedInPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CreateAccountPage } from "./pages/CreateAccountPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MyOrdersPage } from "./pages/MyOrdersPage";
import { OrderCheckupPage } from "./pages/OrderCheckupPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { OrderDetailsPage } from "./pages/OrderDetailsPage";
import { PersonalInfoPage } from "./pages/PersonalInfoPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProductListingPage } from "./pages/ProductListingPage";
import { ReviewAndPayPage } from "./pages/ReviewAndPayPage";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product-listing" element={<ProductListingPage />} />
            <Route path="/product-detail" element={<ProductDetailPage />} />
            <Route path="/product-detail/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout-not-logged-in" element={<CheckoutNotLoggedInPage />} />
            <Route path="/review-and-pay" element={<ReviewAndPayPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/order-checkup" element={<OrderCheckupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/personal-info" element={<PersonalInfoPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/order-details" element={<OrderDetailsPage />} />
            <Route path="/addresses" element={<AddressesPage />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}
