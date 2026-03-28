import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import Products from './components/Products'
import Contact from './components/Contact'
import Footer from './Footer'

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <hr/>
        <Footer />
      </div>
    </Router>
  )
}

export default App
