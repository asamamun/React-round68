# React Router (App.jsx) — বাংলা ব্যাখ্যা

এই প্রোজেক্টে `App.jsx`-এ আমরা **React Router** ব্যবহার করে ৪টা পেজ বানিয়েছি:

- Home (`/`)
- About Us (`/about`)
- Products (`/products`)
- Contact Us (`/contact`)

## `App.jsx`-এ Routing কীভাবে কাজ করে

`App.jsx`-এ মূলত ৩টা জিনিস একসাথে কাজ করে:

- **`<Router>` (BrowserRouter)**: পুরো অ্যাপকে router-context দেয় এবং URL পরিবর্তন মনিটর করে।
- **`<Link>`**: পেজ রিলোড ছাড়াই URL পরিবর্তন করে (SPA navigation)।
- **`<Routes>` + `<Route>`**: বর্তমান URL কোন `path`-এর সাথে ম্যাচ করছে সেটা দেখে সেই পেজ component render করে।

### 1) `<Router>` কেন দরকার?

`<Router>` হচ্ছে সব routing-এর “গেটওয়ে”। এটা না থাকলে:

- `Link` কাজ করবে না
- `Routes/Route` URL বুঝতে পারবে না

তাই আমরা `App.jsx`-এ সবকিছুকে `Router` দিয়ে wrap করেছি।

### 2) `Link` ক্লিক করলে আসলে কী হয়?

যখন তুমি ক্লিক করো:

- `<Link to="/about">About Us</Link>`

তখন browser-এর address bar-এ URL হয় `/about`, কিন্তু **পুরো পেজ reload হয় না**।

React Router internally:

- History API ব্যবহার করে URL আপডেট করে
- Router-context এ “location changed” সিগন্যাল দেয়

### 3) `<Routes>` এবং `<Route>` কী করে?

`<Routes>` বর্তমান URL দেখে এর ভেতরের `Route`-গুলোর সাথে ম্যাচ করে।

উদাহরণ:

- URL যদি `/products` হয়, তাহলে
  - `<Route path="/products" element={<Products />} />`
  - এই `Products` component render হবে

অর্থাৎ, **URL অনুযায়ী `<main>`-এর ভিতরের content বদলায়**।

## কেন `nav` বদলায় না, কিন্তু শুধু Routes/Route অংশ বদলায়?

কারণ তোমার layout এমনভাবে লেখা:

- `nav` টা `Routes`-এর **বাইরে** আছে
- `Routes` টা `main`-এর ভিতরে আছে

এখন URL পরিবর্তন হলেও React Router শুধুমাত্র `Routes`-এর ভিতরে **কোন element render হবে** সেটা পরিবর্তন করে।

কিন্তু `nav` যেহেতু সব পেজে একই থাকবে এমন জায়গায় রাখা হয়েছে, তাই:

- **`nav` সবসময় দেখা যায় (persistent layout)**
- **`main`-এর ভেতরের page content বদলায় (route outlet area)**

এটাই সাধারণ SPA ডিজাইন: “Menu/Topbar/Footer স্থায়ী, মাঝের content বদলাবে”।

## `nav`-এ active link highlight কেন দেখা যাচ্ছে না?

এখন তুমি `Link` ব্যবহার করছো—`Link` নিজে থেকে active class দেয় না।

Active দেখাতে চাইলে `NavLink` ব্যবহার করা হয়। উদাহরণ:

```jsx
import { NavLink } from "react-router-dom";

<NavLink
  to="/about"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  About Us
</NavLink>
```

তারপর CSS এ `.active` স্টাইল দিলেই nav-এ বুঝা যাবে কোনটা selected।

## Quick Summary

- **`Router`**: URL change ধরবে
- **`Link`**: reload ছাড়াই URL change করবে
- **`Routes/Route`**: URL অনুযায়ী কোন component দেখাবে সেটা ঠিক করবে
- **`nav` না বদলানোর কারণ**: এটা `Routes`-এর বাইরে, তাই সব পেজে স্থায়ীভাবে থাকে

