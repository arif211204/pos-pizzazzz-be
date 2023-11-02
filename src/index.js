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

const options = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

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
