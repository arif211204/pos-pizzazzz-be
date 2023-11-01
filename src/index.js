require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bearerToken = require('express-bearer-token');
const http = require('http');

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
// app.listen(PORT, () => {
//   console.log(`listen on port:${PORT}`);
//   // db.sequelize.sync({ alter: true });
// });
const server = http.createServer((req, res) => {
  // Handle any other HTTP requests if needed
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
});

// Mount the Express app on the existing server
server.on('request', app);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
