import { userSubsetSchema, loginUserSchema } from '../schemas/user.schema.js';
import { UserServices } from '../services/user.service.js';
import { AuthService } from '../services/auth.service.js';
import { z } from 'zod';
import { passwordRegexValidation } from '../utils/regexPassword.js';
const authService = new AuthService();
const userService = new UserServices();
export class UserController {
    async createUser(req, res) {
        var _a;
        try {
            const userData = userSubsetSchema.parse(req.body);
            passwordRegexValidation(userData.password);
            const verifyToken = await userService.createUserService(userData);
            await userService.sendVerificationEmail(userData.name, userData.email, verifyToken);
            res.status(201).json({ message: 'Usuário cadastrado! Verifique seu e-mail.' });
        }
        catch (err) {
            if (err instanceof z.ZodError) {
                const message = ((_a = err.errors[0]) === null || _a === void 0 ? void 0 : _a.message) ||
                    'Erro de validação, verifique os dados enviados.';
                res.status(400).json({ message });
                return;
            }
            const message = err.message || 'Erro interno do servidor.';
            res.status(500).json({ message });
        }
    }
    async verifyEmail(req, res) {
        try {
            const { token } = req.query;
            const user = await userService.findByToken(token);
            if (!user) {
                res.status(400).send({ message: 'Token inválido ou expirado.' });
                return;
            }
            await userService.userUpdateByToken(user.id);
            res.redirect(`${process.env.FRONT_URL}/login?emailVerified=true`);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getUsers(req, res) {
        try {
            const users = await userService.findAllUsers();
            res.send(users);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    }
    async findByPublicId(req, res) {
        try {
            const publicId = Number(req.params.id);
            const user = await userService.findByPublicIdService(publicId);
            if (!user) {
                res.status(400).send({ message: 'Usuário não encontrado' });
            }
            res.status(200).send(user);
        }
        catch (error) {
            res.status(500).send('Erro interno do servidor');
        }
    }
    async updateUser(req, res) {
        try {
            const publicId = Number(req.params.id);
            const userData = userSubsetSchema.parse(req.body);
            if (!(await userService.findByPublicIdService(publicId))) {
                res.status(404).send({ message: 'Usuário não encontrado' });
                return;
            }
            await userService.updateUserPublicById(publicId, userData);
            res.status(201).send('Usuário atualizado.');
            return;
        }
        catch (error) {
            console.log(error);
        }
    }
    async login(req, res) {
        try {
            const { email, password } = loginUserSchema.parse(req.body);
            const token = await authService.authLogin({ email, password });
            res.status(200).send({ token });
            return;
        }
        catch (error) {
            const message = error.message || 'Erro interno do servidor.';
            res.status(500).json({ message });
            return;
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            await userService.sendEmailToChangePassword(email);
            res
                .status(200)
                .send({ message: 'Verifique seu e-mail para redefinir sua senha!' });
        }
        catch (err) {
            const message = err.message || 'Erro interno do servidor.';
            res.status(500).json({ message });
        }
    }
    async forgotChangePassword(req, res) {
        try {
            const { password, token } = req.body;
            passwordRegexValidation(password);
            await userService.updateNewPasswordUser(password, token);
            res.status(200).send({ message: 'Senha redefinida com sucesso!' });
        }
        catch (error) {
            const message = error.message || 'Erro interno do servidor.';
            res.status(500).json({ message });
            return;
        }
    }
    async userProfileData(req, res) {
        try {
            const userId = req.user;
            if (!userId) {
                console.error('userId ausente no req.user após validação do token.');
                throw new Error('Erro interno no servidor! Tente novamente.');
            }
            const user = await userService.findByInternalIdService(userId);
            res.status(200).send(user);
        }
        catch (error) {
            console.log(error);
        }
    }
}
