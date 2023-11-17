import express from 'express';
import {
   createCategory,
   getAllCategory,
   getOneCategory,
   removeCategories,
   updateCategory,
} from '../controller/categories';
import { authorization } from '../middleware/authorization';
import authentication from '../middleware/authentication';
const router = express.Router();

router.post('/categories',authentication, authorization, createCategory);
router.patch('/categories/:id',authentication, authorization, updateCategory);
router.delete('/categories/:id',authentication, authorization, removeCategories);
router.get('/categories', getAllCategory);
router.get('/categories/:id', getOneCategory);
export default router;
