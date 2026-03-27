import { useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import {
  getProductLaunchBadgeText,
  getProductLaunchPrice,
  toInteger,
} from '../lib/constants'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart, addToWishlist } = useShop()
  const launchPrice = getProductLaunchPrice(product)
  const mrp = Math.max(0, toInteger(product?.mrp, 0))
  const launchBadgeText = getProductLaunchBadgeText(product)

  return (
    <article className="group rounded-2xl border border-beige-300 bg-cream-100 p-4 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-soft-lg sm:p-5">
      <div 
        className="mb-4 overflow-hidden rounded-xl bg-beige-200 cursor-pointer"
        onClick={() => navigate(`/product/${product.$id}`)}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-64 items-center justify-center px-6 text-center text-sm text-bark-600">
            Image pending upload in Appwrite Storage
          </div>
        )}
      </div>

      <h3 
        className="font-serif text-2xl leading-tight text-bark-900 break-words cursor-pointer transition hover:text-bark-700"
        onClick={() => navigate(`/product/${product.$id}`)}
      >
        {product.name}
      </h3>
      <p className="mt-2 min-h-14 overflow-hidden text-sm leading-6 text-bark-700 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] break-words">
        {product.description}
      </p>

      {launchBadgeText && (
        <div className="mt-4 inline-flex rounded-full bg-beige-200 px-4 py-1 text-xs font-medium text-bark-800">
          {launchBadgeText}
        </div>
      )}

      <div className="mt-3 flex items-end gap-3">
        <span className="text-3xl font-bold text-bark-900">₹{launchPrice}</span>
        <span className="text-base text-bark-500 line-through">₹{mrp}</span>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="flex-1 rounded-full bg-bark-900 px-4 py-2 text-sm font-semibold text-cream-100 transition hover:bg-bark-800"
        >
          Add to cart
        </button>
        <button
          type="button"
          onClick={() => addToWishlist(product)}
          className="rounded-full border border-bark-800 px-4 py-2 text-sm font-semibold text-bark-800 transition hover:bg-beige-200"
        >
          Wishlist
        </button>
      </div>
    </article>
  )
}
