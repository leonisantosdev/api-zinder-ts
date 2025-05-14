import { prisma } from '../config/prisma/prismaConfig.js';
import { hashPassword } from '../utils/hashPassword.js';
import { generateRandomNumber } from '../utils/randomNumber.js';
import { v4 as uuidv4 } from 'uuid';
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
            .toLowerCase() + generateRandomNumber();
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
    ;
    async sendVerificationEmail(email, token) {
        const transporter = getTransporter();
        const url = `front-end-zinder-production.up.railway.app/user/verify-email?token=${token}`;
        const mailOptions = {
            from: `${process.env.EMAIL_USER}`,
            to: email,
            subject: `Verificação de E-mail`,
            html: `
      <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: 0 auto; padding: 20px; background-color:rgb(241, 241, 241); border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Bem-vindo(a) à Zinder!</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          Para verificar seu e-mail, clique no botão abaixo. 
          O processo é rápido e garante a segurança da sua conta.
        </p>
        <a href="${url}" target="_blank" style="
          display: inline-block;
          padding: 14px 30px;
          background-color: #4f46e5;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
          margin-top: 20px;
          transition: background-color 0.3s ease;
        ">
          Verificar E-mail
        </a>
        <p style="color: #777; font-size: 14px; margin-top: 24px;">
          Se você não criou uma conta, pode ignorar este e-mail.
        </p>
      </div>
      <footer style="font-family: Arial, sans-serif; text-align: center; font-size: 12px; color: #999; margin-top: 40px;">
        <p>© ${new Date().getFullYear()} Zinder. Todos os direitos reservados.</p>
      </footer>
    `
        };
        await transporter.sendMail(mailOptions);
    }
    ;
    async findByToken(token) {
        const user = await prisma.user.findFirst({
            where: {
                verifyToken: token
            }
        });
        return user;
    }
    ;
    async userUpdateByToken(userId) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                isEmailVerified: true,
                verifyToken: null,
            },
        });
    }
    ;
    async findAllUsers() {
        return await prisma.user.findMany({
            select: {
                username: true,
                name: true,
                email: true,
            }
        });
    }
    ;
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
    ;
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
    ;
    async sendEmailToChangePassword(email) {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw new Error("Nenhum usuário encontrado com esse e-mail. Tente novamente.");
        }
        ;
        const token = uuidv4();
        const expiresAt = addMinutes(new Date(), 3);
        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt,
            }
        });
        const transporter = getTransporter();
        const url = `http://localhost:5173/forgot-change-password?token=${token}`;
        const mailOptions = {
            from: `${process.env.EMAIL_USER}`,
            to: email,
            subject: `Redefinição de Senha`,
            html: `
      <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: 0 auto; padding: 20px; background-color: rgb(241, 241, 241); border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Redefinição de senha!</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          Para redefinir sua senha, clique no botão abaixo. 
          O processo é rápido e garante a segurança da sua conta.
        </p>
        <a href="${url}" target="_blank" style="
          display: inline-block;
          padding: 14px 30px;
          background-color: #4f46e5;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
          margin-top: 20px;
          transition: background-color 0.3s ease;
        ">
          Redefinir Senha
        </a>
        <p style="color: #777; font-size: 14px; margin-top: 24px;">
          Se você não solicitou uma redefinição de senha, pode ignorar este e-mail.
        </p>
      </div>
      <footer style="font-family: Arial, sans-serif; text-align: center; font-size: 12px; color: #999; margin-top: 40px;">
        <p>© ${new Date().getFullYear()} Zinder. Todos os direitos reservados.</p>
      </footer>
    `
        };
        await transporter.sendMail(mailOptions);
    }
    ;
    async findUserByEmail(email) {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        return user;
    }
    ;
    async updateNewPasswordUser(newPassword, token) {
        const hashedPassword = await hashPassword(newPassword);
        const resetToken = await prisma.passwordResetToken.findFirst({
            where: { token },
            include: { user: true },
        });
        if (!resetToken || !resetToken.user || (resetToken === null || resetToken === void 0 ? void 0 : resetToken.used)) {
            throw new Error('Token inválido ou usuário não encontrado.');
        }
        await prisma.user.update({
            where: { id: resetToken.user.id },
            data: { password: hashedPassword },
        });
        await prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { used: true }
        });
    }
}
;
