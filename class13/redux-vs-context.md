# Redux vs Context API

## What they are

**Context API** — built into React, designed for passing data through the component tree without prop drilling.

**Redux** — a standalone state management library. Works outside React, predictable state container with a strict unidirectional data flow.

---

## Setup

**Context API**
```jsx
// 1. Create context
const CartContext = createContext();

// 2. Create provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => setCart((prev) => [...prev, item]);

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Wrap app
<CartProvider>
  <App />
</CartProvider>

// 4. Consume
const { cart, addToCart } = useContext(CartContext);
```

**Redux Toolkit**
```js
// 1. Create slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => { state.items.push(action.payload); },
  },
});

// 2. Configure store
const store = configureStore({ reducer: { cart: cartSlice.reducer } });

// 3. Wrap app
<Provider store={store}><App /></Provider>

// 4. Consume
const items = useSelector((state) => state.cart.items);
const dispatch = useDispatch();
dispatch(addToCart(product));
```

---

## Re-renders

**Context API** — every component consuming the context re-renders when any value in the context changes, even if it only needs part of the data.

```jsx
// Both components re-render when either cart or user changes
const { cart, user } = useContext(AppContext);
```

**Redux** — components only re-render when the specific slice of state they select changes.

```js
// Only re-renders when cart.items changes
const items = useSelector((state) => state.cart.items);
```

---

## Async Operations

**Context API** — no built-in async support, you handle it manually
```jsx
const fetchProducts = async () => {
  setLoading(true);
  try {
    const data = await api.getProducts();
    setProducts(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**Redux Toolkit** — `createAsyncThunk` handles async with auto pending/fulfilled/rejected states
```js
const loadProducts = createAsyncThunk('products/load', () => api.getProducts());

// In slice extraReducers:
.addCase(loadProducts.pending, (state) => { state.loading = true; })
.addCase(loadProducts.fulfilled, (state, action) => { state.items = action.payload; })
.addCase(loadProducts.rejected, (state, action) => { state.error = action.payload; })
```

---

## DevTools

| | Context API | Redux |
|---|---|---|
| Time-travel debugging | ❌ | ✅ Redux DevTools |
| Action history | ❌ | ✅ |
| State snapshots | ❌ | ✅ |

---

## Comparison Table

| | Context API | Redux Toolkit |
|---|---|---|
| Built into React | ✅ | ❌ (separate install) |
| Boilerplate | Low | Medium |
| Re-render optimization | ❌ Poor | ✅ Selective |
| Async handling | Manual | Built-in |
| DevTools | ❌ | ✅ |
| Middleware support | ❌ | ✅ |
| Works outside React | ❌ | ✅ |
| Best for | Small/simple state | Large/complex state |

---

## When to use which

**Use Context API when:**
- Sharing simple, infrequently changing data (theme, locale, auth user)
- Small app with minimal state logic
- You want zero extra dependencies

**Use Redux when:**
- Multiple components need the same frequently-updating state (cart, products)
- You have complex async flows
- You need DevTools for debugging
- State logic is complex enough to benefit from reducers and actions
