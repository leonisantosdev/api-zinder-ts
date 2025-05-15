import type { Request, Response } from 'express';
import { userSubsetSchema, loginUserSchema } from '../schemas/user.schema.js';
import { UserServices } from '../services/user.service.js';
import { AuthService } from '../services/auth.service.js';
import { z } from 'zod';
import { passwordRegexValidation } from '../utils/regexPassword.js';

const authService: AuthService = new AuthService();
const userService = new UserServices();

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const userData = userSubsetSchema.parse(req.body);

      passwordRegexValidation(userData.password);

      const verifyToken = await userService.createUserService(userData);

      await userService.sendVerificationEmail(userData.email, verifyToken);

      res
        .status(201)
        .json({ message: 'Usuário cadastrado! Verifique seu e-mail.' });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const message =
          err.errors[0]?.message ||
          'Erro de validação, verifique os dados enviados.';
        res.status(400).json({ message });
        return;
      }

      const message = (err as Error).message || 'Erro interno do servidor.';
      res.status(500).json({ message });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.query;
      // console.log(token);

      const user = await userService.findByToken(token as string);
      // console.log(user);

      if (!user) {
        res.status(400).send({ message: 'Token inválido ou expirado.' });
        return;
      }

      await userService.userUpdateByToken(user.id);

      res.redirect(`${process.env.FRONT_URL}/login?emailVerified=true`);
    } catch (error) {
      console.log(error);
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await userService.findAllUsers();

      res.send(users);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const publicId = Number(req.params.id);

      const user = await userService.findByIdService(publicId);

      if (!user) {
        res.status(400).send({ message: 'Usuário não encontrado' });
      }

      res.status(200).send(user);
    } catch (error) {
      res.status(500).send('Erro interno do servidor');
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const publicId = Number(req.params.id);
      const userData = userSubsetSchema.parse(req.body);

      if (!(await userService.findByIdService(publicId))) {
        res.status(404).send({ message: 'Usuário não encontrado' });
        return;
      }

      await userService.updateUserById(publicId, userData);
      res.status(201).send('Usuário atualizado.');
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginUserSchema.parse(req.body);
      
      const token = await authService.authLogin({ email, password });

      res.status(200).send({ token });
      return;
    } catch (error) {
      const message = (error as Error).message || 'Erro interno do servidor.';

      res.status(500).json({ message });
      return;
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body as { email: string };

      await userService.sendEmailToChangePassword(email);

      res
        .status(200)
        .send({ message: 'Verifique seu e-mail para redefinir sua senha!' });
    } catch (err) {
      const message = (err as Error).message || 'Erro interno do servidor.';

      res.status(500).json({ message });
    }
  }

  async forgotChangePassword(req: Request, res: Response) {
    try {
      const { password, token } = req.body as {
        password: string;
        token: string;
      };

      passwordRegexValidation(password);

      await userService.updateNewPasswordUser(password, token);

      res.status(200).send({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
      const message = (error as Error).message || 'Erro interno do servidor.';

      res.status(500).json({ message });
      return;
    }
  }
}
