import { Link, NavLink } from 'react-router-dom'
import { useShop } from '../context/ShopContext'

function linkClass({ isActive }) {
  return isActive
    ? 'rounded-full bg-bark-900 px-3 py-1.5 text-cream-100'
    : 'rounded-full px-3 py-1.5 text-bark-700 transition hover:bg-cream-200 hover:text-bark-900'
}

export default function Navbar() {
  const { cartCount, wishlistItems, myOrdersCount } = useShop()

  return (
    <header className="sticky top-0 z-30 border-b border-beige-300/80 bg-cream-100/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="font-serif text-3xl leading-none text-bark-900">
          In Between
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-1.5 text-sm sm:gap-2 sm:text-base">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/wishlist" className={linkClass}>
            Wishlist ({wishlistItems.length})
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            Cart ({cartCount})
          </NavLink>
          <NavLink to="/my-orders" className={linkClass}>
            My Orders ({myOrdersCount})
          </NavLink>
          <NavLink to="/admin/login" className={linkClass}>
            Admin
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
