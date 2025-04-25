import { prisma } from '../config/prisma/prismaConfig';
import jwt from 'jsonwebtoken';
import { assert } from "console";
import { loginUser } from '../schemas/user.schema';
import { verifyPassword } from '../utils/hashPassword';

const JWT_SECRET = process.env.JWT_SECRET!;
assert(JWT_SECRET);

export class AuthService {
  async authLogin ({email, password}: loginUser) {
    const user = await this.verifyEmail(email);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    };

    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      throw new Error("Usuário não encontrado.");
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
}