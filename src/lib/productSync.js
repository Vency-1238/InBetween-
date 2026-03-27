const PRODUCTS_UPDATED_EVENT = 'products-updated'
const PRODUCTS_UPDATED_STORAGE_KEY = 'products-updated-at'

export function notifyProductsChanged() {
  const timestamp = Date.now().toString()

  window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT))
  localStorage.setItem(PRODUCTS_UPDATED_STORAGE_KEY, timestamp)
}

export function subscribeProductsChanged(onChange) {
  const onCustomEvent = () => onChange()
  const onStorageEvent = (event) => {
    if (event.key === PRODUCTS_UPDATED_STORAGE_KEY) {
      onChange()
    }
  }

  window.addEventListener(PRODUCTS_UPDATED_EVENT, onCustomEvent)
  window.addEventListener('storage', onStorageEvent)

  return () => {
    window.removeEventListener(PRODUCTS_UPDATED_EVENT, onCustomEvent)
    window.removeEventListener('storage', onStorageEvent)
  }
}
