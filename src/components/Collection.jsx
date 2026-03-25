import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { fetchAllProducts } from '../services/products'
import { hasAppwriteConfig } from '../lib/appwrite'

export default function Collection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadProducts() {
      try {
        const data = await fetchAllProducts()
        if (mounted) {
          setProducts(data)
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message || 'Unable to load products from Appwrite.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      mounted = false
    }
  }, [])

  const displayProducts = products.slice(0, 3)

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="animate-fade-up flex min-h-[88vh] flex-col items-center justify-center text-center">
        <h1 className="font-serif text-6xl leading-none text-coffee sm:text-8xl">InBetween</h1>
        <p className="mt-6 text-2xl text-bark-700 sm:text-3xl">"A pause you didn't know you needed."</p>
        <p className="mt-6 max-w-2xl text-base leading-7 text-bark-600 sm:text-lg">
          Handcrafted candles made for quiet moments and slow evenings.
        </p>
      </section>

      <section className="animate-fade-up rounded-3xl border border-beige-300 bg-cream-100 p-8 shadow-soft sm:p-10">
        <h2 className="font-serif text-4xl text-coffee sm:text-5xl">Why InBetween Exists</h2>
        <p className="mt-4 max-w-4xl text-base leading-8 text-bark-700">
          In a world that moves too fast, InBetween was created to slow things down. Our candles
          are made for the quiet spaces between moments - when the noise fades and calm returns.
        </p>
      </section>

      <section className="animate-fade-up pt-16 text-center">
        <h2 className="font-serif text-5xl text-coffee">Our Collection</h2>
      </section>

      {!hasAppwriteConfig && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Appwrite variables are missing. Add the required Vite environment variables to load your
          production data.
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`loading-${index + 1}`}
                className="h-[420px] animate-pulse rounded-2xl border border-beige-300 bg-cream-100"
              />
            ))
          : displayProducts.map((product) => <ProductCard key={product.$id} product={product} />)}
      </div>

      {!loading && displayProducts.length === 0 && (
        <p className="mt-8 text-bark-700">No products added yet. Admin can add products from dashboard.</p>
      )}

      <section className="animate-fade-up mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            title: 'Slow Living',
            text: 'Encouraging calm moments in a fast world.',
          },
          {
            title: 'Handcrafted Care',
            text: 'Every candle is poured with intention.',
          },
          {
            title: 'Minimal Design',
            text: 'Neutral tones and simple forms that fit peaceful spaces.',
          },
        ].map((feature) => (
          <article key={feature.title} className="rounded-2xl border border-beige-300 bg-cream-100 p-6 shadow-soft">
            <h3 className="font-serif text-3xl text-coffee">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-bark-700">{feature.text}</p>
          </article>
        ))}
      </section>

      <section className="animate-fade-up mt-20 rounded-3xl border border-beige-300 bg-cream-100 p-8 text-center shadow-soft sm:p-10">
        <h2 className="font-serif text-4xl text-coffee">Follow Our Journey</h2>
        <a
          href="https://instagram.com/inbetwead"
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-bark-400 px-5 py-2 text-sm font-semibold text-bark-700 transition hover:bg-beige-200"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm8.5 1.5h-8.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Zm5.25-1.38a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26Z" />
          </svg>
          @inbetwead
        </a>
      </section>
    </section>
  )
}
