import { prisma } from '../config/prisma/prismaConfig.js';
import jwt from 'jsonwebtoken';
import type { loginUser } from '../schemas/user.schema.js';
import { verifyPassword } from '../utils/hashPassword.js';

export class AuthService {
  async authLogin({ email, password }: loginUser) {
    const user = await this.verifyEmail(email);

    if (!user) {
      throw new Error('Invalid email');
    }

    const isMatch = await verifyPassword(password, user.password);
    console.log(isMatch)


    if (!isMatch) {
      throw new Error('Invalid Password');
    }

    const emailVerified = await this.isValidEmail(email);

    if (!emailVerified) {
      throw new Error('Email Not Authorized');
    }

    const token = this.genToken(user.id);
    return token;
  }

  async verifyEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  private genToken(id: string) {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.log('Erro na JWT_SECRET, provavelmente undefined.');
      throw new Error('Erro interno no servidor!');
    }

    return jwt.sign({ id: id }, JWT_SECRET, { expiresIn: '1d' });
  }

  async isValidEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { isEmailVerified: true },
    });

    return user?.isEmailVerified || false;
  }
}
