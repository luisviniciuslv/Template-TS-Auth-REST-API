import nodemailer from 'nodemailer';
import { EMAIL_ADRESS, PASSWORD_EMAIL_ADRESS } from '../constants/email';

export const sendEmail = (email: string, code: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_ADRESS,
      pass: PASSWORD_EMAIL_ADRESS
    }
  });

  const mailOptions = {
    from: EMAIL_ADRESS,
    to: email,
    subject: 'Seu código para criação de conta',
    text: `Seu código para criar conta é: ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return false;
    } else {
      return info;
    }
  });
};
