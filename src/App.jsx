import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <div className="main-content" style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<div className="container py-5"><h1>Home</h1></div>} />
          <Route path="/kitchens" element={<div className="container py-5"><h1>Kitchens</h1></div>} />
          <Route path="/bedrooms" element={<div className="container py-5"><h1>Bedrooms</h1></div>} />
          <Route path="/products" element={<div className="container py-5"><h1>Products</h1></div>} />
          <Route path="/about" element={<div className="container py-5"><h1>About Us</h1></div>} />
          <Route path="/admin" element={<div className="container py-5"><h1>Admin</h1></div>} />
1        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
