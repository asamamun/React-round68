# Classwork: Product Cart Management with useReducer

## 📝 Assignment Overview

তুমি একটি ই-কমার্স অ্যাপ্লিকেশনের জন্য **Product Cart System** তৈরি করবে। এটিতে ৫টি sample product থাকবে এবং useReducer ব্যবহার করে cart manage করতে হবে।

### শেখার উদ্দেশ্য:
- ✅ useReducer Hook সঠিকভাবে ব্যবহার করা
- ✅ Complex state management করা
- ✅ Multiple actions handle করা
- ✅ Cart operations (add, remove, update quantity) implement করা

---

## ⏰ সময়: ৩০ মিনিট

---

## 📋 ধাপ ১: প্রজেক্ট সেটআপ (৫ মিনিট)

তোমার `src` ফোল্ডারে একটি নতুন ফাইল তৈরি করো: `CartApp.jsx`

নিচের কোডটি কপি করে পেস্ট করো:

```javascript
import React, { useReducer, useState } from 'react';

// TODO: Step 2 - Initial State এখানে লিখবে

// TODO: Step 3 - Reducer Function এখানে লিখবে

const CartApp = () => {
  // TODO: Step 4 - useReducer Setup
  
  return (
    <div>
      <h1>🛒 Shopping Cart</h1>
      
      {/* TODO: Step 5 - Products Display */}
      
      {/* TODO: Step 6 - Cart Display */}
    </div>
  );
};

export default CartApp;
```

---

## 📋 ধাপ ২: Initial State তৈরি (৫ মিনিট)

নিচের কোডটি `// TODO: Step 2` এর জায়গায় বসাও:

```javascript
// ৫টি Sample Products
const products = [
  { id: 1, name: "Laptop", price: 85000 },
  { id: 2, name: "Smartphone", price: 25000 },
  { id: 3, name: "Headphones", price: 3500 },
  { id: 4, name: "Keyboard", price: 1200 },
  { id: 5, name: "Mouse", price: 800 }
];

// Initial State
const initialState = {
  cart: [],           // শুরুতে cart খালি
  products: products, // সব products available
  totalItems: 0,      // মোট items count
  totalPrice: 0       // মোট price
};
```

**ব্যাখ্যা:**
- `cart`: array যেখানে added items থাকবে
- `products`: সব products এর list
- `totalItems`: cart এ কয়টি item আছে
- `totalPrice`: মোট কত টাকা হয়েছে

---

## 📋 ধাপ ৩: Reducer Function লেখা (১০ মিনিট)

নিচের কোডটি `// TODO: Step 3` এর জায়গায় বসাও:

```javascript
const reducer = (state, action) => {
  switch (action.type) {
    
    // Case 1: Cart এ নতুন product যোগ করা
    case "ADD_TO_CART":
      const existingProduct = state.cart.find(item => item.id === action.payload.id);
      
      if (existingProduct) {
        // যদি আগে থেকেই থাকে, তাহলে quantity বাড়াও
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        };
      } else {
        // নতুন product হলে, quantity 1 দিয়ে add করো
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }],
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        };
      }
    
    // Case 2: Cart থেকে product remove করা
    case "REMOVE_FROM_CART":
      const removedItem = state.cart.find(item => item.id === action.payload.id);
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id),
        totalItems: state.totalItems - (removedItem ? removedItem.quantity : 0),
        totalPrice: state.totalPrice - (removedItem ? removedItem.quantity * removedItem.price : 0)
      };
    
    // Case 3: Product এর quantity বাড়ানো
    case "INCREASE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + action.payload.price
      };
    
    // Case 4: Product এর quantity কমানো
    case "DECREASE_QUANTITY":
      if (action.payload.quantity === 1) {
        // quantity 1 হলে পুরো item remove হয়ে যাবে
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== action.payload.id),
          totalItems: state.totalItems - 1,
          totalPrice: state.totalPrice - action.payload.price
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
        totalItems: state.totalItems - 1,
        totalPrice: state.totalPrice - action.payload.price
      };
    
    // Case 5: পুরো cart clear করা
    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
        totalItems: 0,
        totalPrice: 0
      };
    
    default:
      return state;
  }
};
```

