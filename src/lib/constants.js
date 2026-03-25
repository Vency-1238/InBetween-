export function toInteger(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export function getProductLaunchPrice(product) {
  const mrp = Math.max(0, toInteger(product?.mrp, 0))
  const price = Math.max(0, toInteger(product?.price, 0))
  const offerPercent = clamp(toInteger(product?.launchOfferPercent, 0), 0, 100)

  if (price > 0) {
    return price
  }

  if (mrp <= 0) {
    return 0
  }

  if (offerPercent === 0) {
    return mrp
  }

  return Math.round(mrp * (1 - offerPercent / 100))
}

export function getProductOfferPercent(product) {
  const explicitOffer = clamp(toInteger(product?.launchOfferPercent, 0), 0, 100)
  if (explicitOffer > 0) {
    return explicitOffer
  }

  const mrp = Math.max(0, toInteger(product?.mrp, 0))
  const launchPrice = getProductLaunchPrice(product)

  if (mrp <= 0 || launchPrice >= mrp) {
    return 0
  }

  return Math.round(((mrp - launchPrice) / mrp) * 100)
}

export function getProductLaunchBadgeText(product) {
  const offerPercent = getProductOfferPercent(product)
  return offerPercent > 0 ? `Launch Offer - ${offerPercent}% OFF` : ''
}
