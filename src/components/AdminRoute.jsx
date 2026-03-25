import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminRoute() {
  const { isAdminAuthenticated, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-bark-700 sm:px-6">
        Checking admin session...
      </div>
    )
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}
