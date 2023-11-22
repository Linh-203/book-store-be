import User from '../models/user';
import { signinSchema, singupSchema, userSchema } from '../schemas/auth';
import bcrypt from 'bcrypt';
import jwt, { decode } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
export const getAllUser = async (req, res) => {
   try {
      const user = await User.find();
      return res.status(201).json({
         message: 'Get all User successfully',
         user,
      });
   } catch (error) {
      return res.status(400).json({
         message: error.message,
      });
   }
};

export const validateUser = async (detail) => {
   const user = await User.findOne({ email: detail.email });

   if (user) return user;

   // Tạo mật khẩu ngẫu nhiên cho người dùng
   const randomPassword = Math.random().toString(36).slice(-8);
   const hashedPassword = await bcrypt.hash(randomPassword, 10);

   const newUser = await User.create({
      email: detail.email,
      name: detail.name,
      avatar: detail.picture,
      password: hashedPassword,
   });

   return newUser;
};

export const signUp = async (req, res) => {
   try {
      const { error } = singupSchema.validate(req.body, { abortEarly: false });

      if (error) {
         return res.status(500).json({
            message: error.details[0].message,
         });
      }

      const userExist = await User.findOne({ email: req.body.email });
      if (userExist) {
         return res.status(400).json({
            message: `Form error: Email already registered`,
         });
      }

      const hashPassword = await bcrypt.hash(req.body.password, 10);

      const user = await User.create({
         ...req.body,
         password: hashPassword,
      });
      if (!user) {
         return res.status(401).json({
            message: `Form error: Create a new user failed`,
         });
      }

      const refreshToken = jwt.sign({ _id: user._id }, process.env.SERECT_REFRESHTOKEN_KEY, {
         expiresIn: '1d',
      });

      const accessToken = jwt.sign({ _id: user._id }, process.env.SERECT_ACCESSTOKEN_KEY, {
         expiresIn: '5m',
      });

      res.cookie('accessToken', accessToken, {
         secure: true,
         // domain: process.env.DOMAIN,
         expires: new Date(Date.now() + 5 * 60 * 1000),
      });
      res.cookie('refreshToken', refreshToken, {
         secure: true,
         // domain: process.env.DOMAIN,
         expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      user.password = undefined;
      return res.json({
         accessToken,
         expires: 10 * 60 * 1000,
         data: user,
      });
   } catch (error) {
      return res.status(500).json({
         message: `Form error: ${error.message}`,
      });
   }
};

export const signIn = async (req, res) => {
   try {
      const { error } = signinSchema.validate(req.body, { abortEarly: false });

      if (error) {
         return res.status(500).json({
            message: `Form error: ${error.details[0].message}`,
         });
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
         return res.status(404).json({
            message: `Form error: Email not exist`,
         });
      }

      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) {
         return res.status(400).json({
            message: `Form error: Passwords do not match`,
         });
      }

      if (!user) {
         return res.status(401).json({
            message: `Form error: Create a new user failed`,
         });
      }
      const refreshToken = jwt.sign({ _id: user._id }, process.env.SERECT_REFRESHTOKEN_KEY, {
         expiresIn: '1d',
      });

      const accessToken = jwt.sign({ _id: user._id }, process.env.SERECT_ACCESSTOKEN_KEY, {
         expiresIn: '5m',
      });
      res.cookie('accessToken', accessToken, {
         secure: true,
         // domain: process.env.DOMAIN,
         expires: new Date(Date.now() + 5 * 60 * 1000),
      });
      res.cookie('refreshToken', refreshToken, {
         secure: true,
         // domain: process.env.DOMAIN,
         expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      user.password = undefined;
      return res.json({
         accessToken,
         expires: 10 * 60 * 1000,
         data: user,
      });
   } catch (error) {
      return res.status(500).json({
         message: `Form error: ${error.message}`,
      });
   }
};

export const redirect = (req, res) => {
   res.cookie('accessToken', req.user?.accessToken, {
      secure: true,
      // domain: process.env.DOMAIN,
      expires: new Date(Date.now() + 60 * 1000),
   });
   res.cookie('refreshToken', req.user?.refreshToken, {
      secure: true,
      // domain: process.env.DOMAIN,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
   });
   // Successful authentication, redirect success.
   res.redirect('http://localhost:5173/');
};

export const refresh = async (req, res) => {
   try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
         return res.status(200).json({
            accessToken: '',
            data: {},
         });
      }
      jwt.verify(refreshToken, process.env.SERECT_REFRESHTOKEN_KEY, async (err, decode) => {
         if (err) {
            return res.status(400).json({
               message: `Form error: ${err}`,
            });
         } else {
            const user = await User.findById(decode._id);
            if (!user) {
               return res.status(400).json({
                  message: `Form error: not found account`,
               });
            }
            const accessToken = jwt.sign({ _id: user._id }, process.env.SERECT_ACCESSTOKEN_KEY, {
               expiresIn: '1m',
            });
            return res.status(200).json({
               accessToken,
               expires: 10 * 60 * 1000,
               data: user,
            });
         }
      });
   } catch (error) {
      return res.status(500).json({
         message: `Form error: ${error.message}`,
      });
   }
};

export const clearToken = async (req, res) => {
   try {
      const token = req.cookies.refreshToken;
      if (!token) {
         return res.status(404).json({
            message: `Form error: No token available`,
         });
      }

      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      return res.status(500).json({
         message: `Token has been cleared`,
      });
   } catch (error) {
      return res.status(500).json({
         message: `Form error: ${error.message}`,
      });
   }
};

// export const createProduct = async (req, res) => {
//    try {
//       const { error } = singupSchema.validate(req.body, { abortEarly: false });
//       if (error) {
//          return res.status(401).json({
//             message: error.details.map((error) => error.message),
//          });
//       }

//       const product = await User.create(req.body);
//       await Category.findByIdAndUpdate(product.categoryId, {
//          $push: { productId: product._id },
//       });

//       return res.status(201).json({
//          message: 'Create product successfully',
//          product,
//       });
//    } catch (error) {
//       return res.status(400).json({
//          message: error.message,
//       });
//    }
// };

export const updateUser = async (req, res) => {
   try {
      const { error } = userSchema.validate(req.body, { abortEarly: false });
      if (error) {
         return res.status(403).json({
            message: error.details.map((error) => error.message),
         });
      }
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.findByIdAndUpdate(req.params.id, { ...req.body, password: hashPassword });

      return res.status(201).json({
         message: 'Update user successfully',
         user,
      });
   } catch (error) {
      return res.status(400).json({
         message: error.message,
      });
   }
};

export const getOneUser = async (req, res) => {
   try {
      const user = await User.findById(req.params.id);
      return res.status(201).json({
         message: 'Get user successfully',
         user,
      });
   } catch (error) {
      return res.status(400).json({
         message: error.message,
      });
   }
};
export const removeUser = async (req, res) => {
   try {
      // Tìm và lấy thông tin sản phẩm cần xóa
      // const product = await User.findById(req.params.id);

      // Xóa sản phẩm
      await User.findByIdAndDelete(req.params.id);

      return res.status(201).json({
         message: 'Remove user successfully',
      });
   } catch (error) {
      return res.status(400).json({
         message: error.message,
      });
   }
};
