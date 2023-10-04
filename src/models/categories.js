import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
   {
      cateName: {
         type: String,
         required: true,
      },
      productId: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
         },
      ],
   },
   { timestamps: true, versionKey: false },
);

export default mongoose.model('Category', categorySchema);
