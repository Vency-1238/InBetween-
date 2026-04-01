import { load } from '@cashfreepayments/cashfree-js'

let cashfreePromise

function getCashfreeMode() {
  return import.meta.env.VITE_CASHFREE_ENV === 'production' ? 'production' : 'sandbox'
}

async function getCashfreeInstance() {
  if (!cashfreePromise) {
    cashfreePromise = load({ mode: getCashfreeMode() })
  }

  return cashfreePromise
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options)
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload?.message || 'Payment request failed.')
  }

  return payload
}

export async function createCashfreePaymentSession(paymentInput) {
  return requestJson('/api/cashfree/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentInput),
  })
}

export async function verifyCashfreeOrder(orderId) {
  const query = new URLSearchParams({ orderId })
  return requestJson(`/api/cashfree/verify-order?${query.toString()}`)
}

export async function launchCashfreeCheckout(paymentSessionId) {
  const cashfree = await getCashfreeInstance()
  return cashfree.checkout({
    paymentSessionId,
    redirectTarget: '_modal',
  })
}
