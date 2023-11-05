/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const sharp = require('sharp');
const sendResponse = require('../utils/sendResponse');
const { ResponseError } = require('../errors');
const {
  Sequelize,
  sequelize,
  Product,
  Category,
  Variant,
  Voucher,
} = require('../models');

const productController = {
  getProducts: async (req, res) => {
    try {
      const { name, categoryId, sortBy, orderBy } = req.query;

      const order =
        sortBy === 'price'
          ? [
              [
                Sequelize.literal(
                  `(SELECT MAX(price) FROM Variants WHERE Variants.productId = Product.id)`
                ),
                orderBy || 'DESC',
              ],
            ]
          : [[sortBy || 'updatedAt', orderBy || 'DESC']];

      const where = {};
      if (name) where.name = { [Sequelize.Op.like]: `%${name}%` };

      const pagination = {};
      if (req.query.isPaginated !== 'false') {
        req.query.page = +req.query.page || 1;
        req.query.perPage = +req.query.perPage || 5;
        pagination.limit = req.query.perPage;
        pagination.offset = (req.query.page - 1) * req.query.perPage;
      }

      if (categoryId) {
        const categoryData = await Category.findByPk(categoryId);
        if (!categoryData) throw new ResponseError('invalid categoryId', 400);

        const productsData = await categoryData.getProducts({
          where,
          attributes: { exclude: ['image'] },
          order,
          ...pagination,
          include: [
            {
              model: Category,
              attributes: { exclude: ['image'] },
            },
            {
              model: Variant,
            },
            {
              model: Voucher,
            },
          ],
        });

        const totalData = await categoryData.countProducts({ where });

        const paginationInfo = {};
        if (req.query.isPaginated !== 'false') {
          paginationInfo.total_page = Math.ceil(totalData / req.query.perPage);
          paginationInfo.current_page = req.query.page;
          paginationInfo.per_page = req.query.perPage;
        }

        sendResponse({
          res,
          statusCode: 200,
          data: productsData,
          total_data: totalData,
          ...paginationInfo,
        });
        return;
      }

      const productsData = await Product.findAll({
        where,
        attributes: { exclude: ['image'] },
        order,
        ...pagination,
        include: [
          {
            model: Category,
            attributes: { exclude: ['image'] },
          },
          {
            model: Variant,
            include: [{ model: Product, attributes: { exclude: ['image'] } }],
          },
          {
            model: Voucher,
          },
        ],
      });

      const totalData = await Product.count({ where });

      const paginationInfo = {};
      if (req.query.isPaginated !== 'false') {
        paginationInfo.total_page = Math.ceil(totalData / req.query.perPage);
        paginationInfo.current_page = req.query.page;
        paginationInfo.per_page = req.query.perPage;
      }

      sendResponse({
        res,
        statusCode: 200,
        data: productsData,
        total_data: totalData,
        ...paginationInfo,
      });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getProductImageById: async (req, res) => {
    try {
      const productData = await Product.findByPk(req.params.id, {
        attributes: ['image'],
      });
      if (!productData?.image)
        throw new ResponseError('product image not found', 404);

      res.set('Content-type', 'image/png').send(productData.image);
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  createProduct: async (req, res) => {
    try {
      await sequelize.transaction(async (t) => {
        // get product image
        req.body.image = await sharp(req.file.buffer).png().toBuffer();

        // create new product
        const productData = await Product.create(req.body, {
          field: ['name', 'description', 'image', 'isActive'],
          transaction: t,
        });

        // set product category
        if (req.body?.categoryId && req.body.categoryId.length > 0) {
          // check if categoryId exist
          const categoriesData = await Category.findAll({
            attributes: ['id'],
            where: { id: req.body.categoryId },
            transaction: t,
          });
          if (categoriesData?.length !== req.body.categoryId.length)
            throw new ResponseError('invalid categoryId', 400);

          // set category for new product
          await productData.setCategories(req.body.categoryId, {
            transaction: t,
          });
        }

        // set product variant
        if (req.body?.variants && req.body.variants.length > 0) {
          // set variant for new product
          const variantsData = await Variant.bulkCreate(req.body.variants, {
            fields: ['name', 'price', 'stock'],
            transaction: t,
          });
          await productData.setVariants(variantsData, { transaction: t });
        }

        // get product data
        const result = await Product.findByPk(productData.id, {
          attributes: { exclude: ['image'] },
          include: [
            { model: Category, attributes: { exclude: ['image'] } },
            { model: Variant },
          ],
          transaction: t,
        });

        sendResponse({ res, statusCode: 200, data: result });
      });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  asyncEditProductById: async (req, res) => {
    try {
      await sequelize.transaction(
        {
          isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        },
        async (t) => {
          // Get product image
          if (req.file) {
            req.body.image = await sharp(req.file.buffer).png().toBuffer();
          }

          // Check if there is data to be updated
          if (Object.keys(req.body).length === 0) {
            throw new ResponseError('No data provided', 400);
          }

          // Update product
          const [numProductUpdated] = await Product.update(req.body, {
            where: { id: req.params.id },
            fields: ['name', 'description', 'image', 'isActive'], // Changed 'field' to 'fields'
            transaction: t,
          });
          if (numProductUpdated === 0) {
            throw new ResponseError('Product not found', 404);
          }

          // Get product data
          const productData = await Product.findByPk(req.params.id, {
            transaction: t,
          });

          // Update product category
          if (req.body?.categoryId && req.body.categoryId.length > 0) {
            // Check if categoryId exists
            const categoriesData = await Category.findAll({
              attributes: ['id'],
              where: { id: req.body.categoryId },
              transaction: t,
            });
            if (categoriesData.length !== req.body.categoryId.length) {
              throw new ResponseError('Invalid categoryId', 400);
            }

            // Set categories for the product
            await productData.setCategories(req.body.categoryId, {
              transaction: t,
            });
          }

          // Update product variants
          if (req.body?.variants && req.body.variants.length > 0) {
            // Get existing variants and new variants
            const newVariants = req.body.variants.filter(
              (variant) => !variant?.id
            );
            const updateVariants = req.body.variants.filter(
              (variant) => !!variant?.id
            );

            // Delete existing variants in the database but not in the request body
            const variantsData = await productData.getVariants({
              transaction: t,
            });
            const updateVariantsId = updateVariants.map(({ id }) => id);

            for (const variantData of variantsData) {
              if (!updateVariantsId.includes(variantData.id)) {
                await variantData.destroy({
                  where: { id: variantData.id },
                  transaction: t,
                });
              }
            }

            // Update existing variants
            for (const updateVariant of updateVariants) {
              const [numVariantUpdated] = await Variant.update(updateVariant, {
                where: { id: updateVariant.id },
                fields: ['name', 'price', 'stock'], // Changed 'field' to 'fields'
                transaction: t,
              });
              if (numVariantUpdated === 0) {
                throw new ResponseError('Invalid variant id', 400);
              }
            }

            // Create new variants
            const newVariantsData = await Variant.bulkCreate(newVariants, {
              fields: ['name', 'price', 'stock'],
              transaction: t,
            });
            await productData.addVariants(newVariantsData, { transaction: t });
          }

          res.sendStatus(204);
        }
      );
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  deleteProductById: async (req, res) => {
    try {
      const result = await Product.destroy({ where: { id: req.params.id } });
      if (!result) throw new ResponseError('product not found', 404);

      res.sendStatus(204);
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = productController;
