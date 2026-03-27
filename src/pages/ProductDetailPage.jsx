import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchAllProducts } from '../services/products'
import { useShop } from '../context/ShopContext'
import { getProductLaunchPrice, toInteger, getProductLaunchBadgeText } from '../lib/constants'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart, addToWishlist } = useShop()

  useEffect(() => {
    let mounted = true

    async function loadProduct() {
      try {
        const allProducts = await fetchAllProducts()
        const foundProduct = allProducts.find((p) => p.$id === id)
        
        if (mounted) {
          if (foundProduct) {
            setProduct(foundProduct)
          } else {
            setError('Product not found')
          }
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message || 'Unable to load product.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      mounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-cream-100" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-cream-100" />
            <div className="h-4 w-full animate-pulse rounded bg-cream-100" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-cream-100" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-lg text-bark-700">{error || 'Product not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 rounded-full bg-bark-900 px-6 py-2 text-sm font-semibold text-cream-100 transition hover:bg-bark-800"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const launchPrice = getProductLaunchPrice(product)
  const mrp = Math.max(0, toInteger(product?.mrp, 0))
  const launchBadgeText = getProductLaunchBadgeText(product)
  const discount = mrp > 0 ? Math.round(((mrp - launchPrice) / mrp) * 100) : 0

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate('/')}
        className="mb-8 flex items-center gap-2 text-sm font-medium text-bark-700 transition hover:text-bark-900"
      >
        <span>←</span> Back to Shop
      </button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="flex items-center justify-center rounded-2xl bg-beige-200">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover rounded-2xl"
            />
          ) : (
            <div className="flex h-96 w-full items-center justify-center px-6 text-center text-sm text-bark-600">
              Image pending upload in Appwrite Storage
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-4xl leading-tight text-bark-900 sm:text-5xl">
                  {product.name}
                </h1>
                {launchBadgeText && (
                  <div className="mt-3 inline-flex rounded-full bg-beige-200 px-4 py-1 text-xs font-medium text-bark-800">
                    {launchBadgeText}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-bark-900">₹{launchPrice}</span>
              {mrp > 0 && (
                <>
                  <span className="text-xl text-bark-500 line-through">₹{mrp}</span>
                  {discount > 0 && (
                    <span className="text-lg font-semibold text-green-600">{discount}% off</span>
                  )}
                </>
              )}
            </div>

            <p className="mt-8 text-base leading-8 text-bark-700 sm:text-lg">
              {product.description}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 rounded-full bg-bark-900 px-6 py-3 text-sm font-semibold text-cream-100 transition hover:bg-bark-800 sm:px-8"
              >
                Add to Cart
              </button>
              <button
                onClick={() => addToWishlist(product)}
                className="flex-1 rounded-full border-2 border-bark-900 px-6 py-3 text-sm font-semibold text-bark-900 transition hover:bg-bark-50 sm:px-8"
              >
                Add to Wishlist
              </button>
            </div>

            {product.scent && (
              <div className="mt-6">
                <h3 className="font-serif text-lg text-bark-900">Scent</h3>
                <p className="mt-2 text-bark-700">{product.scent}</p>
              </div>
            )}

            {product.notes && (
              <div className="mt-6">
                <h3 className="font-serif text-lg text-bark-900">Notes</h3>
                <p className="mt-2 text-bark-700">{product.notes}</p>
              </div>
            )}

            {product.weight && (
              <div className="mt-6">
                <h3 className="font-serif text-lg text-bark-900">Weight</h3>
                <p className="mt-2 text-bark-700">{product.weight}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
