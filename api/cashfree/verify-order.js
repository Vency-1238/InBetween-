/* global process */

const CASHFREE_BASE_URL = 'https://sandbox.cashfree.com/pg'
const CASHFREE_API_VERSION = '2023-08-01'

async function getJson(url, headers) {
  const response = await fetch(url, { headers })
  const body = await response.json().catch(() => ({}))
  return { response, body }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed.' })
  }

  const appId = process.env.CASHFREE_APP_ID
  const secretKey = process.env.CASHFREE_SECRET_KEY

  if (!appId || !secretKey) {
    return res.status(500).json({
      message: 'Cashfree server keys are missing. Configure CASHFREE_APP_ID and CASHFREE_SECRET_KEY.',
    })
  }

  const orderId = String(req.query?.orderId || '').trim()
  if (!orderId) {
    return res.status(400).json({ message: 'orderId query parameter is required.' })
  }

  const headers = {
    'x-client-id': appId,
    'x-client-secret': secretKey,
    'x-api-version': CASHFREE_API_VERSION,
  }

  const { response: orderResponse, body: orderBody } = await getJson(
    `${CASHFREE_BASE_URL}/orders/${encodeURIComponent(orderId)}`,
    headers,
  )

  if (!orderResponse.ok) {
    return res.status(orderResponse.status).json({
      message: orderBody?.message || 'Unable to verify Cashfree order.',
      details: orderBody,
    })
  }

  let paymentId = ''

  if (orderBody?.order_status === 'PAID') {
    const { response: paymentsResponse, body: paymentsBody } = await getJson(
      `${CASHFREE_BASE_URL}/orders/${encodeURIComponent(orderId)}/payments`,
      headers,
    )

    if (paymentsResponse.ok && Array.isArray(paymentsBody)) {
      const paidAttempt = paymentsBody.find((attempt) => attempt?.payment_status === 'SUCCESS')
      paymentId = String(paidAttempt?.cf_payment_id || '')
    }
  }

  return res.status(200).json({
    orderId: orderBody.order_id,
    status: orderBody.order_status,
    paymentId,
  })
}
