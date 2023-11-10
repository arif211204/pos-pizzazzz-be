require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bearerToken = require('express-bearer-token');
const mysql = require('mysql2');

const {
  userRouter,
  categoryRouter,
  productRouter,
  transactionRouter,
  voucherRouter,
  variantController,
  transactionVariantController,
} = require('./routes');

const db = require('./models');

const PORT = process.env.PORT || 2500;

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bearerToken());
app.use('/users', userRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/transactions', transactionRouter);
app.use('/vouchers', voucherRouter);
app.use('/variants', variantController);
app.use('/transVariant', transactionVariantController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
console.log(process.version, 'version');

// Use a connection pool and handle errors properly
app.use((req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Attach the connection to the request for use in route handlers
    req.dbConnection = connection;
    next();
  });
});

// Handle releasing the database connection after handling the request
app.use((req, res, next) => {
  if (req.dbConnection) {
    req.dbConnection.release();
  }
  next();
});
