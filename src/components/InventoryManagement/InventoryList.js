import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddInventoryForm from './AddInventoryForm';
import './InventoryList.css';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [productTotals, setProductTotals] = useState({});

  // 获取仓库数据
  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/inventory');
      setInventory(response.data);
      
      // 从数据中提取唯一的产品名称
      const uniqueProducts = [...new Set(response.data.map(item => item.productName))];
      setProducts(uniqueProducts);

      // 计算每个产品的库存总量
      const totals = {};
      uniqueProducts.forEach(product => {
        const productRecords = response.data.filter(item => item.productName === product);
        const total = productRecords.reduce((sum, item) => {
          return sum + (item.operationType === '进货' ? item.quantity : -item.quantity);
        }, 0);
        totals[product] = total;
      });
      setProductTotals(totals);
    } catch (error) {
      console.error('获取仓库数据失败:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddInventory = async (inventoryData) => {
    try {
      await axios.post('http://localhost:5001/api/inventory', inventoryData);
      fetchInventory();
      setShowForm(false);
    } catch (error) {
      console.error('添加库存记录失败:', error);
    }
  };

  const handleDeleteInventory = async (inventoryId) => {
    console.log('尝试删除库存记录，ID:', inventoryId);
    if (!window.confirm('确定要删除这条库存记录吗？')) {
      return; // 用户取消删除操作
    }
  
    try {
      await axios.delete(`http://localhost:5001/api/inventory/${inventoryId}`);
      alert('库存记录删除成功');
      fetchInventory(); // 重新获取库存列表
    } catch (error) {
      console.error('删除库存记录失败:', error);
      alert('删除库存记录失败，请稍后再试');
    }
  };

  const filteredInventory = selectedProduct
    ? inventory.filter(item => item.productName === selectedProduct)
    : inventory;

  return (
    <div className="inventory-management">
      <div className="header">
        <h2>仓库管理</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '添加记录'}
        </button>
      </div>

      {showForm && (
        <AddInventoryForm onAdd={handleAddInventory} />
      )}

      <div className="filter-section">
        <label>选择产品：</label>
        <select 
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="product-select"
        >
          <option value="">所有产品</option>
          {products.map(product => (
            <option key={product} value={product}>
              {product} (库存: {productTotals[product] || 0})
            </option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>产品名称</th>
            <th>日期</th>
            <th>操作类型</th>
            <th>数量</th>
            <th>备注</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map(item => (
            <tr key={item.id}>
              <td>{item.productName}</td>
              <td>{item.operationDate}</td>
              <td>{item.operationType}</td>
              <td>{item.quantity}</td>
              <td>{item.notes}</td>
              <td>
                <button 
                  onClick={() => handleDeleteInventory(item.id)} 
                  className="delete-button"
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        {selectedProduct && (
          <tfoot>
            <tr>
              <td colSpan="3">当前库存总量</td>
              <td>{productTotals[selectedProduct] || 0}</td>
              <td></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default InventoryList;