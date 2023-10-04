import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { deleteImage, uploadImage } from '../controller/upload';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { updateImage } from '../controller/upload';

const router = Router();
const storage = new CloudinaryStorage({
   cloudinary: cloudinary,
   params: {
      folder: 'fresh_mart',
   },
});
const upload = multer({
   storage: storage,
});

router.post('/images', upload.array('images', 3), uploadImage);
router.put('/images/:publicId', upload.array('images', 1), updateImage);
router.delete('/images/:publicId', deleteImage);

export default router;
