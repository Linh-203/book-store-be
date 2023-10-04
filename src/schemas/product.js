import joi from 'joi';

export const productSchema = joi.object({
   name: joi.string().required(),
   image: joi.array().items(),
   price: joi.number().required(),
   desc: joi.string().required(),
   author: joi.string().required(),
   categoryId: joi.string().required(),
   discount: joi.number().required(),
});
