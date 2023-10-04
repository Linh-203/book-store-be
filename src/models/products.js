import mongoose from 'mongoose';
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

      //  brandId: {
      //      type: mongoose.Schema.Types.ObjectId,
      //      required: true,
      //      ref: "Brand"

      //  },
      categoryId: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'Category',
      },
   },
   { timestamps: true, versionKey: false },
);
export default mongoose.model('Products', productSchema);
