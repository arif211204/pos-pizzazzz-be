## Built With

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

- Backend Framework
  - [Express.js](https://expressjs.com/)
- Database
  - [MySQL](https://www.mysql.com/)
- Authentication
  - [JSON Web Token](https://jwt.io/)

## Usage Examples

### Menggunakan db.sequelize.sync({ alter: true })

![Nama Gambar](https://i.ibb.co/N3YPFfp/39ee52c0-935d-490b-87b8-db5a65c11ca5.jpg)

When using Sequelize to manage your database schema, you can use `db.sequelize.sync({ alter: true })`in line 44 to perform database schema synchronization in "alter" mode.

**Apa itu Modus "alter"?**
In "alter" mode, Sequelize will attempt to modify the existing database schema to match your Sequelize model definition without removing or replacing it. This means you can modify your models without worrying about losing existing data in the database.

### Admin or cashier Account Creation

To Login, send a POST request to the `/api/users` endpoint with the following JSON body:

```json
{
  "username": "admin123",
  "fullname": "admin123",
  "email": "admin123@mail.com",
  "password": "password123",
  "image": "image.png",
  "isAdmin": true,
  "isCahier": false
}
```

### Login admin or Cashier

To Login, send a POST request to the `/api/users/auth` endpoint with the following JSON body:

```json
{
  "username": "admin123",
  "password": "password123"
}
```

### Create Transaction

To create a new transaction, send a POST request to the `/api/transactions` endpoint with the following JSON body:

```json
{
  "voucherCode": "OKE",
  "variants": [
    {
      "variantId": 1,
      "quantity": 1
    },
    {
      "variantId": 2,
      "quantity": 1
    }
  ]
}
```

### Add Product

To add a new product, send a POST request to the
`/api/products` endpoint with the following JSON body:

```json
{
  "name": "Pizza",
  "categoryId": [1, 2],
  "description": "A delicious pizza",
  "image": "iamge.png",
  "IsActive": true
}
```

### Add Variant

To add a new variant, send a POST request to the `/api/variants` endpoint with the following JSON body:

```json
{
  "productId": 13,
  "name": "spicy",
  "price": 100000,
  "stock": 50
}
```

### Add Category

To add a new category, send a POST request to the `/api/categories` endpoint with the following JSON body:

```json
{
  "name": "Beverages",
  "image": "image.png"
}
```

### Add Voucher

To add a new voucher, send a POST request to the `/api/vouchers` endpoint with the following JSON body:

```json
{
  "code": "DISCOUNT10",
  "name": "DISCOUNT10",
  "discount": 1
}
```

and to manage vouchers that have been made to products, they can only be arranged in the database in the table `productvouchers`
