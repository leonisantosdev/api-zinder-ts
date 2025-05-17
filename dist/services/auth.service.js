import { prisma } from '../config/prisma/prismaConfig.js';
import jwt from 'jsonwebtoken';
import { verifyPassword } from '../utils/hashPassword.js';
export class AuthService {
    async authLogin({ email, password }) {
        const user = await this.verifyEmail(email);
        if (!user) {
            throw new Error('Senha ou e-mail inválido.');
        }
        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) {
            throw new Error('Senha ou e-mail inválido.');
        }
        const emailVerified = await this.isValidEmail(email);
        if (!emailVerified) {
            throw new Error('Por favor, verifique seu e-mail antes de fazer login.');
        }
        const token = this.genToken(user.id);
        return token;
    }
    async verifyEmail(email) {
        return await prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    genToken(id) {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.log('Erro na JWT_SECRET, provavelmente undefined.');
            throw new Error('Erro interno no servidor!');
        }
        return jwt.sign({ id: id }, JWT_SECRET, { expiresIn: '1d' });
    }
    async isValidEmail(email) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { isEmailVerified: true },
        });
        return (user === null || user === void 0 ? void 0 : user.isEmailVerified) || false;
    }
}
