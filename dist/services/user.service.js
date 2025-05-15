import { prisma } from '../config/prisma/prismaConfig.js';
import { hashPassword } from '../utils/hashPassword.js';
import { v4 as uuidv4 } from 'uuid';
import { getTransporter } from '../utils/sendEmailUser.js';
import { addMinutes } from 'date-fns';
import { generateShortUUIDUsername } from '../utils/randomShortName.js';
export class UserServices {
    async createUserService({ name, email, password }) {
        const hashedPassword = await hashPassword(password);
        const emailVerifyToken = uuidv4();
        let username = generateShortUUIDUsername();
        const userExists = await this.findUserByEmail(email);
        if (userExists) {
            throw new Error('E-mail já cadastrado. Tente novamente com outro e-mail.');
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
                verifyToken: emailVerifyToken,
            },
        });
        return emailVerifyToken;
    }
    async sendVerificationEmail(name, email, token) {
        const transporter = getTransporter();
        const url = `${process.env.API_URL}/user/verify-email?token=${token}`;
        const mailOptions = {
            from: `"Equipe Zinder" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `🎉 Bem-vindo(a) à Zinder – Confirme sua conta!`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; background-color: #f9f9fb; border-radius: 12px; box-shadow: 0 3px 12px rgba(30, 35, 59, 0.15); color: #333;">
          <h1 style="text-align: center; font-size: 28px; margin-bottom: 0;">Olá, ${name}!</h1>
          <h2 style="text-align: center; font-size: 22px; margin-top: 5px; color: #1e233b;">Seja bem-vindo(a) à Zinder! 🚀</h2>

          <p style="font-size: 16px; line-height: 1.6; margin: 30px 0; text-align: center; color: #555;">
            Estamos muito felizes em ter você conosco.  
            Você está a um passo de transformar o fluxo de trabalho da sua empresa. ✨
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" target="_blank" style="
              background-color:#1e233b;
              color: #fff;
              text-decoration: none;
              padding: 14px 36px;
              border-radius: 8px;
              font-size: 18px;
              font-weight: 700;
              display: inline-block;
              box-shadow: 0 4px 12px rgba(30,35,59,0.3);
              transition: background-color 0.3s ease;
            " onmouseover="this.style.backgroundColor='#2c3350'" onmouseout="this.style.backgroundColor='#1e233b'">
              Confirmar Conta
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0;" />

          <div style="text-align: left;">
            <h3 style="color: #1e233b; font-size: 20px; margin-bottom: 10px;">O que o Zinder pode fazer pela sua empresa? 💼</h3>
            <ul style="color: #555; font-size: 16px; line-height: 1.8; padding-left: 20px; margin-top: 10px;">
              <li>📋 <strong>Organização total de processos:</strong> centralize tarefas, comunicações e prazos.</li>
              <li>📊 <strong>Gestão clara e eficiente:</strong> acompanhe o progresso das equipes e elimine gargalos.</li>
              <li>🤝 <strong>Colaboração sem ruído:</strong> sua equipe sempre conectada e alinhada.</li>
              <li>🔒 <strong>Segurança e controle:</strong> seus dados protegidos com criptografia.</li>
            </ul>

            <p style="margin-top: 20px; color: #555; font-size: 16px;">
              O Zinder foi feito para empresas que buscam mais eficiência, clareza e produtividade no dia a dia.  
              Comece agora a otimizar sua operação com as ferramentas certas!
            </p>
          </div>

          <p style="color: #888; font-size: 14px; margin-top: 40px; text-align: center;">
            Se você não criou uma conta, basta ignorar este e-mail. ❌
          </p>

          <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 14px; color: #aaa; margin: 0;">Abraços,</p>
            <p style="font-size: 14px; color: #aaa; margin: 0;">Equipe Zinder 💙</p>
          </footer>
        </div>
      `,
        };
        await transporter.sendMail(mailOptions);
    }
    async findByToken(token) {
        const user = await prisma.user.findFirst({
            where: {
                verifyToken: token,
            },
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
            },
        });
    }
    async findByPublicIdService(publicId) {
        return await prisma.user.findUnique({
            where: {
                publicId,
            },
            select: {
                publicId: true,
                name: true,
                email: true,
            },
        });
    }
    async updateUserPublicById(publicId, { name, email, password }) {
        const hashedPassword = await hashPassword(password);
        await prisma.user.update({
            where: {
                publicId,
            },
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
    }
    async sendEmailToChangePassword(email) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error('Nenhum usuário encontrado com esse e-mail. Tente novamente.');
        }
        const token = uuidv4();
        const expiresAt = addMinutes(new Date(), 3);
        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt,
            },
        });
        const transporter = getTransporter();
        const url = `${process.env.FRONT_URL}/forgot-change-password?token=${token}`;
        const mailOptions = {
            from: `"Equipe Zinder" ${process.env.EMAIL_USER}`,
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
    `,
        };
        await transporter.sendMail(mailOptions);
    }
    async findUserByEmail(email) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user;
    }
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
            data: { used: true },
        });
    }
    async findByInternalIdService(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                publicId: true,
                name: true,
                username: true,
                email: true,
                profilePictureUrl: true,
                birthDate: true,
                gender: true,
                role: true,
                createdAt: true,
                isActive: true,
                isEmailVerified: true,
                lastLogin: true,
            },
        });
        return user;
    }
}
