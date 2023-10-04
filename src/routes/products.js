import express from 'express';
import { getAllProduct, createProduct, getOneProduct, removeProduct, updateProduct } from '../controller/products';
// import { checkPermissionAndAuth } from '../middlewares/authorization';

const router = express.Router();
router.post('/products', createProduct);
router.patch('/products/:id', updateProduct);
router.get('/products', getAllProduct);
router.get('/products/:id', getOneProduct);
router.delete('/products/:id', removeProduct);
export default router;
