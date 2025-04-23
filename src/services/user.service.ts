import { prisma } from '../config/prisma/prismaConfig';
import { hashPassword } from '../utils/hashPassword';
import { UserSubset } from '../schemas/user.schema'

export class UserServices {
  static createUserService = async ({ name, email, password }: UserSubset) => {
    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });
  };
  
  static findAll = async (): Promise<object> => {
    return await prisma.user.findMany({
      select: {
        name: true,
        email: true,
      }
    });
  };
  
  static findByIdService  = async (publicId: number) => {
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
  }

  static updateUserById = async (publicId: number, { name, email, password }: UserSubset) => {
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

