import { useShop } from '../context/ShopContext'

export default function WishlistPage() {
  const { wishlistItems, addToCart, removeFromWishlist } = useShop()

  function moveToCart(item) {
    addToCart(item)
    removeFromWishlist(item.$id)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-4xl text-bark-900">Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <p className="mt-6 text-bark-700">No items in your wishlist yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {wishlistItems.map((item) => (
            <article
              key={item.$id}
              className="rounded-2xl border border-beige-300 bg-cream-100 p-4 shadow-soft"
            >
              <div className="mb-4 h-24 w-full overflow-hidden rounded-xl border border-beige-300 bg-white">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-bark-500">
                    No image
                  </div>
                )}
              </div>

              <h2 className="font-serif text-2xl text-bark-900">{item.name}</h2>
              <p className="mt-2 text-sm text-bark-700">{item.description}</p>
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => moveToCart(item)}
                  className="rounded-full bg-bark-900 px-4 py-2 text-sm font-semibold text-cream-100"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  onClick={() => removeFromWishlist(item.$id)}
                  className="rounded-full border border-bark-500 px-4 py-2 text-sm font-semibold text-bark-700"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
