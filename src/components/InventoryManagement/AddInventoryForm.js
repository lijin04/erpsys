import React, { useState } from 'react';

const AddInventoryForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    productName: '',
    operationDate: '',
    operationType: '进货',
    quantity: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      productName: formData.productName,
      operationDate: formData.operationDate,
      operationType: formData.operationType,
      quantity: parseInt(formData.quantity),
      notes: formData.notes || ''
    };

    console.log('提交的库存数据:', submitData);
    onAdd(submitData);

    setFormData({
      productName: '',
      operationDate: '',
      operationType: '进货',
      quantity: '',
      notes: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="add-inventory-form">
      <div className="form-group">
        <label>产品名称：</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
          placeholder="请输入产品名称"
        />
      </div>

      <div className="form-group">
        <label>日期：</label>
        <input
          type="date"
          name="operationDate"
          value={formData.operationDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>操作类型：</label>
        <select
          name="operationType"
          value={formData.operationType}
          onChange={handleChange}
          required
        >
          <option value="进货">进货</option>
          <option value="出货">出货</option>
        </select>
      </div>

      <div className="form-group">
        <label>数量：</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          min="1"
          placeholder="请输入数量"
        />
      </div>

      <div className="form-group">
        <label>备注：</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="请输入备注信息"
        />
      </div>

      <button type="submit">提交</button>
    </form>
  );
};

export default AddInventoryForm; 