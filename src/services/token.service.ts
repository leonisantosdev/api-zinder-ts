import { prisma } from '../config/prisma/prismaConfig.js';

export class TokenServices {
  async validateTokenReset(token: string) {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new Error('Token inválido');
    }

    if (resetToken.expiresAt < new Date() || resetToken.used === true) {
      throw new Error('Token expirado.');
    }
  }
}
