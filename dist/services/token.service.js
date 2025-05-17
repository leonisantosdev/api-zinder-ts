import { prisma } from '../config/prisma/prismaConfig.js';
import dayjs from 'dayjs';
export class TokenServices {
    async validateTokenReset(token) {
        const resetToken = await prisma.passwordResetToken.findFirst({
            where: { token },
            include: { user: true },
        });
        if (!resetToken) {
            throw new Error('Token inválido');
        }
        if (dayjs(resetToken.expiresAt).isBefore(dayjs()) || resetToken.used === true) {
            throw new Error('Token expirado.');
        }
    }
}
