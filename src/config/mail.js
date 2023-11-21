import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
      user: 'vulinh0905203@gmail.com',
      pass: 'szvxbdqykdeicwpk',
      // s z v x b d q y k d e i c w p k
   },
   authMethod: 'PLAIN',
});
