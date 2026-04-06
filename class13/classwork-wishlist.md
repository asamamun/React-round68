# Classwork: Wishlist Feature with Redux

এই classwork-এ তুমি Redux-এ একটি নতুন wishlist state যোগ করবে। ধাপগুলো অনুসরণ করো।

---

## যা যা করতে হবে

1. `wishlistSlice.js` তৈরি করো
2. Store-এ wishlist reducer যোগ করো
3. `Wishlist.jsx` page তৈরি করো
4. `App.jsx`-এ route যোগ করো
5. `Navbar.jsx`-এ Wishlist link যোগ করো
6. `Products.jsx`-এ "Add to Wishlist" বাটন যোগ করো

---

## ধাপ ১: wishlistSlice.js তৈরি করো

`src/store/slices/` ফোল্ডারে `wishlistSlice.js` নামে নতুন ফাইল তৈরি করো।

```js
// src/store/slices/wishlistSlice.js
import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(item => item.id === product.id);
      if (!exists) {
        state.items.push(product);
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
```

> `addToWishlist` — পণ্য wishlist-এ যোগ করে, কিন্তু একই পণ্য দুইবার যোগ হবে না।
> `removeFromWishlist` — পণ্যের id দিয়ে wishlist থেকে সরায়।

---

## ধাপ ২: Store-এ wishlist যোগ করো

`src/store/index.js` ফাইল খোলো এবং wishlist reducer import করে যোগ করো।

```js
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice'; // নতুন লাইন

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer, // নতুন লাইন
  },
});

export default store;
```

এখন `state.wishlist.items` দিয়ে যেকোনো component থেকে wishlist পড়া যাবে।

---

## ধাপ ৩: Wishlist Page তৈরি করো

`src/pages/` ফোল্ডারে `Wishlist.jsx` নামে নতুন ফাইল তৈরি করো।

```jsx
// src/pages/Wishlist.jsx
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  if (items.length === 0) {
    return (
      <div style={styles.empty}>
        <p>তোমার wishlist খালি।</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Wishlist ({items.length})</h1>
      <div style={styles.grid}>
        {items.map((product) => (
          <div key={product.id} style={styles.card}>
            <img src={product.image} alt={product.name} style={styles.image} />
            <div style={styles.info}>
              <h3>{product.name}</h3>
              <p style={styles.price}>${parseFloat(product.price).toFixed(2)}</p>
            </div>
            <div style={styles.actions}>
              <button
                onClick={() => dispatch(addToCart(product))}
                style={styles.cartButton}
              >
                Add to Cart
              </button>
              <button
                onClick={() => dispatch(removeFromWishlist(product.id))}
                style={styles.removeButton}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  title: { fontSize: '2rem', marginBottom: '2rem', color: '#2c3e50' },
  empty: { textAlign: 'center', padding: '4rem', fontSize: '1.25rem', color: '#7f8c8d' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' },
  image: { width: '100%', height: '200px', objectFit: 'cover' },
  info: { padding: '1rem' },
  price: { color: '#27ae60', fontWeight: 'bold', fontSize: '1.25rem' },
  actions: { display: 'flex', gap: '0.5rem', padding: '1rem' },
  cartButton: { flex: 1, padding: '0.75rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  removeButton: { flex: 1, padding: '0.75rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
};

export default Wishlist;
```

---

## ধাপ ৪: App.jsx-এ Route যোগ করো

`src/App.jsx` ফাইল খোলো। `Wishlist` import করো এবং নতুন route যোগ করো।

```jsx
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist'; // নতুন লাইন
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} /> {/* নতুন লাইন */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

---

## ধাপ ৫: Navbar-এ Wishlist Link যোগ করো

`src/components/Navbar.jsx` ফাইল খোলো।

**প্রথমে** wishlist items count পড়ার জন্য selector যোগ করো:

```jsx
// এই লাইনটি আছে:
const { totalItems } = useSelector((state) => state.cart);

// এর নিচে এই লাইনটি যোগ করো:
const { items: wishlistItems } = useSelector((state) => state.wishlist);
```

**তারপর** Cart link-এর পরে Wishlist link যোগ করো:

```jsx
<Link to="/cart" style={styles.link}>
  Cart
  {totalItems > 0 && (
    <span style={styles.badge}>{totalItems}</span>
  )}
</Link>

{/* এই নতুন block যোগ করো */}
<Link to="/wishlist" style={styles.link}>
  Wishlist
  {wishlistItems.length > 0 && (
    <span style={styles.badge}>{wishlistItems.length}</span>
  )}
</Link>
```

---

## ধাপ ৬: Products.jsx-এ "Add to Wishlist" বাটন যোগ করো

`src/pages/Products.jsx` ফাইল খোলো।

**প্রথমে** import যোগ করো ফাইলের উপরে:

```jsx
// এই লাইনটি আছে:
import { addToCart } from '../store/slices/cartSlice';

// এর নিচে যোগ করো:
import { addToWishlist } from '../store/slices/wishlistSlice';
```

**তারপর** wishlist items পড়ার জন্য selector যোগ করো component-এর ভেতরে:

```jsx
// এই লাইনটি আছে:
const { items: products, loading, error } = useSelector((state) => state.products);

// এর নিচে যোগ করো:
const { items: wishlistItems } = useSelector((state) => state.wishlist);
```

**তারপর** "Add to Cart" বাটনের পরে নতুন বাটন যোগ করো:

```jsx
<button
  onClick={() => handleAddToCart({...product, id: productId, name: productName, price})}
  style={styles.addButton}
>
  Add to Cart
</button>

{/* এই নতুন বাটন যোগ করো */}
<button
  onClick={() => dispatch(addToWishlist({...product, id: productId, name: productName, price}))}
  style={{
    ...styles.addButton,
    backgroundColor: wishlistItems.find(i => i.id === productId) ? '#95a5a6' : '#e67e22',
  }}
>
  {wishlistItems.find(i => i.id === productId) ? '♥ Wishlisted' : '♡ Wishlist'}
</button>
```

> বাটনের রং পরিবর্তন হবে — পণ্য wishlist-এ থাকলে ধূসর রং এবং "♥ Wishlisted" দেখাবে।

---

## সব ধাপ শেষে ফাইল কাঠামো

```
src/
├── store/
│   ├── index.js               ← wishlistReducer যোগ হয়েছে
│   └── slices/
│       ├── cartSlice.js       ← অপরিবর্তিত
│       ├── productsSlice.js   ← অপরিবর্তিত
│       └── wishlistSlice.js   ← নতুন ফাইল ✅
├── pages/
│   ├── Wishlist.jsx           ← নতুন ফাইল ✅
│   └── Products.jsx           ← বাটন যোগ হয়েছে
├── components/
│   └── Navbar.jsx             ← link যোগ হয়েছে
└── App.jsx                    ← route যোগ হয়েছে
```

---

## যাচাই করো

- `/products` পেজে গিয়ে "Wishlist" বাটনে ক্লিক করো → বাটনের রং পরিবর্তন হবে
- Navbar-এ Wishlist-এ badge দেখাবে
- `/wishlist` পেজে গেলে wishlist-এর পণ্য দেখাবে
- "Remove" বাটনে ক্লিক করলে wishlist থেকে সরে যাবে
- "Add to Cart" বাটনে ক্লিক করলে cart-এ যোগ হবে
