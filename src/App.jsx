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
            <Route
              path="/admin"
              element={
                <AdminProtectedWrapper>
                  <div
                    className="container py-5 text-start"
                    style={{ maxWidth: '900px' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                      <h1 className="m-0">Admin Dashboard</h1>
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => {
                          sessionStorage.removeItem('hurfa_admin_authenticated');
                          window.location.href = '/login?redirect=/admin';
                        }}
                      >
                        Log Out (End Session)
                      </button>
                    </div>
                    <p className="text-muted">
                      Authenticated session active. The login page will prompt once per browser session.
                    </p>
                  </div>
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