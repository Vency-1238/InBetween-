import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { account, assertAppwriteConfig } from '../lib/appwrite'

const AdminAuthContext = createContext(null)

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function restoreSession() {
      try {
        assertAppwriteConfig()
        const user = await account.get()

        if (!mounted) {
          return
        }

        if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) {
          await account.deleteSession('current')
          setAdminUser(null)
        } else {
          setAdminUser(user)
        }
      } catch {
        if (mounted) {
          setAdminUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      mounted = false
    }
  }, [])

  const login = async (email, password) => {
    assertAppwriteConfig()

    await account.createEmailPasswordSession(email, password)
    const user = await account.get()

    if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) {
      await account.deleteSession('current')
      throw new Error('Only admin account access is allowed.')
    }

    setAdminUser(user)
  }

  const logout = async () => {
    try {
      await account.deleteSession('current')
    } finally {
      setAdminUser(null)
    }
  }

  const value = useMemo(
    () => ({
      adminUser,
      loading,
      isAdminAuthenticated: Boolean(adminUser),
      login,
      logout,
    }),
    [adminUser, loading],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)

  if (!context) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  }

  return context
}
