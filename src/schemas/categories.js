import joi from 'joi';

export const categorySchema = joi.object({
   cateName: joi.string().required().trim(),
});
