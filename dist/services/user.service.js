import { prisma } from '../config/prisma/prismaConfig.js';
import { hashPassword } from '../utils/hashPassword.js';
import { number } from '../utils/randomNumber.js';
import { v4 as uuidv4 } from 'uuid';
import { msgUserEmail } from '../utils/msgEmailValidation.js';
import { getTransporter } from '../utils/sendEmailUser.js';
import { addMinutes } from 'date-fns';
export class UserServices {
    async createUserService({ name, email, password }) {
        const hashedPassword = await hashPassword(password);
        const emailVerifyToken = uuidv4();
        const username = name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '.')
            .toLowerCase() + number;
        '';
        const userExists = await this.findUserByEmail(email);
        if (userExists) {
            throw new Error("E-mail já cadastrado. Tente novamente com outro e-mail.");
        }
        await prisma.user.create({
            data: {
                username,
                name,
                email,
                password: hashedPassword,
                role: 'user',
                isActive: true,
                isEmailVerified: false,
                verifyToken: emailVerifyToken
            }
        });
        return emailVerifyToken;
    }
    
    async sendVerificationEmail(email, token) {
        const transporter = getTransporter();
        const mailOptions = {
            from: `${process.env.EMAIL_USER}`,
            to: email,
            subject: `Verificação de E-mail`,
            text: msgUserEmail({ route: '/verify-email', token: token, msg: 'Para verificar seu e-mail, clique no link abaixo:' }),
        };
        
        await transporter.sendMail(mailOptions);
    }
    
    async findByToken(token) {
        const user = await prisma.user.findFirst({
            where: {
                verifyToken: token
            }
        });
        return user;
    }
    
    async userUpdateByToken(userId) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                isEmailVerified: true,
                verifyToken: null,
            },
        });
    }
    
    async findAllUsers() {
        return await prisma.user.findMany({
            select: {
                username: true,
                name: true,
                email: true,
            }
        });
    }
    
    async findByIdService(publicId) {
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
    
    async updateUserById(publicId, { name, email, password }) {
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
    }
    
    async sendEmailToChangePassword(email) {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        console.log(user);
        if (!user) {
            throw new Error("Nenhum usuário encontrado com esse e-mail. Tente novamente.");
        }
        ;
        const token = uuidv4();
        const expiresAt = addMinutes(new Date(), 15);
        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt,
            }
        });
        const transporter = getTransporter();
        const mailOptions = {
            from: `${process.env.EMAIL_USER}`,
            to: email,
            subject: `Recuperação de Senha`,
            text: msgUserEmail({ route: '/change-password', token: token, msg: 'Para redefinir sua senha, clique no link abaixo:' })
        };
        await transporter.sendMail(mailOptions);
    }
    
    async findUserByEmail(email) {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        return user;
    }
}
;
