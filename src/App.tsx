import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import SimpleHome from './SimpleHome'
import MinimalHome from './MinimalHome'
import Products from './pages/Products'
import Customizer from './pages/Customizer'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import { ToastProvider } from './components/ui/toast'

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Simple test route without layout */}
          <Route path="/simple" element={<SimpleHome />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<MinimalHome />} />
            <Route path="products" element={<Products />} />
            <Route path="customizer" element={<Customizer />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
