import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CART_KEY = 'candle-cart-items'
const WISHLIST_KEY = 'candle-wishlist-items'

const ShopContext = createContext(null)

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => readStorage(CART_KEY, []))
  const [wishlistItems, setWishlistItems] = useState(() => readStorage(WISHLIST_KEY, []))

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.$id === product.$id)
      if (existing) {
        return prev.map((item) =>
          item.$id === product.$id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateCartItem = (productId, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.$id !== productId))
      return
    }

    setCartItems((prev) =>
      prev.map((item) => (item.$id === productId ? { ...item, quantity } : item)),
    )
  }

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.$id !== productId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => item.$id === product.$id)) {
        return prev
      }

      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.$id !== productId))
  }

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )

  const value = {
    cartItems,
    wishlistItems,
    cartCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)

  if (!context) {
    throw new Error('useShop must be used inside ShopProvider')
  }

  return context
}
