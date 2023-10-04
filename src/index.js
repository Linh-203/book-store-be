import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import categoryRouter from './routes/categories';
import productsRouter from './routes/products';
import uploadImage from './routes/upload';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', categoryRouter);
app.use('/api', productsRouter);
app.use('/api', uploadImage);

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGODB_LOCAL;
mongoose
   .connect(MONGO_URL)
   .then(() => console.log('connected to db'))
   .catch((err) => console.log('error in connect db'));
app.listen(PORT, () => {
   console.log(`listening success ${PORT}`);
});
