import React, { useState } from 'react';
import BillManagement from './components/BillManagement/BillList';
import InventoryManagement from './components/InventoryManagement/InventoryList';

function App() {
  const [activeTab, setActiveTab] = useState('bill');

  return (
    <div className="app">
      <nav>
        <button 
          onClick={() => setActiveTab('bill')}
          className={activeTab === 'bill' ? 'active' : ''}
        >
          账单管理
        </button>
        <button 
          onClick={() => setActiveTab('inventory')}
          className={activeTab === 'inventory' ? 'active' : ''}
        >
          仓库管理
        </button>
      </nav>
      
      {activeTab === 'bill' ? <BillManagement /> : <InventoryManagement />}
    </div>
  );
}

export default App; 