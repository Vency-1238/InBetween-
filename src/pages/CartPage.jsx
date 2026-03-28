import { useState } from 'react'
import { getProductLaunchPrice } from '../lib/constants'
import { useShop } from '../context/ShopContext'
import { createOrder } from '../services/orders'

const emptyCustomerForm = {
  fullName: '',
  address: '',
  contactNumber: '',
  city: '',
  state: '',
  pincode: '',
  orderNote: '',
}

export default function CartPage() {
  const { cartItems, updateCartItem, removeFromCart, clearCart, addToMyOrders } = useShop()
  const [customerForm, setCustomerForm] = useState(emptyCustomerForm)
  const [customerUpiId, setCustomerUpiId] = useState('')
  const [upiError, setUpiError] = useState('')
  const [paymentInitiated, setPaymentInitiated] = useState(false)
  const [paymentUtr, setPaymentUtr] = useState('')
  const [pendingOrderId, setPendingOrderId] = useState('')
  const [orderStatus, setOrderStatus] = useState('idle')
  const [orderId, setOrderId] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)

  const receiverUpiId = import.meta.env.VITE_UPI_RECEIVER_ID || 'vency1238@okaxis'
  const receiverUpiName = import.meta.env.VITE_UPI_RECEIVER_NAME || 'In Between'

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * getProductLaunchPrice(item),
    0,
  )

  function handleUpiPayment(event) {
    event.preventDefault()

    const fullName = customerForm.fullName.trim()
    const address = customerForm.address.trim()
    const contactNumber = customerForm.contactNumber.trim()
    const city = customerForm.city.trim()
    const state = customerForm.state.trim()
    const pincode = customerForm.pincode.trim()
    const trimmedCustomerUpiId = customerUpiId.trim()
    const isValidUpi = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test(trimmedCustomerUpiId)

    if (!fullName || !address || !contactNumber || !city || !state || !pincode) {
      setUpiError('Please fill full name, address, contact number, city, state, and pincode.')
      return
    }

    if (!/^\d{10,14}$/.test(contactNumber)) {
      setUpiError('Enter a valid contact number (10 to 14 digits).')
      return
    }

    if (!/^\d{6}$/.test(pincode)) {
      setUpiError('Enter a valid 6-digit pincode.')
      return
    }

    if (!isValidUpi) {
      setUpiError('Please enter your valid UPI ID (example: name@bank).')
      return
    }

    if (!receiverUpiId) {
      setUpiError('Payment receiver UPI ID is not configured. Please contact support.')
      return
    }

    if (total <= 0) {
      setUpiError('Cart total must be greater than zero to proceed.')
      return
    }

    setUpiError('')
    const generatedOrderId = `IB${Date.now().toString().slice(-8)}`
    const amount = total.toFixed(2)
    const note = `In Between Order ${generatedOrderId} | Payer ${trimmedCustomerUpiId}`
    const upiUrl = `upi://pay?pa=${encodeURIComponent(receiverUpiId)}&pn=${encodeURIComponent(
      receiverUpiName,
    )}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(note)}`

    setPendingOrderId(generatedOrderId)
    setPaymentInitiated(true)

    // Open a real UPI payment intent in installed UPI apps.
    window.location.href = upiUrl
  }

  async function handleConfirmPayment(event) {
    event.preventDefault()
    const trimmedUtr = paymentUtr.trim()

    if (!/^[a-zA-Z0-9]{8,40}$/.test(trimmedUtr)) {
      setUpiError('Enter a valid UTR/transaction reference (8-40 letters or numbers).')
      return
    }

    setPlacingOrder(true)
    setUpiError('')

    try {
      const savedOrder = await createOrder({
        orderCode: pendingOrderId,
        fullName: customerForm.fullName.trim(),
        address: customerForm.address.trim(),
        contactNumber: customerForm.contactNumber.trim(),
        city: customerForm.city.trim(),
        state: customerForm.state.trim(),
        pincode: customerForm.pincode.trim(),
        orderNote: customerForm.orderNote.trim(),
        customerUpiId: customerUpiId.trim(),
        paymentUtr: trimmedUtr,
        totalAmount: total,
        items: cartItems,
      })

      addToMyOrders(savedOrder)
      setOrderId(pendingOrderId)
      setOrderStatus('success')
      setPaymentInitiated(false)
      setPaymentUtr('')
      setCustomerUpiId('')
      setCustomerForm(emptyCustomerForm)
      clearCart()
    } catch (saveError) {
      setUpiError(saveError.message || 'Unable to save your order. Please try again.')
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-4xl text-bark-900">Cart</h1>

      {orderStatus === 'success' ? (
        <section className="mt-8 rounded-2xl border border-emerald-300 bg-emerald-50 p-6 shadow-soft">
          <h2 className="font-serif text-3xl text-emerald-900">Order Confirmed</h2>
          <p className="mt-3 text-emerald-800">
            Payment successful for Order ID <span className="font-semibold">{orderId}</span>.
          </p>
          <p className="mt-1 text-emerald-800">Your product is on the way.</p>
        </section>
      ) : cartItems.length === 0 ? (
        <p className="mt-6 text-bark-700">Your cart is empty.</p>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.$id}
                className="rounded-2xl border border-beige-300 bg-cream-100 p-4 shadow-soft"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-beige-300 bg-white">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-bark-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div>
                    <h2 className="font-serif text-2xl text-bark-900">{item.name}</h2>
                    <p className="text-sm text-bark-700">₹{getProductLaunchPrice(item)} each</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateCartItem(item.$id, item.quantity - 1)}
                      className="rounded-full border border-bark-400 px-3 py-1 text-bark-700"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-bark-900">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartItem(item.$id, item.quantity + 1)}
                      className="rounded-full border border-bark-400 px-3 py-1 text-bark-700"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.$id)}
                      className="rounded-full bg-bark-900 px-4 py-2 text-sm text-cream-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-beige-300 bg-cream-100 p-5 shadow-soft">
            <p className="text-lg text-bark-700">Total</p>
            <p className="mt-1 text-3xl font-bold text-bark-900">₹{total}</p>

            <form className="mt-5 space-y-3" onSubmit={handleUpiPayment}>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-bark-700">Full Name</span>
                <input
                  type="text"
                  value={customerForm.fullName}
                  onChange={(event) =>
                    setCustomerForm((prev) => ({ ...prev, fullName: event.target.value }))
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-sm text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-bark-700">Address</span>
                <textarea
                  rows={3}
                  value={customerForm.address}
                  onChange={(event) =>
                    setCustomerForm((prev) => ({ ...prev, address: event.target.value }))
                  }
                  placeholder="Enter full delivery address"
                  className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-sm text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-bark-700">Contact Number</span>
                <input
                  type="tel"
                  value={customerForm.contactNumber}
                  onChange={(event) =>
                    setCustomerForm((prev) => ({ ...prev, contactNumber: event.target.value }))
                  }
                  placeholder="Enter your contact number"
                  className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-sm text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-bark-700">City</span>
                  <input
                    type="text"
                    value={customerForm.city}
                    onChange={(event) =>
                      setCustomerForm((prev) => ({ ...prev, city: event.target.value }))
                    }
                    placeholder="Enter city"
                    className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-sm text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-bark-700">State</span>
                  <input
                    type="text"
                    value={customerForm.state}
                    onChange={(event) =>
                      setCustomerForm((prev) => ({ ...prev, state: event.target.value }))
                    }
                    placeholder="Enter state"
                    className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-sm text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium text-bark-700">Pincode</span>
                  <input
                    type="text"
                    value={customerForm.pincode}
                    onChange={(event) =>
                      setCustomerForm((prev) => ({ ...prev, pincode: event.target.value }))
                    }
                    placeholder="Enter 6-digit pincode"
                    className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-sm text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-bark-700">Order Note (optional)</span>
                <textarea
                  rows={2}
                  value={customerForm.orderNote}
                  onChange={(event) =>
                    setCustomerForm((prev) => ({ ...prev, orderNote: event.target.value }))
                  }
                  placeholder="Any delivery note"
                  className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-sm text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-bark-700">Your UPI ID</span>
                <input
                  type="text"
                  value={customerUpiId}
                  onChange={(event) => setCustomerUpiId(event.target.value)}
                  placeholder="Enter your UPI ID (example@bank)"
                  className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-sm text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
                />
              </label>

              {upiError && <p className="text-sm text-red-700">{upiError}</p>}

              <button
                type="submit"
                className="rounded-full bg-bark-900 px-5 py-2 text-sm font-semibold text-cream-100 transition hover:bg-bark-800 disabled:cursor-not-allowed disabled:bg-bark-500"
              >
                Proceed Payment
              </button>
            </form>

            {paymentInitiated && (
              <form className="mt-5 space-y-3 rounded-xl border border-beige-300 bg-white p-4" onSubmit={handleConfirmPayment}>
                <p className="text-sm text-bark-700">
                  UPI app opened for Order ID <span className="font-semibold">{pendingOrderId}</span>.
                  Complete the payment, then enter your UTR/transaction reference below.
                </p>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-bark-700">UTR / Transaction Reference</span>
                  <input
                    type="text"
                    value={paymentUtr}
                    onChange={(event) => setPaymentUtr(event.target.value)}
                    placeholder="Example: 1234567890ABC"
                    className="w-full rounded-xl border border-beige-400 bg-white px-3 py-2 text-sm text-bark-900 outline-none ring-bark-600 transition focus:ring-2"
                  />
                </label>
                <button
                  type="submit"
                  disabled={placingOrder}
                  className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  {placingOrder ? 'Saving order...' : 'Confirm Order'}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </main>
  )
}
