import { prisma } from '../config/prisma/prismaConfig';
import { hashPassword } from '../utils/hashPassword';
import { UserSubset } from '../schemas/user.schema';
import { number } from '../utils/randomNumber';

export class UserServices {
  async createUserService ({ name, email, password }: UserSubset) {
    const hashedPassword = await hashPassword(password);

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
      }
      });
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
};
