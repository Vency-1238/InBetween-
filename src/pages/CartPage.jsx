import { useState } from 'react'
import { getProductLaunchPrice } from '../lib/constants'
import { useShop } from '../context/ShopContext'
import { createOrder } from '../services/orders'
import {
  createCashfreePaymentSession,
  launchCashfreeCheckout,
  verifyCashfreeOrder,
} from '../services/cashfree'

const emptyCustomerForm = {
  fullName: '',
  email: '',
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
  const [paymentError, setPaymentError] = useState('')
  const [pendingOrderId, setPendingOrderId] = useState('')
  const [orderStatus, setOrderStatus] = useState('idle')
  const [orderId, setOrderId] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * getProductLaunchPrice(item),
    0,
  )

  function validateCheckoutForm() {
    const fullName = customerForm.fullName.trim()
    const email = customerForm.email.trim()
    const address = customerForm.address.trim()
    const contactNumber = customerForm.contactNumber.trim()
    const city = customerForm.city.trim()
    const state = customerForm.state.trim()
    const pincode = customerForm.pincode.trim()

    if (!fullName || !email || !address || !contactNumber || !city || !state || !pincode) {
      return 'Please fill full name, email, address, contact number, city, state, and pincode.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Enter a valid email address.'
    }

    if (!/^\d{10,14}$/.test(contactNumber)) {
      return 'Enter a valid contact number (10 to 14 digits).'
    }

    if (!/^\d{6}$/.test(pincode)) {
      return 'Enter a valid 6-digit pincode.'
    }

    if (total <= 0) {
      return 'Cart total must be greater than zero to proceed.'
    }

    return ''
  }

  async function waitForPaidOrder(cashfreeOrderId) {
    let latest = null

    for (let attempt = 0; attempt < 6; attempt += 1) {
      latest = await verifyCashfreeOrder(cashfreeOrderId)

      if (latest.status === 'PAID') {
        return latest
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 2000)
      })
    }

    return latest
  }

  async function handleCashfreePayment(event) {
    event.preventDefault()
    const validationError = validateCheckoutForm()

    if (validationError) {
      setPaymentError(validationError)
      return
    }

    setPaymentError('')
    setPlacingOrder(true)
    const generatedOrderId = `IB${Date.now().toString().slice(-8)}`
    setPendingOrderId(generatedOrderId)

    try {
      const cashfreeSession = await createCashfreePaymentSession({
        orderCode: generatedOrderId,
        amount: total,
        customer: {
          name: customerForm.fullName.trim(),
          email: customerForm.email.trim(),
          phone: customerForm.contactNumber.trim(),
        },
      })

      const checkoutResult = await launchCashfreeCheckout(cashfreeSession.paymentSessionId)
      if (checkoutResult?.error) {
        throw new Error(checkoutResult.error.message || 'Cashfree checkout failed to start.')
      }

      const verifiedOrder = await waitForPaidOrder(cashfreeSession.orderId)
      if (!verifiedOrder || verifiedOrder.status !== 'PAID') {
        setPaymentError(
          'Payment is not confirmed yet. If amount was debited, wait a minute and try again.',
        )
        return
      }

      const savedOrder = await createOrder({
        orderCode: generatedOrderId,
        fullName: customerForm.fullName.trim(),
        address: customerForm.address.trim(),
        contactNumber: customerForm.contactNumber.trim(),
        city: customerForm.city.trim(),
        state: customerForm.state.trim(),
        pincode: customerForm.pincode.trim(),
        orderNote: customerForm.orderNote.trim(),
        customerUpiId: 'cashfree',
        paymentUtr: verifiedOrder.paymentId || verifiedOrder.orderId,
        totalAmount: total,
        items: cartItems,
      })

      addToMyOrders(savedOrder)
      setOrderId(generatedOrderId)
      setOrderStatus('success')
      setCustomerForm(emptyCustomerForm)
      clearCart()
    } catch (saveError) {
      setPaymentError(saveError.message || 'Unable to process payment. Please try again.')
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

            <form className="mt-5 space-y-3" onSubmit={handleCashfreePayment}>
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
                <span className="mb-1 block text-sm font-medium text-bark-700">Email</span>
                <input
                  type="email"
                  value={customerForm.email}
                  onChange={(event) =>
                    setCustomerForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="Enter your email"
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

              {paymentError && <p className="text-sm text-red-700">{paymentError}</p>}

              <p className="text-xs text-bark-600">
                Payments are processed securely via Cashfree test environment.
              </p>

              <button
                type="submit"
                disabled={placingOrder}
                className="rounded-full bg-bark-900 px-5 py-2 text-sm font-semibold text-cream-100 transition hover:bg-bark-800 disabled:cursor-not-allowed disabled:bg-bark-500"
              >
                {placingOrder ? 'Processing...' : 'Pay with Cashfree'}
              </button>
            </form>

            {pendingOrderId ? (
              <p className="mt-4 text-sm text-bark-700">
                Current checkout order ID: <span className="font-semibold">{pendingOrderId}</span>
              </p>
            ) : null}
          </div>
        </>
      )}
    </main>
  )
}
