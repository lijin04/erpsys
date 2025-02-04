import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddBillForm from './AddBillForm';
import './BillList.css';

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies, setCompanies] = useState([]);

  // 获取账单数据
  const fetchBills = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/bills');
      setBills(response.data);
      
      // 从账单数据中提取唯一的公司名称（只提取名称字符串）
      const uniqueCompanies = [...new Set(response.data.map(bill => bill.companyName))];
      setCompanies(uniqueCompanies);
    } catch (error) {
      console.error('获取账单失败:', error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleAddBill = async (billData) => {
    try {
      await axios.post('http://localhost:5001/api/bills', billData);
      fetchBills(); // 重新获取账单列表
      setShowForm(false);
    } catch (error) {
      console.error('添加账单失败:', error);
    }
  };

  const filteredBills = selectedCompany
    ? bills.filter(bill => bill.companyName === selectedCompany)
    : bills;

  return (
    <div className="bill-management">
      <div className="header">
        <h2>账单管理</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '添加账单'}
        </button>
      </div>

      {showForm && (
        <AddBillForm onAdd={handleAddBill} />
      )}

      <div className="filter-section">
        <label>选择公司：</label>
        <select 
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="company-select"
        >
          <option value="">所有公司</option>
          {companies.map(company => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>公司名称</th>
            <th>进货日期</th>
            <th>产品</th>
            <th>送货金额</th>
            <th>实收金额</th>
            <th>未收金额</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          {filteredBills.map(bill => (
            <tr key={bill.id}>
              <td>{bill.companyName}</td>
              <td>{bill.purchaseDate}</td>
              <td>{bill.product}</td>
              <td>￥{bill.deliveryAmount}</td>
              <td>￥{bill.receivedAmount}</td>
              <td>￥{bill.outstandingAmount}</td>
              <td>{bill.notes}</td>
            </tr>
          ))}
        </tbody>
        {filteredBills.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan="3">合计</td>
              <td>￥{filteredBills.reduce((sum, bill) => sum + parseFloat(bill.deliveryAmount), 0).toFixed(2)}</td>
              <td>￥{filteredBills.reduce((sum, bill) => sum + parseFloat(bill.receivedAmount), 0).toFixed(2)}</td>
              <td>￥{filteredBills.reduce((sum, bill) => sum + parseFloat(bill.outstandingAmount), 0).toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default BillList;