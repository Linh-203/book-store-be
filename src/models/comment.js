import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
   {
      postId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Post',
         required: true,
      },
      userName: {
         type: String,
         required: true,
      },
      comment: {
         type: String,
         required: true,
      },
      replies: [
         {
            userName: {
               type: String,
               required: true,
            },
            commentId: {
               type: mongoose.Schema.Types.ObjectId,
               required: true,
            },
            reply: {
               type: String,
               required: true,
            },
         },
      ],
   },
   { timestamps: true, versionKey: false },
);

export default mongoose.model('Category', commentSchema);
