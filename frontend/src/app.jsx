import React, { useState } from 'react';
import CustomerDash from './pages/CustomerDash';
import FarmerDash from './pages/FarmerDash';
import AdminDash from './pages/AdminDash'; // 👈 Added the admin import

function App() {
  const [view, setView] = useState('customer');

  return (
    <div>
      {/* Navigation Top Bar Toggle */}
      <nav style={{ padding: '15px', background: '#222', color: 'white', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', marginRight: '10px' }}>AgriTradeChain Role View Selector:</span>
        <button onClick={() => setView('customer')} style={{ background: view === 'customer' ? '#4CAF50' : '#444', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}>
          Customer Dashboard
        </button>
        <button onClick={() => setView('farmer')} style={{ background: view === 'farmer' ? '#4CAF50' : '#444', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}>
          Farmer Dashboard
        </button>
        <button onClick={() => setView('admin')} style={{ background: view === 'admin' ? '#008CBA' : '#444', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}>
          Admin Dashboard Panel
        </button>
      </nav>

      {/* Render selected workspace views dynamically */}
      {view === 'customer' && <CustomerDash />}
      {view === 'farmer' && <FarmerDash />}
      {view === 'admin' && <AdminDash />}
    </div>
  );
}

export default App;
