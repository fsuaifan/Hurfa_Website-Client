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
            <Route path="/about" element={<div className="container py-5"><h1>About Us</h1></div>} />
            <Route path="/admin" element={<div className="container py-5"><h1>Admin</h1></div>} />
          </Routes>
        </div>
        <Footer />
        <FloatingCart />
      </div>
    </BrowserRouter>
  );
}

export default App;