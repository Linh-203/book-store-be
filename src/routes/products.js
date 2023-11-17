import express from 'express';
import {
   getAllProduct,
   createProduct,
   getOneProduct,
   removeProduct,
   updateProduct,
   getRelatedProducts,
} from '../controller/products';
import { authorization } from '../middleware/authorization';
import authentication from '../middleware/authentication';

const router = express.Router();
router.post('/products', authentication, authorization, createProduct);
router.patch('/products/:id', authentication, authorization, updateProduct);
router.get('/products/related/:cate_id/:product_id', getRelatedProducts);
router.get('/products', getAllProduct);
router.get('/products/:id', getOneProduct);
router.delete('/products/:id', authentication, authorization, removeProduct);
export default router;
