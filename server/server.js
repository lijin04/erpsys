const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

// 中间件配置
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 创建数据库连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'erpsys'
});

// 连接数据库
connection.connect(error => {
  if (error) {
    console.error('数据库连接失败:', error);
    return;
  }
  console.log('成功连接到数据库');
});

// API 路由
// 获取公司列表
app.get('/api/companies', (req, res) => {
  connection.query('SELECT * FROM companies', (error, results) => {
    if (error) {
      console.error('获取公司列表失败:', error);
      res.status(500).json({ error: '获取公司列表失败' });
      return;
    }
    res.json(results);
  });
});

// 获取账单列表
app.get('/api/bills', (req, res) => {
  connection.query('SELECT * FROM bills', (error, results) => {
    if (error) {
      console.error('获取账单列表失败:', error);
      res.status(500).json({ error: '获取账单列表失败' });
      return;
    }
    res.json(results);
  });
});

// 获取仓库列表
app.get('/api/inventory', (req, res) => {
  connection.query('SELECT * FROM inventory', (error, results) => {
    if (error) {
      console.error('获取仓库列表失败:', error);
      res.status(500).json({ error: '获取仓库列表失败' });
      return;
    }
    res.json(results);
  });
});

// 添加新账单
app.post('/api/bills', (req, res) => {
  const { 
    companyName, 
    purchaseDate, 
    product, 
    deliveryAmount,
    receivedAmount, 
    outstandingAmount,
    notes 
  } = req.body;

  const query = `
    INSERT INTO bills (
      companyName, 
      purchaseDate, 
      product, 
      deliveryAmount,
      receivedAmount, 
      outstandingAmount,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [companyName, purchaseDate, product, deliveryAmount, receivedAmount, outstandingAmount, notes],
    (error, results) => {
      if (error) {
        console.error('添加账单失败:', error);
        res.status(500).json({ error: '添加账单失败' });
        return;
      }
      
      const newBill = {
        id: results.insertId,
        companyName,
        purchaseDate,
        product,
        deliveryAmount,
        receivedAmount,
        outstandingAmount,
        notes
      };
      
      res.status(201).json(newBill);
    }
  );
});

// 添加新库存记录
app.post('/api/inventory', (req, res) => {
  const { 
    productName, 
    operationDate, 
    operationType, 
    quantity,
    notes 
  } = req.body;

  const query = `
    INSERT INTO inventory (
      productName, 
      operationDate, 
      operationType, 
      quantity,
      notes
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [productName, operationDate, operationType, quantity, notes],
    (error, results) => {
      if (error) {
        console.error('添加库存记录失败:', error);
        res.status(500).json({ error: '添加库存记录失败' });
        return;
      }
      
      const newInventory = {
        id: results.insertId,
        productName,
        operationDate,
        operationType,
        quantity,
        notes
      };
      
      res.status(201).json(newInventory);
    }
  );
});

// 设置服务器端口
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

// 添加错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('未处理的 Promise 拒绝:', error);
});

// 保持数据库连接
setInterval(() => {
  connection.query('SELECT 1', (err) => {
    if (err) {
      console.error('保持连接失败:', err);
    }
  });
}, 60000);

// 打印所有请求的信息
app.use((req, res, next) => {
  console.log('收到请求:', {
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query
  });
  next();
}); 