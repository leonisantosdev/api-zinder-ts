import { prisma } from '../config/prisma/prismaConfig';
import jwt from 'jsonwebtoken';
import { assert, error } from "console";
import { loginUser } from '../schemas/user.schema';
import { verifyPassword } from '../utils/hashPassword';

const JWT_SECRET = process.env.JWT_SECRET!;
assert(JWT_SECRET);

export class AuthService {
  async authLogin ({email, password}: loginUser) {
    const user = await this.verifyEmail(email);

    if (!user) {
      throw new Error("Senha ou e-mail inválido.");
    };

    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      throw new Error("Senha ou e-mail inválido.");
    };

    const emailVerified = await this.isValidEmail(email);

    if (!emailVerified) {
      throw new Error("Por favor, verifique seu e-mail antes de fazer login.");
    };

    const token = this.genToken(user.id);
    return token;
  };

  async verifyEmail (email: string) {
      return await prisma.user.findUnique({
        where: {
          email
        }
      });
  };

  private genToken (id: string) {
    return jwt.sign(
      { id: id },
        JWT_SECRET,
      { expiresIn: '1d' },
    );
  };

  async isValidEmail (email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { isEmailVerified: true }
    });

    return user?.isEmailVerified || false;
  }
}