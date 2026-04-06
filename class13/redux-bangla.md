# Redux - বাংলা গাইড

## Redux কী?

Redux হলো একটি **state management library** যা JavaScript অ্যাপ্লিকেশনের সমস্ত ডেটা (state) একটি কেন্দ্রীয় জায়গায় সংরক্ষণ করে। React-এ সাধারণত প্রতিটি component-এর নিজস্ব state থাকে, কিন্তু যখন অনেক component-এর একই ডেটা দরকার হয়, তখন Redux ব্যবহার করা হয়।

সহজ কথায়: **পুরো অ্যাপের ডেটা একটি জায়গায় রাখো, যেকোনো component থেকে সেটা পড়ো বা পরিবর্তন করো।**

---

## Redux-এর মূল ধারণা

| ধারণা | অর্থ |
|---|---|
| **Store** | পুরো অ্যাপের state যেখানে থাকে |
| **State** | অ্যাপের বর্তমান ডেটা |
| **Action** | কী পরিবর্তন করতে হবে তার বিবরণ (একটি object) |
| **Reducer** | Action দেখে state কীভাবে পরিবর্তন হবে তা নির্ধারণ করে |
| **Dispatch** | Action পাঠানোর পদ্ধতি |
| **Selector** | Store থেকে নির্দিষ্ট ডেটা পড়ার পদ্ধতি |

### ডেটার প্রবাহ (Data Flow)

```
Component → dispatch(action) → Reducer → Store আপডেট → Component re-render
```

---

## Redux Toolkit দিয়ে ব্যবহারের ধাপসমূহ

### ধাপ ১: ইনস্টল করো

```bash
npm install @reduxjs/toolkit react-redux
```

### ধাপ ২: Slice তৈরি করো

Slice মানে state-এর একটি অংশ এবং সেই অংশের reducer ও actions একসাথে।

```js
// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload); // সরাসরি পরিবর্তন করা যায়
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
```

### ধাপ ৩: Store তৈরি করো

```js
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;
```

### ধাপ ৪: App-কে Provider দিয়ে wrap করো

```jsx
// src/main.jsx
import { Provider } from 'react-redux';
import store from './store';

<Provider store={store}>
  <App />
</Provider>
```

### ধাপ ৫: Component-এ ব্যবহার করো

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const MyComponent = () => {
  // Store থেকে ডেটা পড়া
  const items = useSelector((state) => state.cart.items);

  // Action dispatch করা
  const dispatch = useDispatch();
  const handleAdd = (product) => dispatch(addToCart(product));
};
```

### ধাপ ৬: Async কাজের জন্য createAsyncThunk

```js
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async () => {
    const data = await fetchProducts();
    return data; // এটি fulfilled action-এর payload হবে
  }
);
```

---

## এই প্রজেক্টে Redux কীভাবে ব্যবহার হয়েছে

### প্রজেক্টের Store কাঠামো

```
src/store/
├── index.js              ← মূল store
└── slices/
    ├── productsSlice.js  ← পণ্যের state
    └── cartSlice.js      ← কার্টের state
```

### Store (src/store/index.js)

```js
const store = configureStore({
  reducer: {
    products: productsReducer,  // state.products
    cart: cartReducer,          // state.cart
  },
});
```

দুটি slice আছে — `products` এবং `cart`।

---

### ১. Cart Slice (cartSlice.js)

**State:**
```js
{
  items: [],        // কার্টে থাকা পণ্যের তালিকা
  totalItems: 0,    // মোট পণ্যের সংখ্যা
  totalPrice: 0,    // মোট মূল্য
}
```

**Actions:**

| Action | কাজ |
|---|---|
| `addToCart(product)` | কার্টে পণ্য যোগ করে, আগে থেকে থাকলে quantity বাড়ায় |
| `removeFromCart(id)` | কার্ট থেকে পণ্য সরায় |
| `updateQuantity({id, quantity})` | পণ্যের পরিমাণ পরিবর্তন করে |
| `clearCart()` | পুরো কার্ট খালি করে |

**ব্যবহার:**
```jsx
// Cart.jsx বা Products.jsx-এ
const { items, totalItems, totalPrice } = useSelector((state) => state.cart);
dispatch(addToCart(product));
dispatch(removeFromCart(product.id));
dispatch(clearCart());
```

---

### ২. Products Slice (productsSlice.js)

**State:**
```js
{
  items: [],              // সব পণ্যের তালিকা
  selectedProduct: null,  // একটি নির্দিষ্ট পণ্যের বিস্তারিত
  loading: false,         // লোড হচ্ছে কিনা
  error: null,            // কোনো error আছে কিনা
}
```

**Async Actions (createAsyncThunk):**

`loadProducts` — API থেকে সব পণ্য আনে
```js
dispatch(loadProducts(50)); // 50টি পণ্য আনো
```

`loadProductById` — API থেকে একটি নির্দিষ্ট পণ্য আনে
```js
dispatch(loadProductById(id)); // id দিয়ে একটি পণ্য আনো
```

প্রতিটি async action স্বয়ংক্রিয়ভাবে তিনটি অবস্থা তৈরি করে:
- `pending` → loading: true
- `fulfilled` → ডেটা state-এ সংরক্ষিত হয়
- `rejected` → error state-এ সংরক্ষিত হয়

**ব্যবহার:**
```jsx
// Products.jsx-এ
const { items, loading, error } = useSelector((state) => state.products);
dispatch(loadProducts(50));

// ProductDetails.jsx-এ
const { selectedProduct, loading } = useSelector((state) => state.products);
dispatch(loadProductById(id));
```

---

### প্রজেক্টের সম্পূর্ণ ডেটা প্রবাহ

```
ব্যবহারকারী "Add to Cart" বাটনে ক্লিক করে
        ↓
dispatch(addToCart(product))
        ↓
cartSlice reducer চলে, state আপডেট হয়
        ↓
Navbar-এ cart count আপডেট হয়
Cart page-এ items আপডেট হয়
```

```
Products page লোড হয়
        ↓
dispatch(loadProducts(50))
        ↓
API call হয় → pending (loading: true)
        ↓
API সফল → fulfilled (items: [...পণ্যের তালিকা])
        ↓
Products page-এ পণ্য দেখায়
```
