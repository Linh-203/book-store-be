import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const productSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      image: {
         type: Array,
         // required: true,
         default: [],
      },
      desc: {
         type: String,
         required: true,
      },
      author: {
         type: String,
         required: true,
      },
      price: {
         type: Number,
         required: true,
      },
      discount: {
         type: Number,
         default: 0,
      },
      maxQuantity: {
         type: Number,
         default: 0,
      },
      categoryId: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'Category',
      },
   },
   { timestamps: true, versionKey: false },
);
productSchema.plugin(paginate);
export default mongoose.model('Products', productSchema);
