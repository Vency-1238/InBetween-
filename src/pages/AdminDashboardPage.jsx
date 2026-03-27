import { useEffect, useMemo, useState } from 'react'
import { useAdminAuth } from '../context/AdminAuthContext'
import {
  addProduct,
  deleteProductImage,
  fetchAllProducts,
  removeProduct,
  updateProduct,
  uploadProductImage,
} from '../services/products'
import { notifyProductsChanged } from '../lib/productSync'
import { toInteger } from '../lib/constants'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  mrp: '',
  launchOfferPercent: '0',
  imageFile: null,
}

export default function AdminDashboardPage() {
  const { logout } = useAdminAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState(emptyForm)

  async function loadProducts() {
    setLoading(true)
    setError('')

    try {
      const data = await fetchAllProducts()
      setProducts(data)
    } catch (loadError) {
      setError(loadError.message || 'Unable to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const submitLabel = useMemo(() => {
    if (saving) {
      return editingId ? 'Updating...' : 'Adding...'
    }

    return editingId ? 'Update product' : 'Add product'
  }, [editingId, saving])

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setFeedback('')
    setSaving(true)

    const isEditing = Boolean(editingId)
    const current = products.find((item) => item.$id === editingId)

    try {
      const name = form.name.trim()
      const description = form.description.trim()
      const price = toInteger(form.price, -1)
      const mrp = toInteger(form.mrp, -1)
      const launchOfferPercent = toInteger(form.launchOfferPercent, -1)

      if (!name) {
        throw new Error('Product name is required.')
      }

      if (!description) {
        throw new Error('Description is required.')
      }

      if (price < 0 || mrp < 0) {
        throw new Error('Price and MRP must be integer values (0 or greater).')
      }

      if (launchOfferPercent < 0 || launchOfferPercent > 100) {
        throw new Error('Launch offer must be an integer between 0 and 100.')
      }

      let imageId = current?.imageId || ''

      if (form.imageFile) {
        imageId = await uploadProductImage(form.imageFile)
      }

      if (isEditing) {
        await updateProduct(editingId, {
          name,
          description,
          imageId,
          price,
          mrp,
          launchOfferPercent,
        })

        if (form.imageFile && current?.imageId) {
          await deleteProductImage(current.imageId).catch(() => null)
        }

        setFeedback('Product updated successfully.')
      } else {
        if (!imageId) {
          throw new Error('Image is required when adding a product.')
        }

        await addProduct({
          name,
          description,
          imageId,
          price,
          mrp,
          launchOfferPercent,
        })

        setFeedback('Product added successfully.')
      }

      setForm(emptyForm)
      setEditingId('')
      notifyProductsChanged()
      await loadProducts()
    } catch (submitError) {
      setError(submitError.message || 'Unable to save product.')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(product) {
    setEditingId(product.$id)
    setForm({
      name: product.name,
      description: product.description,
      price: String(toInteger(product.price, 0)),
      mrp: String(toInteger(product.mrp, 0)),
      launchOfferPercent: String(toInteger(product.launchOfferPercent, 0)),
      imageFile: null,
    })
    setFeedback('')
    setError('')
  }

  async function onDelete(product) {
    setError('')
    setFeedback('')

    try {
      await removeProduct(product.$id)
      await deleteProductImage(product.imageId).catch(() => null)
      setFeedback('Product deleted successfully.')
      notifyProductsChanged()
      await loadProducts()
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete product.')
    }
  }

  function resetForm() {
    setEditingId('')
    setForm(emptyForm)
    setFeedback('')
    setError('')
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-4xl text-bark-900">Admin Dashboard</h1>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-bark-500 px-4 py-2 text-sm font-semibold text-bark-700"
        >
          Logout
        </button>
      </div>

      <section className="rounded-2xl border border-beige-300 bg-cream-100 p-5 shadow-soft sm:p-6">
        <h2 className="font-serif text-2xl text-bark-900">
          {editingId ? 'Edit Product' : 'Add Product'}
        </h2>

        <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
          <label>
            <span className="mb-1 block text-sm text-bark-700">Name</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
              placeholder="Enter product name"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm text-bark-700">Description</span>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm text-bark-700">Current Price (integer)</span>
            <input
              type="number"
              required
              min={0}
              step={1}
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
              placeholder="e.g. 399"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm text-bark-700">MRP (integer)</span>
            <input
              type="number"
              required
              min={0}
              step={1}
              value={form.mrp}
              onChange={(event) => setForm((prev) => ({ ...prev, mrp: event.target.value }))}
              className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
              placeholder="e.g. 449"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm text-bark-700">Launch Offer % (integer)</span>
            <input
              type="number"
              required
              min={0}
              max={100}
              step={1}
              value={form.launchOfferPercent}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, launchOfferPercent: event.target.value }))
              }
              className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
              placeholder="e.g. 10"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm text-bark-700">
              Image {editingId ? '(optional for updates)' : '(required)'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setForm((prev) => ({ ...prev, imageFile: event.target.files?.[0] || null }))
              }
              className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-sm text-bark-900"
            />
          </label>

          {(error || feedback) && (
            <p className={`text-sm ${error ? 'text-red-700' : 'text-emerald-700'}`}>
              {error || feedback}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-bark-900 px-5 py-2 text-sm font-semibold text-cream-100 transition hover:bg-bark-800 disabled:cursor-not-allowed disabled:bg-bark-400"
            >
              {submitLabel}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-bark-500 px-5 py-2 text-sm font-semibold text-bark-700"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-beige-300 bg-cream-100 p-5 shadow-soft sm:p-6">
        <h2 className="font-serif text-2xl text-bark-900">Products</h2>

        {loading ? (
          <p className="mt-4 text-bark-700">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="mt-4 text-bark-700">No products found.</p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.$id}
                className="rounded-2xl border border-beige-300 bg-white p-4"
              >
                <h3 className="font-serif text-xl text-bark-900">{product.name}</h3>
                <p className="mt-2 text-sm text-bark-700">{product.description}</p>
                <p className="mt-2 text-sm text-bark-700">
                  Price: ₹{toInteger(product.price, 0)} | MRP: ₹{toInteger(product.mrp, 0)} | Offer:{' '}
                  {toInteger(product.launchOfferPercent, 0)}%
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => startEdit(product)}
                    className="rounded-full border border-bark-500 px-4 py-2 text-sm font-semibold text-bark-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    className="rounded-full bg-bark-900 px-4 py-2 text-sm font-semibold text-cream-100"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
