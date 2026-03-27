import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminRoute from './components/AdminRoute'
import { ShopProvider } from './context/ShopContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ProductDetailPage from './pages/ProductDetailPage'
import Footer from './components/Footer'

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <ShopProvider>
          <div className="min-h-screen bg-site-gradient text-bark-900">
            <div className="pointer-events-none fixed inset-0 -z-10 opacity-45">
              <div className="absolute -left-28 top-12 h-72 w-72 rounded-full bg-beige-300/70 blur-3xl" />
              <div className="absolute -right-28 bottom-20 h-80 w-80 rounded-full bg-sand-300/70 blur-3xl" />
            </div>

            <Navbar />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />

              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Footer />
          </div>
        </ShopProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  )
}

export default App
