import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { fetchAllProducts } from '../services/products'
import { hasAppwriteConfig } from '../lib/appwrite'
import heroImage from '../assets/hero.png'

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

  const displayProducts = products

  return (
    <section className="w-full space-y-0 pb-0">
      <section
        className="animate-fade-up relative min-h-[90vh] w-full overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/28 backdrop-blur-[2px]" />
        <article className="relative z-10 mx-auto flex min-h-[86vh] max-w-4xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
          <h1 className="font-serif text-7xl leading-none text-coffee sm:text-8xl md:text-9xl">
            In Between
          </h1>
          <p className="mt-4 text-2xl text-bark-700 sm:text-3xl">
            A pause you didn't know you needed.
          </p>
          
          <a
            href="#our-collection"
            className="mt-8 inline-flex items-center rounded-full bg-bark-900 px-7 py-3 text-sm font-semibold text-cream-100 transition hover:bg-bark-800"
          >
            Shop Now
          </a>
        </article>
      </section>

      <div className="w-full space-y-8 px-0 sm:space-y-10 md:space-y-12">

      <section id="about" className="animate-fade-up w-full bg-[#E8DFD4] py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-2 h-1 w-12 bg-[#D8CBC3]" />
          <h2 className="font-serif text-5xl text-[#1D1D1D] sm:text-6xl md:text-7xl">About Us</h2>
          <div className="mt-10 space-y-6 text-base leading-8 text-[#83766B] sm:text-lg md:text-xl">
            <p>
              We're In Between - created for the moments you don't usually plan, but always end up
              needing.
            </p>
            <p>
              Somewhere between busy mornings and slow evenings, between getting things done and
              taking a breath, there's a space we often overlook. That's where we exist. Not to
              interrupt your day, and definitely not to slow it down completely, but to make it feel
              a little more intentional.
            </p>
            <p>
              Our candles are designed to sit beside you through it all - while you work, unwind,
              think, or simply exist for a moment. Because real life isn't perfectly balanced, and
              honestly, it doesn't need to be.
            </p>
            <p className="pt-2 italic">Just a little pause, exactly when you need it.</p>
          </div>
        </div>
      </section>

      <section id="our-collection" className="scroll-mt-24 animate-fade-up   text-center sm:px-6 sm:py-16 md:py-10 lg:px-8">
        <h2 className="font-serif text-4xl text-coffee sm:text-5xl md:text-6xl">The Pause Collection</h2>
        <p className="mt-2 text-sm text-bark-600 sm:text-base md:text-lg">A quiet beginning for slow moments.</p>
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

      <div className="grid grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 lg:px-8 lg:py-10">
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

      <section className="animate-fade-up grid grid-cols-1 gap-6 px-4 py-6 sm:px-6 md:grid-cols-3 md:gap-8 md:py-8 lg:px-8">
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
          <article key={feature.title} className="rounded-2xl border border-beige-300 bg-cream-100 p-6 shadow-soft transition hover:shadow-lg sm:p-7 md:p-8">
            <h3 className="font-serif text-2xl text-coffee sm:text-3xl">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-bark-700 sm:text-base">{feature.text}</p>
          </article>
        ))}
      </section>

      <section id="contact" className="animate-fade-up w-full  bg-bark-700 p-8 text-center shadow-soft sm:p-10 md:p-12">
        <h2 className="font-serif text-4xl text-white sm:text-5xl md:text-6xl">Follow Our Journey</h2>
        
        <a
          href="https://instagram.com/its.inbetween"
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-white bg-transparent px-6 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-[#8B6F47] sm:px-7 sm:py-3 md:text-base"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" aria-hidden="true">
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm8.5 1.5h-8.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Zm5.25-1.38a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26Z" />
          </svg>
          @its.inbetween
        </a>
      </section>

      <section className="grid grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:grid-cols-2 md:gap-8 md:py-10 lg:px-8">
        <article id="shipping" className="rounded-3xl border border-beige-300 bg-cream-100 p-8 shadow-soft transition hover:shadow-lg sm:p-9 md:p-10">
          <h3 className="font-serif text-2xl text-coffee sm:text-3xl">Shipping Policy</h3>
          <p className="mt-4 text-sm leading-7 text-bark-700 sm:text-base">Orders are processed within 2-3 business days.</p>
          <p className="mt-3 text-sm leading-7 text-bark-700 sm:text-base">Delivery usually takes 5-7 business days across India.</p>
        </article>

        <article id="refund" className="rounded-3xl border border-beige-300 bg-cream-100 p-8 shadow-soft transition hover:shadow-lg sm:p-9 md:p-10">
          <h3 className="font-serif text-2xl text-coffee sm:text-3xl">Refund Policy</h3>
          <p className="mt-4 text-sm leading-7 text-bark-700 sm:text-base">Returns are not accepted for normal orders.</p>
          <p className="mt-3 text-sm leading-7 text-bark-700 sm:text-base">If your order is damaged, contact us within 24 hours with photos for support in instagram.</p>
        </article>
      </section>
      </div>
    </section>
  )
}
