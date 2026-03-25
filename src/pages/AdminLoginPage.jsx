import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminLoginPage() {
  const { isAdminAuthenticated, login } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  if (isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const redirectPath = location.state?.from || '/admin/dashboard'

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email, password)
      navigate(redirectPath, { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'Unable to sign in as admin.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-10 sm:px-6">
      <section className="w-full rounded-2xl border border-beige-300 bg-cream-100 p-6 shadow-soft sm:p-8">
        <h1 className="font-serif text-3xl text-bark-900">Admin Login</h1>
        <p className="mt-2 text-sm text-bark-700">Only admin account access is permitted.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm text-bark-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-bark-700">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
            />
          </label>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-bark-900 px-4 py-3 text-sm font-semibold text-cream-100 transition hover:bg-bark-800 disabled:cursor-not-allowed disabled:bg-bark-400"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}
