import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import CustomerDash from './pages/CustomerDash';
import FarmerDash from './pages/FarmerDash';
import AdminDash from './pages/AdminDash';

import Login from './pages/login';
import Register from './pages/register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/customer/dashboard" element={
          <ProtectedRoute role="Customer">
            <CustomerDash />
          </ProtectedRoute>
        } />

        <Route path="/farmer/dashboard" element={
          <ProtectedRoute role="Farmer">
            <FarmerDash />
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="Admin">
            <AdminDash />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;