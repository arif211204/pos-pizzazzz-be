/* eslint-disable consistent-return */
const { Variant } = require('../models');

const { ResponseError } = require('../errors');

const variantController = {
  createVariant: async (req, res) => {
    try {
      // Check if 'productId' is provided in the request body
      if (!req.body.productId) {
        return res.status(400).json({
          status: 'error',
          message: 'productId is required for creating a Variant',
        });
      }

      // Create a new Variant with the provided 'productId'
      const variantData = {
        ...req.body, // Include other variant fields
        productId: req.body.productId, // Set the 'productId'
      };
      console.log('variantData in variant controller :>> ', variantData);
      const newVariant = await Variant.create(variantData);

      res.status(201).json({
        status: 'success',
        data: newVariant,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },
  getAllVariants: async (req, res) => {
    try {
      const variantsData = await Variant.findAll();
      res.status(200).json({
        status: 'success',
        data: variantsData,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  getVariantById: async (req, res) => {
    try {
      const variantData = await Variant.findByPk(req.params.id);
      if (!variantData) throw new ResponseError('Variant not found', 404);

      res.status(200).json({
        status: 'success',
        data: variantData,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  editVariantById: async (req, res) => {
    try {
      const [numUpdated] = await Variant.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      if (numUpdated === 0) throw new ResponseError('Variant not found', 404);

      res.sendStatus(204);
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  deleteVariantById: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedVariant = await Variant.destroy({ where: { id } });

      if (deletedVariant === 0)
        throw new ResponseError('Variant not found', 404);

      res.sendStatus(204);
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },
};

module.exports = variantController;
