import { ID, Query } from 'appwrite'
import { assertAppwriteConfig, databaseId, databases, ordersCollectionId } from '../lib/appwrite'
import { getProductLaunchPrice, toInteger } from '../lib/constants'

function assertOrdersCollectionConfig() {
  assertAppwriteConfig()

  if (ordersCollectionId) {
    return
  }

  throw new Error(
    'VITE_ORDERS_COLLECTION_ID is missing. Please configure an Appwrite orders collection ID.',
  )
}

function normalizeOrder(doc) {
  const parsedTotal = Number.parseFloat(doc?.totalAmount ?? 0)
  let items = []

  try {
    items = JSON.parse(doc?.itemsJson || '[]')
    if (!Array.isArray(items)) {
      items = []
    }
  } catch {
    items = []
  }

  return {
    ...doc,
    totalAmount: Number.isFinite(parsedTotal) ? parsedTotal : 0,
    itemCount: Math.max(0, toInteger(doc?.itemCount, 0)),
    items,
  }
}

function buildOrderItems(items) {
  return items.map((item) => ({
    productId: item?.$id || '',
    name: item?.name || 'Product',
    quantity: Math.max(1, toInteger(item?.quantity, 1)),
    unitPrice: Math.max(0, toInteger(getProductLaunchPrice(item), 0)),
  }))
}

export async function createOrder(orderInput) {
  assertOrdersCollectionConfig()

  const items = buildOrderItems(orderInput.items || [])
  const document = await databases.createDocument(databaseId, ordersCollectionId, ID.unique(), {
    orderCode: orderInput.orderCode,
    fullName: orderInput.fullName,
    address: orderInput.address,
    contactNumber: orderInput.contactNumber,
    city: orderInput.city,
    state: orderInput.state,
    orderNote: orderInput.orderNote || '',
    customerUpiId: orderInput.customerUpiId,
    paymentUtr: orderInput.paymentUtr,
    status: 'confirmed',
    totalAmount: Number(orderInput.totalAmount || 0).toFixed(2),
    itemCount: items.length,
    itemsJson: JSON.stringify(items),
  })

  return normalizeOrder(document)
}

export async function fetchAllOrders() {
  assertOrdersCollectionConfig()

  const response = await databases.listDocuments(databaseId, ordersCollectionId, [
    Query.orderDesc('$createdAt'),
  ])

  return response.documents.map((doc) => normalizeOrder(doc))
}
