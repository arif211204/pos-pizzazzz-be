require('dotenv').config();
const cors = require('cors');
const http = require('http');
const express = require('express');
const bearerToken = require('express-bearer-token');
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

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!');
});

const PORT = process.env.PORT || 2500;

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
  console.log(`listen on port:${PORT}`);
  db.sequelize.sync({ alter: true });
});
// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/`);
// });
