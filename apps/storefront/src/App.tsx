import { Routes, Route } from 'react-router'
import Navbar from '@/components/Navbar'
import HomePage from '@/pages/HomePage'
import ProductListingPage from '@/pages/ProductListingPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CartPage from '@/pages/CartPage'
import EmptyCartPage from '@/pages/EmptyCartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import CheckoutNotLoggedInPage from '@/pages/CheckoutNotLoggedInPage'
import ReviewAndPayPage from '@/pages/ReviewAndPayPage'
import OrderConfirmationPage from '@/pages/OrderConfirmationPage'
import OrderCheckupPage from '@/pages/OrderCheckupPage'
import LoginPage from '@/pages/LoginPage'
import CreateAccountPage from '@/pages/CreateAccountPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import PersonalInfoPage from '@/pages/PersonalInfoPage'
import MyOrdersPage from '@/pages/MyOrdersPage'
import OrderDetailsPage from '@/pages/OrderDetailsPage'
import AddressesPage from '@/pages/AddressesPage'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product-listing" element={<ProductListingPage />} />
          <Route path="/product-detail" element={<ProductDetailPage />} />
          <Route path="/product-detail/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/empty-cart" element={<EmptyCartPage />} />
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
      </div>
    </div>
  )
}
