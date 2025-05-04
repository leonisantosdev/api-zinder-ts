import { prisma } from '../config/prisma/prismaConfig';
import { hashPassword } from '../utils/hashPassword';
import { UserSubset } from '../schemas/user.schema';
import { number } from '../utils/randomNumber';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { msgUserEmail } from '../utils/msgEmailValidation';
import { logger } from '../config/winston/logger';
import { getTransporter } from '../utils/sendEmailUser';
import { addMinutes } from 'date-fns';

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
    const transporter = getTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: email, 
      subject: `Verificação de E-mail`,
      text: msgUserEmail({route: '/verify-email', token: token, msg: 'Para verificar seu e-mail, clique no link abaixo:'}),};

    await transporter.sendMail(mailOptions);
  };

  async findByToken (token: string) {
    const user = await prisma.user.findFirst({
      where: {
        verifyToken: token as string
      }
    });

    return user;
  };

  async userUpdateByToken (userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        verifyToken: null,
      },
    })
  };

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

  async sendEmailToChangePassword (email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    console.log(user)

    if (!user) {
      throw new Error("Nenhum usuário encontrado com esse e-mail. Tente novamente.");
    };

    const token = uuidv4();
    const expiresAt = addMinutes(new Date(), 15);

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      }
    })

    const transporter = getTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: email, 
      subject: `Recuperação de Senha`,
      text: msgUserEmail({route: '/change-password', token: token, msg: 'Para redefinir sua senha, clique no link abaixo:'})
      };

    await transporter.sendMail(mailOptions);
  };
};
