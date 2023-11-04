import express from 'express';
import {
   clearToken,
   redirect,
   refresh,
   signIn,
   signUp,
   getAllUser,
   getOneUser,
   removeUser,
   updateUser,
} from '../controller/auth';
const router = express.Router();

router.post('/login', signIn);
router.post('/signup', signUp);
router.get('/token', refresh);
router.delete('/token', clearToken);
router.get('/user', getAllUser);
router.get('/user/:id', getOneUser);
router.patch('/user/:id', updateUser);
router.delete('/user/:id', removeUser);
export default router;
