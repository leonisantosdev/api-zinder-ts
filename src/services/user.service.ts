import { prisma } from '../config/prisma/prismaConfig';
import { hashPassword } from '../utils/hashPassword';
import { UserSubset } from '../schemas/user.schema';
import { number } from '../utils/randomNumber';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

export class UserServices {
  async createUserService ({ name, email, password }: UserSubset) {
    const hashedPassword = await hashPassword(password);
    const emailVerifyToken = uuidv4();

    const username = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/\s+/g, '.')
    .toLowerCase() + number;''
    
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

      return emailVerifyToken
  };

  async sendVerificationEmail (email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: `${process.env.SERVICE}`,
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASSWORD}`
      }
    })

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: email, 
      subject: `Verificação de E-mail`,
      text: `
Clique no link para verificar sua conta:

${process.env.BASE_URL}/verify-email?token=${token}`
    };

    await transporter.sendMail(mailOptions)
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
