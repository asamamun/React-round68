## `Products.jsx` এ প্রডাক্ট লোড হওয়ার প্রক্রিয়া (বাংলা ব্যাখ্যা)

এই ফাইলে আমরা দেখব, `Products.jsx` কম্পোনেন্ট কীভাবে প্রথমবার লোড হওয়ার সময়  
`https://dummyjson.com/products` API থেকে ডেটা এনে state-এ রাখে এবং UI-তে দেখায়।

---

### 1) শুরুতে state ডিফাইন করা হয়

```jsx
const [products, setProducts] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
```

- **`products`**: এখানে API থেকে পাওয়া প্রডাক্ট লিস্ট রাখা হয়।
- **`loading`**: true/false দিয়ে বোঝায় এখন ডেটা লোড হচ্ছে নাকি হয়ে গেছে।
- **`error`**: কোন সমস্যা হলে error message দেখানোর জন্য।

---

### 2) `useEffect` দিয়ে প্রথমবার render হলে API কল করা

```jsx
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
```

এই `useEffect`-এর কাজ:

- **`[]` dependency array** মানে:  
  কম্পোনেন্ট DOM-এ প্রথমবার mount হওয়ার সময় **একবারই** চলবে।
- ভিতরে আমরা `loadProducts()` নামে async ফাংশন বানিয়েছি, যেটা:
  - `loading` কে true করে
  - API থেকে ডেটা আনে
  - সফল হলে `setProducts(list)` দিয়ে প্রডাক্টগুলো state-এ সেট করে
  - সমস্যা হলে `setError(...)` দিয়ে error রাখে
  - সবশেষে `loading` কে false করে

#### `cancelled` ভ্যারিয়েবল কেন?

যদি কম্পোনেন্ট unmount হয়ে যায় (যেমন অন্য পেইজে চলে গেছো)  
তারপরও যদি API রেসপন্স আসে, তখন state আপডেট করলেই warning আসতে পারে।  
তাই cleanup ফাংশনে:

```jsx
return () => {
  cancelled = true
}
```

এভাবে আমরা নিশ্চিত হচ্ছি, unmount হওয়ার পর আর state আপডেট হবে না।

---

### 3) Loading, Error, Data – এই তিনটা অবস্থা হ্যান্ডেল করা

```jsx
{loading && <p className="text-muted">Loading products...</p>}
{!loading && error && <p className="text-danger">{error}</p>}
```

- যখন **`loading === true`**, তখন শুধু “Loading products…” লেখা দেখায়।
- লোড শেষ হয়ে গেলে যদি **error থাকে**, তাহলে লাল রঙে error মেসেজ দেখায়।

আর শেষে যদি:

```jsx
!loading && !error && products.length === 0
```

হয়ে থাকে, তাহলে “No products found.” মেসেজ দেখায়।

---

### 4) Bootstrap card image overlay দিয়ে প্রডাক্ট দেখানো

```jsx
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
```

- **`products.map(...)`** এর মাধ্যমে প্রতিটি প্রডাক্টের জন্য একেকটা card তৈরি হয়।
- `card-img` এর উপরে **`card-img-overlay`** ব্যবহার করা হয়েছে,  
  তাই overlay অংশটা ছবির উপরেই semi-transparent ব্যাকগ্রাউন্ডে ভেসে থাকে।
- এর ভেতরে:
  - টাইটেল (`p.title`)
  - ক্যাটেগরি + প্রাইস
  - description এর ছোট অংশ দেখানো হয়েছে।

---

### এক কথায় সারসংক্ষেপ

- `useEffect` + empty dependency (`[]`) ⇒ কম্পোনেন্ট প্রথমবার লোড হলে একবার API কল।
- `fetch('https://dummyjson.com/products')` ⇒ dummyjson থেকে প্রডাক্ট ডেটা আনা।
- `setProducts(...)` ⇒ সেই ডেটা `products` state-এ রাখা।
- `map` করে Bootstrap overlay card দিয়ে সুন্দরভাবে গ্রিড আকারে সব প্রডাক্ট দেখানো।

