import { getProductLaunchPrice } from '../lib/constants'
import { useShop } from '../context/ShopContext'

export default function CartPage() {
  const { cartItems, updateCartItem, removeFromCart } = useShop()

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * getProductLaunchPrice(item),
    0,
  )

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-4xl text-bark-900">Cart</h1>

      {cartItems.length === 0 ? (
        <p className="mt-6 text-bark-700">Your cart is empty.</p>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.$id}
                className="rounded-2xl border border-beige-300 bg-cream-100 p-4 shadow-soft"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-beige-300 bg-white">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-bark-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div>
                    <h2 className="font-serif text-2xl text-bark-900">{item.name}</h2>
                    <p className="text-sm text-bark-700">₹{getProductLaunchPrice(item)} each</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateCartItem(item.$id, item.quantity - 1)}
                      className="rounded-full border border-bark-400 px-3 py-1 text-bark-700"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-bark-900">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartItem(item.$id, item.quantity + 1)}
                      className="rounded-full border border-bark-400 px-3 py-1 text-bark-700"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.$id)}
                      className="rounded-full bg-bark-900 px-4 py-2 text-sm text-cream-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-beige-300 bg-cream-100 p-5 shadow-soft">
            <p className="text-lg text-bark-700">Total</p>
            <p className="mt-1 text-3xl font-bold text-bark-900">₹{total}</p>
          </div>
        </>
      )}
    </main>
  )
}
