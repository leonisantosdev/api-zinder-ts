import type { UserSubsetTask } from '../schemas/user.schema.js';
import { prisma } from '../config/prisma/prismaConfig.js';

export class AdmServices {
  async findRole(userId: UserSubsetTask['id']) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    return user?.role ?? null;
  }
}
