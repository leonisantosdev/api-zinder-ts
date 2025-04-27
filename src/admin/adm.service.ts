import { UserSubsetTask } from '../schemas/user.schema'
import { prisma } from '../config/prisma/prismaConfig'

export class AdmServices {
  async findRole(userId: UserSubsetTask['id']) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        role: true
      }
    })

    return user?.role ?? null;
  }
}