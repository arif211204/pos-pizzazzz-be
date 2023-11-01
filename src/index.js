require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bearerToken = require('express-bearer-token');
const mysql = require('mysql');
// const http = require('http');

const {
  userRouter,
  categoryRouter,
  productRouter,
  transactionRouter,
  voucherRouter,
  variantController,
  transactionVariantController,
} = require('./routes');
// eslint-disable-next-line no-unused-vars
const db = require('./models');

const PORT = process.env.PORT || 2500;

const options = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  timeout: 10000, // 10 seconds
};
const connection = mysql.createConnection(options);
connection.connect();

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

// const server = http.createServer(app);
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   db.sequelize.sync({ alter: true });
// });

app.listen(PORT, () => {
  console.log(`listen on port:${PORT}`);
  // db.sequelize.sync({ alter: true });
});
