export default function Footer() {
  return (
    <footer className="mt-20 bg-coffee px-4 py-14 text-cream-100 sm:px-6 md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-serif text-4xl sm:text-5xl">In Between</h2>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:text-sm text-cream-200">
          <a href="#about" className="transition hover:text-cream-100 hover:underline">
            About
          </a>
          <span>|</span>
          <a href="#contact" className="transition hover:text-cream-100 hover:underline">
            Contact
          </a>
          <span>|</span>
          <a href="#shipping" className="transition hover:text-cream-100 hover:underline">
            Shipping Policy
          </a>
          <span>|</span>
          <a href="#refund" className="transition hover:text-cream-100 hover:underline">
            Refund Policy
          </a>
        </div>

        <p className="mt-3 text-xs sm:text-sm text-cream-200">© 2026 In Between</p>

        <div className="mt-6 space-y-2 text-xs uppercase tracking-[0.14em] text-cream-300 sm:text-xs">
          <p>Made with care in India</p>
          <p>Small batch production</p>
          <p>Limited launch stock</p>
        </div>
      </div>
    </footer>
  )
}
