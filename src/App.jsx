import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import FloatingCart from './components/FloatingCart';
import HomePage from './pages/homepage';
import Kitchens from './pages/Kitchens';
import KitchenModelDetail from './pages/KitchenModelDetail';
import Bedrooms from './pages/bedrooms';
import Products from './pages/products';
import AboutUs from './pages/aboutUs';
import Cart from './pages/cart';
import Login from './pages/login';
import SignUp from './pages/signUp';
import Admin from './pages/admin';
import AdminProtectedWrapper from './components/AdminProtectedWrapper';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <div className="main-content flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/kitchens" element={<Kitchens />} />
            <Route path="/kitchens/:modelId" element={<KitchenModelDetail />} />
            <Route path="/bedrooms" element={<Bedrooms />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedWrapper>
                  <Admin />
                </AdminProtectedWrapper>
              }
            />
          </Routes>
        </div>
        <Footer />
        <FloatingCart />
      </div>
    </BrowserRouter>
  );
}

export default App;