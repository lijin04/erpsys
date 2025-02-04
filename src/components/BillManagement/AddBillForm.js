import React, { useState, useEffect } from 'react';

const AddBillForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    purchaseDate: '',
    product: '',
    deliveryAmount: '',
    receivedAmount: '',
    outstandingAmount: '',
    notes: ''
  });

  // 自动计算未收金额
  useEffect(() => {
    if (formData.deliveryAmount && formData.receivedAmount) {
      const delivery = parseFloat(formData.deliveryAmount);
      const received = parseFloat(formData.receivedAmount);
      const outstanding = (delivery - received).toFixed(2);
      setFormData(prev => ({
        ...prev,
        outstandingAmount: outstanding
      }));
    }
  }, [formData.deliveryAmount, formData.receivedAmount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 确保所有必要的数据都被传递
    const submitData = {
      companyName: formData.companyName,
      purchaseDate: formData.purchaseDate,
      product: formData.product,
      deliveryAmount: parseFloat(formData.deliveryAmount).toFixed(2),  // 确保包含这个字段
      receivedAmount: parseFloat(formData.receivedAmount).toFixed(2),
      outstandingAmount: parseFloat(formData.outstandingAmount).toFixed(2),
      notes: formData.notes || ''
    };

    console.log('提交的表单数据:', submitData);  // 添加日志
    onAdd(submitData);

    // 重置表单
    setFormData({
      companyName: '',
      purchaseDate: '',
      product: '',
      deliveryAmount: '',
      receivedAmount: '',
      outstandingAmount: '',
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
    <form onSubmit={handleSubmit} className="add-bill-form">
      <div className="form-group">
        <label>公司名称：</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
          placeholder="请输入公司名称"
        />
      </div>

      <div className="form-group">
        <label>进货日期：</label>
        <input
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>产品：</label>
        <input
          type="text"
          name="product"
          value={formData.product}
          onChange={handleChange}
          required
          placeholder="请输入产品名称"
        />
      </div>

      <div className="form-group">
        <label>送货金额：</label>
        <input
          type="number"
          name="deliveryAmount"
          value={formData.deliveryAmount}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
          placeholder="请输入送货金额"
        />
      </div>

      <div className="form-group">
        <label>实收金额：</label>
        <input
          type="number"
          name="receivedAmount"
          value={formData.receivedAmount}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
          placeholder="请输入实收金额"
        />
      </div>

      <div className="form-group">
        <label>未收金额：</label>
        <input
          type="number"
          name="outstandingAmount"
          value={formData.outstandingAmount}
          readOnly
          className="readonly-input"
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

export default AddBillForm; 