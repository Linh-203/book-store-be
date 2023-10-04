import express from 'express';
import {
   createCategory,
   getAllCategory,
   getOneCategory,
   removeCategories,
   updateCategory,
} from '../controller/categories';
const router = express.Router();

router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', removeCategories);
router.get('/categories', getAllCategory);
router.get('/categories/:id', getOneCategory);
export default router;
