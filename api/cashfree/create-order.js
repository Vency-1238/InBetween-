/* global process */

const CASHFREE_BASE_URL = 'https://sandbox.cashfree.com/pg'
const CASHFREE_API_VERSION = '2023-08-01'

function sanitizeIdPart(value, fallback) {
  const normalized = String(value || '').replace(/[^a-zA-Z0-9_-]/g, '')
  return normalized || fallback
}

function parseBody(rawBody) {
  if (!rawBody) {
    return {}
  }

  if (typeof rawBody === 'string') {
    try {
      return JSON.parse(rawBody)
    } catch {
      return {}
    }
  }

  return rawBody
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' })
  }

  const appId = process.env.CASHFREE_APP_ID
  const secretKey = process.env.CASHFREE_SECRET_KEY

  if (!appId || !secretKey) {
    return res.status(500).json({
      message: 'Cashfree server keys are missing. Configure CASHFREE_APP_ID and CASHFREE_SECRET_KEY.',
    })
  }

  const body = parseBody(req.body)
  const amount = Number(body?.amount)
  const customerName = String(body?.customer?.name || '').trim()
  const customerEmail = String(body?.customer?.email || '').trim()
  const customerPhone = String(body?.customer?.phone || '').trim()

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: 'A valid amount is required.' })
  }

  if (!customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({
      message: 'Customer name, email, and phone are required for Cashfree checkout.',
    })
  }

  const orderCode = sanitizeIdPart(body?.orderCode, `IB${Date.now()}`)
  const orderId = `IB_${Date.now()}_${orderCode}`
  const customerId = `CUST_${Date.now()}_${sanitizeIdPart(customerPhone, 'GUEST')}`

  const cashfreePayload = {
    order_id: orderId,
    order_amount: Number(amount.toFixed(2)),
    order_currency: 'INR',
    customer_details: {
      customer_id: customerId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
    },
  }

  const response = await fetch(`${CASHFREE_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': appId,
      'x-client-secret': secretKey,
      'x-api-version': CASHFREE_API_VERSION,
    },
    body: JSON.stringify(cashfreePayload),
  })

  const responseBody = await response.json().catch(() => ({}))

  if (!response.ok) {
    return res.status(response.status).json({
      message: responseBody?.message || 'Unable to create Cashfree order.',
      details: responseBody,
    })
  }

  return res.status(200).json({
    orderId: responseBody.order_id,
    paymentSessionId: responseBody.payment_session_id,
  })
}
