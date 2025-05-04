import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> | undefined

export const getTransporter = () => {
  if(transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: `${process.env.SERVICE_GMAIL}`,
    auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_PASSWORD}`
    }
  });

  return transporter;
};
