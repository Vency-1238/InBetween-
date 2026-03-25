import { Account, Client, Databases, Storage } from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

export const databaseId = import.meta.env.VITE_DATABASE_ID
export const collectionId = import.meta.env.VITE_COLLECTION_ID
export const bucketId = import.meta.env.VITE_BUCKET_ID

export const hasAppwriteConfig =
  Boolean(endpoint) &&
  Boolean(projectId) &&
  Boolean(databaseId) &&
  Boolean(collectionId) &&
  Boolean(bucketId)

const client = new Client()

if (endpoint) {
  client.setEndpoint(endpoint)
}

if (projectId) {
  client.setProject(projectId)
}

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

export function assertAppwriteConfig() {
  if (hasAppwriteConfig) {
    return
  }

  throw new Error(
    'Appwrite environment variables are missing. Please configure VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, VITE_DATABASE_ID, VITE_COLLECTION_ID, and VITE_BUCKET_ID.',
  )
}
