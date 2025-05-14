import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | undefined;

export const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: process.env.SERVICE_GMAIL,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  return transporter;
};
