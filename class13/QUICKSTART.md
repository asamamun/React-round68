# Quick Start Guide - Redux Shopping Cart

## 🚀 Running the Application

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open your browser** to: `http://localhost:5173`

3. **Click the preview button** in your IDE to view the app

## 📱 App Pages

### 1. Home Page (`/`)
- Welcome screen
- Introduction to Redux concepts
- Quick links to Products and Cart

### 2. Products Page (`/products`)
- Displays all products from API
- Shows loading state while fetching
- "Add to Cart" button on each product
- Click product to view details

### 3. Product Details (`/product/:id`)
- Full product information
- Large product image
- Detailed description
- Add to cart functionality
- Back to products button

### 4. Cart Page (`/cart`)
- View all cart items
- Update quantities (+/-)
- Remove items
- See total price
- Clear cart option

## 🔍 What to Observe

### Redux Flow in Action:

1. **Adding to Cart**:
   - Click "Add to Cart" button
   - Watch cart badge update in navbar
   - Navigate to cart to see item

2. **Updating Quantities**:
   - Use +/- buttons in cart
   - Notice automatic total recalculation
   - State updates instantly

3. **Fetching Products**:
   - Navigate to Products page
   - See loading state
   - Watch products appear
   - Error handling if API fails

## 🛠️ Using Redux DevTools

1. Install Redux DevTools extension for Chrome/Firefox
2. Open browser DevTools (F12)
3. Go to "Redux" tab
4. Observe:
   - All dispatched actions
   - State before/after each action
   - Action payload data
   - Time-travel debugging

## 📝 Code Exploration Order

For best learning, explore code in this order:

1. **Store Setup**: `src/store/index.js`
   - See how store is configured
   - Understand reducer combination

2. **Cart Slice**: `src/store/slices/cartSlice.js`
   - Simplest slice to understand
   - Synchronous actions only
   - Clear state updates

3. **Products Slice**: `src/store/slices/productsSlice.js`
   - Async operations with thunks
   - Loading/error states
   - API integration

4. **Components**: 
   - `src/pages/Products.jsx` - Dispatching async actions
   - `src/pages/Cart.jsx` - Reading state and dispatching
   - `src/components/Navbar.jsx` - Global state access

5. **API Service**: `src/services/api.js`
   - Axios configuration
   - API endpoint management

## 💡 Key Concepts to Focus On

### 1. useSelector Hook
```javascript
// Reading state from store
const { items, totalItems } = useSelector((state) => state.cart);
```

### 2. useDispatch Hook
```javascript
// Sending actions to store
const dispatch = useDispatch();
dispatch(addToCart(product));
```

### 3. Async Thunks
```javascript
// Fetching data from API
useEffect(() => {
  dispatch(loadProducts(50));
}, [dispatch]);
```

### 4. Immutability
```javascript
// Redux Toolkit allows "mutation" syntax
// but uses Immer for immutability
state.items.push(newItem); // Actually immutable!
```

## 🎯 Learning Exercises

### Exercise 1: Trace an Action
1. Open Redux DevTools
2. Add a product to cart
3. Find the `cart/addToCart` action
4. Examine the payload
5. Check state diff

### Exercise 2: Modify Cart Logic
1. Open `cartSlice.js`
2. Add a maximum quantity limit (e.g., 10)
3. Test in the app
4. Verify it works

### Exercise 3: Add Logging
1. In any component, add:
   ```javascript
   useEffect(() => {
     console.log('Cart state:', cartState);
   }, [cartState]);
   ```
2. Observe when it logs

### Exercise 4: Break Something
1. Comment out a dispatch
2. See what breaks
3. Fix it
4. Learn from the error

## 🐛 Common Issues & Solutions

### Issue: Products not loading
**Check**: 
- Backend API is running
- API URL is correct in `services/api.js`
- Network tab in DevTools for errors

### Issue: Cart not updating
**Check**:
- Action is being dispatched
- Reducer handles the action
- DevTools shows the action

### Issue: Component not re-rendering
**Check**:
- Using `useSelector` correctly
- State is actually changing
- Not mutating state directly

## 📚 Next Steps

After understanding the basics:

1. Read the full [redux.md](./redux.md) documentation
2. Try the exercises in redux.md
3. Add new features (wishlist, search, etc.)
4. Experiment with different patterns
5. Build your own Redux app

## 🆘 Getting Help

1. Check console for errors
2. Use Redux DevTools
3. Read the documentation
4. Review the code comments
5. Ask questions!

---

**Remember**: The best way to learn Redux is by doing. Don't just read the code - modify it, break it, fix it, and experiment!
