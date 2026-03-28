import { useEffect, useState } from 'react'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      try {
        setLoading(true)
        setError('')

        const res = await fetch('https://dummyjson.com/products')
        if (!res.ok) throw new Error(`Request failed (${res.status})`)

        const data = await res.json()
        const list = Array.isArray(data?.products) ? data.products : []

        if (!cancelled) setProducts(list)
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load products')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProducts()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="container py-4">
      <h1 className="mb-3">Our Products</h1>

      {loading && <p className="text-muted">Loading products...</p>}
      {!loading && error && <p className="text-danger">{error}</p>}

      <div className="row g-4">
        {products.map((p) => (
          <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
            <div className="card text-bg-dark border-0 shadow-sm h-100 overflow-hidden">
              <img
                src={p.thumbnail}
                className="card-img"
                alt={p.title}
                style={{ height: 240, objectFit: 'cover' }}
                loading="lazy"
              />
              <div className="card-img-overlay d-flex flex-column justify-content-end p-3">
                <div
                  className="rounded-3 p-3"
                  style={{ background: 'rgba(0,0,0,0.55)' }}
                >
                  <h5 className="card-title mb-1">{p.title}</h5>
                  <p className="card-text mb-2 small text-white-50">
                    {p.category} • ${p.price}
                  </p>
                  <p className="card-text mb-0 small">
                    {(p.description || '').slice(0, 90)}
                    {(p.description || '').length > 90 ? '...' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && products.length === 0 && (
        <p className="text-muted mt-3">No products found.</p>
      )}
    </div>
  )
}

export default Products