**ব্যাখ্যা:**
- **ADD_TO_CART**: নতুন item add করে অথবা existing item এর quantity বাড়ায়
- **REMOVE_FROM_CART**: cart থেকে পুরো item remove করে
- **INCREASE_QUANTITY**: item এর quantity +1 করে
- **DECREASE_QUANTITY**: item এর quantity -1 করে (0 হলে remove করে দেয়)
- **CLEAR_CART**: পুরো cart খালি করে দেয়

---

## 📋 ধাপ ৪: Component এ useReducer Setup (৫ মিনিট)

নিচের কোডটি `// TODO: Step 4` এর জায়গায় বসাও:

```javascript
const CartApp = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cart, products, totalItems, totalPrice } = state;
  
  // Action Creator Functions
  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };
  
  const removeFromCart = (product) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: product });
  };
  
  const increaseQuantity = (product) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: product });
  };
  
  const decreaseQuantity = (product) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: product });
  };
  
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };
  
  // Price format helper
  const formatPrice = (price) => {
    return `৳${price.toLocaleString()}`;
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🛒 Shopping Cart</h1>
      
      {/* Cart Summary */}
      <div style={{ 
        background: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>Cart Summary</h2>
        <p><strong>Total Items:</strong> {totalItems}</p>
        <p><strong>Total Price:</strong> {formatPrice(totalPrice)}</p>
        {cart.length > 0 && (
          <button 
            onClick={clearCart}
            style={{
              background: '#ff4444',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Clear Cart
          </button>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Products List */}
        <div style={{ flex: 1 }}>
          <h2>Products ({products.length})</h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {products.map(product => (
              <div 
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '8px',
                  background: 'white'
                }}
              >
                <h3>{product.name}</h3>
                <p>Price: {formatPrice(product.price)}</p>
                <button
                  onClick={() => addToCart(product)}
                  style={{
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cart Items */}
        <div style={{ flex: 1 }}>
          <h2>Cart Items ({cart.length})</h2>
          {cart.length === 0 ? (
            <p style={{ color: '#999' }}>Your cart is empty!</p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {cart.map(item => (
                <div
                  key={item.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '15px',
                    borderRadius: '8px',
                    background: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h3>{item.name}</h3>
                    <p>Price: {formatPrice(item.price)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p><strong>Subtotal: {formatPrice(item.price * item.quantity)}</strong></p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <button
                      onClick={() => increaseQuantity(item)}
                      style={{
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => decreaseQuantity(item)}
                      style={{
                        background: '#ff9800',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      -
                    </button>
                    <button
                      onClick={() => removeFromCart(item)}
                      style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## 📋 ধাপ ৫: App.jsx এ CartApp যুক্ত করা

তোমার মূল `App.jsx` ফাইলে গিয়ে নিচের কোডটি যুক্ত করো:

```javascript
// উপরে import করো
import CartApp from './CartApp';

// এবং App component এর ভিতরে render করো
function App() {
  return (
    <div className="App">
      <CartApp />
    </div>
  );
}
```

অথবা, পুরো `App.jsx` মুছে নতুন করে লিখতে চাইলে:

```javascript
import CartApp from './CartApp';

function App() {
  return <CartApp />;
}

export default App;
```

---

## 🎯 সম্পূর্ণ কোড (একসাথে দেখার জন্য)

পুরো কোডটি একসাথে এখানে দেওয়া হলো যাতে তোমার সুবিধা হয়:

```javascript
import React, { useReducer, useState } from 'react';

// ৫টি Sample Products
const products = [
  { id: 1, name: "Laptop", price: 85000 },
  { id: 2, name: "Smartphone", price: 25000 },
  { id: 3, name: "Headphones", price: 3500 },
  { id: 4, name: "Keyboard", price: 1200 },
  { id: 5, name: "Mouse", price: 800 }
];

// Initial State
const initialState = {
  cart: [],
  products: products,
  totalItems: 0,
  totalPrice: 0
};

