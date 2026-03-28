import { useShop } from '../context/ShopContext'

function formatOrderDate(value) {
  if (!value) {
    return 'Just now'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Just now' : date.toLocaleString()
}

export default function MyOrdersPage() {
  const { myOrders } = useShop()

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-4xl text-bark-900">My Orders</h1>

      {myOrders.length === 0 ? (
        <p className="mt-6 text-bark-700">No orders yet. Place an order from your cart to see it here.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {myOrders.map((order) => (
            <article
              key={order.$id || order.orderCode}
              className="rounded-2xl border border-beige-300 bg-cream-100 p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl text-bark-900">Order {order.orderCode}</h2>
                  <p className="mt-1 text-sm text-bark-700">Placed: {formatOrderDate(order.$createdAt)}</p>
                </div>
                <p className="text-lg font-semibold text-bark-900">Rs. {order.totalAmount?.toFixed?.(2) || order.totalAmount}</p>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-bark-700 sm:grid-cols-2">
                <p>
                  <span className="font-semibold text-bark-900">Name:</span> {order.fullName}
                </p>
                <p>
                  <span className="font-semibold text-bark-900">Contact:</span> {order.contactNumber}
                </p>
                <p className="sm:col-span-2">
                  <span className="font-semibold text-bark-900">Address:</span> {order.address}, {order.city}, {order.state}
                </p>
                {order.orderNote ? (
                  <p className="sm:col-span-2">
                    <span className="font-semibold text-bark-900">Order Note:</span> {order.orderNote}
                  </p>
                ) : null}
              </div>

              <div className="mt-4 rounded-xl border border-beige-300 bg-white p-3">
                <h3 className="font-semibold text-bark-900">Items</h3>
                <ul className="mt-2 space-y-1 text-sm text-bark-700">
                  {(order.items || []).map((item, index) => (
                    <li key={`${order.orderCode}-${item.productId || index}`}>
                      {item.name} x {item.quantity} (Rs. {item.unitPrice} each)
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
