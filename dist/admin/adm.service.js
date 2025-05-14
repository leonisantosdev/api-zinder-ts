import { prisma } from '../config/prisma/prismaConfig.js';
export class AdmServices {
    async findRole(userId) {
        var _a;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                role: true,
            },
        });
        return (_a = user === null || user === void 0 ? void 0 : user.role) !== null && _a !== void 0 ? _a : null;
    }
}