// Reducer Function
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingProduct = state.cart.find(item => item.id === action.payload.id);
      
      if (existingProduct) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }],
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        };
      }
    
    case "REMOVE_FROM_CART":
      const removedItem = state.cart.find(item => item.id === action.payload.id);
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id),
        totalItems: state.totalItems - (removedItem ? removedItem.quantity : 0),
        totalPrice: state.totalPrice - (removedItem ? removedItem.quantity * removedItem.price : 0)
      };
    
    case "INCREASE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + action.payload.price
      };
    
    case "DECREASE_QUANTITY":
      if (action.payload.quantity === 1) {
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== action.payload.id),
          totalItems: state.totalItems - 1,
          totalPrice: state.totalPrice - action.payload.price
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
        totalItems: state.totalItems - 1,
        totalPrice: state.totalPrice - action.payload.price
      };
    
    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
        totalItems: 0,
        totalPrice: 0
      };
    
    default:
      return state;
  }
};

const CartApp = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cart, products, totalItems, totalPrice } = state;
  
  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };
  
  const removeFromCart = (product) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: product });
  };
  
  const increaseQuantity = (product) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: product });
  };
  
  const decreaseQuantity = (product) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: product });
  };
  
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };
  
  const formatPrice = (price) => {
    return `৳${price.toLocaleString()}`;
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🛒 Shopping Cart</h1>
      
      <div style={{ 
        background: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>Cart Summary</h2>
        <p><strong>Total Items:</strong> {totalItems}</p>
        <p><strong>Total Price:</strong> {formatPrice(totalPrice)}</p>
        {cart.length > 0 && (
          <button 
            onClick={clearCart}
            style={{
              background: '#ff4444',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Clear Cart
          </button>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Products ({products.length})</h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {products.map(product => (
              <div 
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '8px',
                  background: 'white'
                }}
              >
                <h3>{product.name}</h3>
                <p>Price: {formatPrice(product.price)}</p>
                <button
                  onClick={() => addToCart(product)}
                  style={{
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
          <h2>Cart Items ({cart.length})</h2>
          {cart.length === 0 ? (
            <p style={{ color: '#999' }}>Your cart is empty!</p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {cart.map(item => (
                <div
                  key={item.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '15px',
                    borderRadius: '8px',
                    background: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h3>{item.name}</h3>
                    <p>Price: {formatPrice(item.price)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p><strong>Subtotal: {formatPrice(item.price * item.quantity)}</strong></p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <button
                      onClick={() => increaseQuantity(item)}
                      style={{
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => decreaseQuantity(item)}
                      style={{
                        background: '#ff9800',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      -
                    </button>
                    <button
                      onClick={() => removeFromCart(item)}
                      style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartApp;
```

---

## 🎯 Bonus Challenges (অতিরিক্ত অনুশীলন)

নিচের কাজগুলো করার চেষ্টা করো:

### Challenge ১: Discount Coupon
একটি নতুন action তৈরি করো যা cart এ discount apply করে:
```javascript
case "APPLY_DISCOUNT":
  // 10% discount দিন
```

### Challenge ২: Save to LocalStorage
cart state টি localStorage এ save করো যাতে page refresh করলেও cart খালি না হয়:
```javascript
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(state.cart));
}, [state.cart]);
```

### Challenge ৩: Stock Limit
প্রতিটি product এর জন্য সর্বোচ্চ ৫টি পর্যন্ত cart এ নেওয়া যাবে:
```javascript
// ADD_TO_CART এ check করো quantity > 5 কিনা
```

### Challenge ৪: Search Feature
products list এ search box যুক্ত করো:
```javascript
const [searchTerm, setSearchTerm] = useState("");
const filteredProducts = products.filter(p => 
  p.name.toLowerCase().includes(searchTerm.toLowerCase())
);
```

---

## ✅ জমা দেওয়ার নির্দেশাবলী

তোমার কাজ সম্পন্ন হলে:

1. ✅ পুরো কোডটি কাজ করছে কিনা check করো
2. ✅ সব buttons ঠিকমতো click হচ্ছে কিনা দেখো
3. ✅ Total items এবং total price সঠিকভাবে update হচ্ছে কিনা verify করো
4. ✅ Code টি GitHub এ commit করো
5. ✅ Teacher কে জানাও

---

## 💡 Tips

- ❗ কোড বুঝে বুঝে লিখো, শুধু copy-paste করো না
- 🤔 প্রতিটি action কিভাবে কাজ করে তা চিন্তা করো
- 🧪 নিজে নিজে different scenarios test করো
- 📝 কোনো প্রশ্ন থাকলে teacher কে জিজ্ঞাসা করো

---

**Happy Coding! 🚀**
