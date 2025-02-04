import React, { useState } from 'react';

const AddInventoryRecord = ({ onAdd = () => {} }) => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    price: '',
    date: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onAdd === 'function') {
      onAdd(formData);
      setFormData({
        productName: '',
        quantity: '',
        price: '',
        date: ''
      });
    } else {
      console.error('onAdd prop is not a function');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="productName"
        placeholder="产品名称"
        value={formData.productName}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="quantity"
        placeholder="数量"
        value={formData.quantity}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="单价"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <button type="submit">添加库存记录</button>
    </form>
  );
};

export default AddInventoryRecord; 