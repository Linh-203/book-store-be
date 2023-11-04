import User from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const authentication = async (req, res, next) => {
   try {
      if (!req.headers.authorization) {
         return res.status(401).json({
            message: 'Please log in !',
         });
      }
      const rfToken = req.cookies.refreshToken;
      const accessToken = req.headers.authorization.split(' ')[1];
      // console.log(token);
      jwt.verify(rfToken, process.env.SERECT_REFRESHTOKEN_KEY, async (err, payload) => {
         if (err) {
            if (err.name == 'JsonWebTokenError') {
               return res.status(402).json({
                  message: 'Refresh Token is invalid', //rf token ko hợp lệ
               });
            }
            if (err.name == 'TokenExpiredError') {
               return res.status(403).json({
                  message: 'Refresh Token is expired ! Login again please !', //rf token hết hạn
               });
            }
         }
         jwt.verify(accessToken, process.env.SERECT_ACCESSTOKEN_KEY, async (err, payload) => {
            if (err) {
               if (err.name == 'JsonWebTokenError') {
                  return res.status(402).json({
                     message: 'Access Token is invalid', // token ko hợp lệ
                  });
               }
               if (err.name == 'TokenExpiredError') {
                  return res.status(403).json({
                     message: 'Access Token is expired', // token hết hạn
                  });
               }
            }
            const user = await User.findById(payload._id);
            req.user = user;
            // console.log(req.user);
            next();
         });
         // console.log(req.user);
      });
   } catch (error) {
      return res.status(400).json({
         message: error.message,
      });
   }
};
export default authentication;
