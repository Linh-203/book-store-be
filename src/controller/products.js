import Products from '../models/products';
import Category from '../models/categories';
import { productSchema } from '../schemas/product';
import mongoose from 'mongoose';
export const getAllProduct = async (req, res) => {
   const { _page = 1, _order = 'asc', _limit = 1000000, _sort = 'createdAt', _q = '' } = req.query;
   const options = {
      page: _page,
      limit: _limit,
      sort: {
         [_sort]: _order === 'desc' ? -1 : 1,
      },
      populate: [{ path: 'categoryId' }],
      collation: { locale: 'vi', strength: 1 },
   };
   const optionsSearch =
      _q !== ''
         ? {
              $or: [
                 { name: { $regex: _q, $options: 'i' } },
                 //   { price: { $regex: _q, $options: 'i' } },
                 { author: { $regex: _q, $options: 'i' } },
              ],
           }
         : {};
   // const optionsSearch = _q !== '' ? { $text: { $search: _q } } : {};
   try {
      const product = await Products.paginate({ ...optionsSearch }, { ...options });
      return res.status(201).json({
         message: 'Get all product successfully',
         product: product.docs,
      });
   } catch (error) {
      return res.status(400).json({
         message: error.message,
      });
   }
};

export const createProduct = async (req, res) => {
   try {
      const { error } = productSchema.validate(req.body, { abortEarly: false });
      if (error) {
         return res.status(401).json({
            message: error.details.map((error) => error.message),
         });
      }

      const product = await Products.create(req.body);
      await Category.findByIdAndUpdate(product.categoryId, {
         $push: { productId: product._id },
      });

      return res.status(201).json({
         message: 'Create product successfully',
         product,
      });
   } catch (error) {
      return res.status(400).json({
         message: error.message,
      });
   }
};
export const getRelatedProducts = async (req, res) => {
   try {
      const { cate_id, product_id } = req.params;
      const products = await Products.aggregate([
         {
            $match: {
               categoryId: new mongoose.Types.ObjectId(cate_id),
               _id: { $ne: new mongoose.Types.ObjectId(product_id) },
            },
         },
         { $sample: { size: 10 } },
         // {
         //    $lookup: {
         //       from: 'shipments',
         //       localField: 'idShipment',
         //       foreignField: '_id',
         //       as: 'shipment',
         //    },
         // },
      ]);
      if (!products) {
         return res.status(404).json({
            status: 404,
            message: 'No Product found',
         });
      } else {
         return res.status(200).json({
            products,
            status: 200,
            message: 'Product found',
         });
      }
   } catch (error) {
      return res.status(500).json({
         status: 500,
         message: error.message,
      });
   }
};
export const updateProduct = async (req, res) => {
   try {
      const { error } = productSchema.validate(req.body, { abortEarly: false });
      if (error) {
         return res.status(403).json({
            message: error.details.map((error) => error.message),
         });
      }

      const product = await Products.findByIdAndUpdate(req.params.id, req.body);

      // Update new category
      await Category.findByIdAndUpdate(product.categoryId, {
         $pull: {
            productId: product._id,
         },
      });
      await Category.findByIdAndUpdate(
         req.body.categoryId,
         {
            $addToSet: { products: product._id },
         },
         { new: true },
      );

      return res.status(201).json({
         message: 'Update product successfully',
         product,
      });
   } catch (error) {
      return res.status(400).json({
         message: error.message,
      });
   }
};

export const getOneProduct = async (req, res) => {
   try {
      const product = await Products.findById(req.params.id).populate('categoryId');
      await product.populate('categoryId.productId');
      return res.status(201).json({
         message: 'Get product successfully',
         product,
      });
   } catch (error) {
      return res.status(400).json({
         message: error.message,
      });
   }
};
export const removeProduct = async (req, res) => {
   try {
      // Tìm và lấy thông tin sản phẩm cần xóa
      const product = await Products.findById(req.params.id);

      // Lấy các trường categoryId từ sản phẩm
      const { categoryId } = product;

      // Xóa id của sản phẩm khỏi bảng category
      await Category.findByIdAndUpdate(categoryId, {
         $pull: {
            productId: req.params.id,
         },
      });

      // Xóa sản phẩm
      await Products.findByIdAndDelete(req.params.id);

      return res.status(201).json({
         message: 'Remove product successfully',
      });
   } catch (error) {
      return res.status(400).json({
         message: error.message,
      });
   }
};
