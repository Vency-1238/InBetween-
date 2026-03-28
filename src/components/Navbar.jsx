import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useShop } from '../context/ShopContext'

function linkClass({ isActive }) {
  return isActive
    ? 'rounded-full bg-bark-900 px-3 py-1.5 text-cream-100'
    : 'rounded-full px-3 py-1.5 text-bark-700 transition hover:bg-cream-200 hover:text-bark-900'
}

function mobileLinkClass({ isActive }) {
  return isActive
    ? 'block rounded-xl bg-bark-900 px-4 py-3 text-cream-100'
    : 'block rounded-xl px-4 py-3 text-bark-700 transition hover:bg-cream-200 hover:text-bark-900'
}

export default function Navbar() {
  const { cartCount, wishlistItems, myOrdersCount } = useShop()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/wishlist', label: `Wishlist (${wishlistItems.length})` },
    { to: '/cart', label: `Cart (${cartCount})` },
    { to: '/my-orders', label: `My Orders (${myOrdersCount})` },
    { to: '/admin/login', label: 'Admin' },
  ]

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-beige-300/80 bg-cream-100/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="font-serif text-3xl leading-none text-bark-900">
            In Between
          </Link>

          <div className="hidden flex-wrap items-center justify-end gap-1.5 text-sm sm:gap-2 sm:text-base md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-beige-300 bg-white text-bark-900 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-[90] md:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div
          className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <aside
          aria-hidden={!isMobileMenuOpen}
          className={`absolute left-0 top-0 h-full w-[86vw] max-w-[360px] overflow-y-auto border-r border-beige-300 bg-cream-100 p-5 shadow-soft-lg transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-5 border-b border-beige-300 pb-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-serif text-2xl text-bark-900">Menu</p>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-beige-300 bg-white text-bark-900"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-bark-600">A pause you did not know you needed.</p>
          </div>

          <div className="space-y-2 text-sm">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={mobileLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-beige-300 bg-white p-3 text-xs text-bark-600">
            Tip: Tap outside the panel or press Esc to close.
          </div>
        </aside>
      </div>
    </>
  )
}
