import { ID, Query } from 'appwrite'
import {
  assertAppwriteConfig,
  bucketId,
  collectionId,
  databaseId,
  databases,
  storage,
} from '../lib/appwrite'
import { toInteger } from '../lib/constants'

function getImageUrl(imageId) {
  if (!imageId) {
    return ''
  }

  return storage.getFileView(bucketId, imageId).toString()
}

function normalizeProduct(doc) {
  return {
    ...doc,
    price: Math.max(0, toInteger(doc?.price, 0)),
    mrp: Math.max(0, toInteger(doc?.mrp, 0)),
    launchOfferPercent: Math.max(0, toInteger(doc?.launchOfferPercent, 0)),
    imageUrl: getImageUrl(doc.imageId),
  }
}

export async function fetchPauseCollectionProducts() {
  return fetchAllProducts()
}

export async function fetchAllProducts() {
  assertAppwriteConfig()

  const response = await databases.listDocuments(databaseId, collectionId, [
    Query.orderDesc('$createdAt'),
  ])

  return response.documents.map((doc) => normalizeProduct(doc))
}

export async function uploadProductImage(file) {
  assertAppwriteConfig()

  const uploaded = await storage.createFile(bucketId, ID.unique(), file)
  return uploaded.$id
}

export async function deleteProductImage(fileId) {
  if (!fileId) {
    return
  }

  assertAppwriteConfig()
  await storage.deleteFile(bucketId, fileId)
}

export async function addProduct({ name, description, imageId, price, mrp, launchOfferPercent }) {
  assertAppwriteConfig()

  return databases.createDocument(databaseId, collectionId, ID.unique(), {
    name,
    description,
    imageId,
    price,
    mrp,
    launchOfferPercent,
  })
}

export async function updateProduct(
  productId,
  { name, description, imageId, price, mrp, launchOfferPercent },
) {
  assertAppwriteConfig()

  return databases.updateDocument(databaseId, collectionId, productId, {
    name,
    description,
    imageId,
    price,
    mrp,
    launchOfferPercent,
  })
}

export async function removeProduct(productId) {
  assertAppwriteConfig()
  return databases.deleteDocument(databaseId, collectionId, productId)
}
