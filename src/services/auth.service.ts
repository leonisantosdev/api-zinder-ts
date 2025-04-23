import { prisma } from '../config/prisma/prismaConfig';
import jwt from 'jsonwebtoken';
import { assert } from "console";

const JWT_SECRET = process.env.JWT_SECRET!;
assert(JWT_SECRET);

export class AuthService {
  static verifyEmail = async (email: string) => {
    return await prisma.user.findUnique({
      where: {
        email
      }
    });
  };

  static genToken = async (id: string) => {
    return jwt.sign(
      { id: id },
        JWT_SECRET,
      { expiresIn: '1d' }
    );
  }
}