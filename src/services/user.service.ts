import { prisma } from '../config/prisma/prismaConfig';
import { hashPassword } from '../utils/hashPassword';
import { UserSubset } from '../schemas/user.schema';
import { number } from '../utils/randomNumber';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { msgEmailValidation } from '../utils/msgEmailValidation';
import { logger } from '../config/winston/logger';
import { error } from 'console';

export class UserServices {
  async createUserService ({ name, email, password }: UserSubset) {
    const hashedPassword = await hashPassword(password);
    const emailVerifyToken = uuidv4();

    const username = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/\s+/g, '.')
    .toLowerCase() + number;''
    logger.info(`Criando username: ${username}`)

    await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
        role: 'user',
        isActive: true,
        isEmailVerified: false,
        verifyToken: emailVerifyToken
      }
      });
      logger.info("Conta criada com sucesso!")

      return emailVerifyToken
  };

  async sendVerificationEmail (email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: `${process.env.SERVICE_GMAIL}`,
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASSWORD}`
      }
    });

    logger.info(`Transporter: ${transporter}`);

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: email, 
      subject: `Verificação de E-mail`,
      text: msgEmailValidation(token)
    };

    logger.info(`Transporter: ${mailOptions}`);


    // setTimeout(async () => {
    //   const user = await prisma.user.findFirst({
    //     where: {
    //       email: email,
    //       isEmailVerified: false,
    //     },
    //   });
    
    //   if (user) {
    //     await prisma.user.delete({
    //       where: { id: user.id }
    //     });
    //   }
    // }, 60000);

    // console.log(mailOptions);

    await transporter.sendMail(mailOptions);
  }

  async findByToken (token: string) {
    const user = await prisma.user.findFirst({
      where: {
        verifyToken: token as string
      }
    });

    return user;
  }

  async userUpdateByToken (userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        verifyToken: null,
      },
    })
  }

  async findAllUsers (): Promise<object> {
    return await prisma.user.findMany({
      select: {
        username: true,
        name: true,
        email: true,
      }
    });
  };
  
  async findByIdService (publicId: number) {
    return await prisma.user.findUnique({
      where: {
        publicId 
      },
      select: {
        publicId: true,
        name: true,
        email: true,
      } 
    });
  };

  async updateUserById (publicId: number, { name, email, password }: UserSubset) {
    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: {
        publicId
      },
      data: {
        name,
        email,
        password: hashedPassword
      },
    });
  };
};
