require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bearerToken = require('express-bearer-token');
const mysql = require('mysql2');
const util = require('util'); // Import the 'util' module

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

const options = {
  host: 'viaduct.proxy.rlwy.net',
  port: 53700,
  user: 'root',
  password: '-daeACE2H--hCg63H22Bg6H3AG-G44gF',
  database: 'railway',
};
const queryAsync = util.promisify(mysql.createPool(options).query); // Use util.promisify

async function getResults() {
  try {
    const results = await queryAsync('SELECT * FROM users');
    console.log(results);
  } catch (err) {
    console.log(err.message);
  }
}

getResults();

const connection = mysql.createConnection(options);

async function connectToDatabase() {
  try {
    await connection.connect();
    console.log('tes connect');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

connectToDatabase();

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
  // db.sequelize.sync({ alter: true });
});
