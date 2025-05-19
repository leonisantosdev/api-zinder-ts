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

      await userService.sendVerificationEmail(userData.name, userData.email, verifyToken);

      res.status(201).json({ message: 'Usuário cadastrado! Verifique seu e-mail.' });
    } catch (error) {
      const messageTypeError = (error as Error).message;

      switch (messageTypeError) {
        case 'Invalid Regex Password':
          res.status(400).json({ message: 'A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, e um caractere especial.' });
          break;
        case 'Duplicated Email':
          res.status(409).json({ message: 'E-mail já cadastrado. Tente novamente com outro e-mail.' });
          break;
        default:
          res.status(500).json({ message: 'Erro interno no servidor! Tente novamente.' });
          break;
      }
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.query;

      const verifyToken = await userService.findByToken(token);
      console.log(verifyToken);

      if (!verifyToken) {
        res.redirect(`${process.env.FRONT_URL}/login?error=tokenExpired`);
        return;
      }

      await userService.userUpdateByToken(verifyToken.user.id);

      res.redirect(`${process.env.FRONT_URL}/login?emailVerified=true`);
    } catch (error) {
      const message = (error as Error).message || 'Erro interno do servidor.';

      res.status(500).json({ message });
      return;
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

  async findByPublicId(req: Request, res: Response) {
    try {
      const publicId = Number(req.params.id);

      const user = await userService.findByPublicIdService(publicId);

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

      if (!(await userService.findByPublicIdService(publicId))) {
        res.status(404).send({ message: 'Usuário não encontrado' });
        return;
      }

      await userService.updateUserPublicById(publicId, userData);
      res.status(201).send('Usuário atualizado.');
      return;
    } catch (error) {
      const message = (error as Error).message || 'Erro interno do servidor.';

      res.status(500).json({ message });
      return;
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginUserSchema.parse(req.body);

      const token = await authService.authLogin({ email, password });

      res.status(200).send({ token });
      return;
    } catch (error) {
      const messageTypeError = (error as Error).message;

      switch (messageTypeError) {
        case 'Invalid Password':
          res.status(400).json({ message: 'Senha ou e-mail inválidos.' });
          break;
        case 'Invalid Email':
          res.status(400).json({ message: 'Senha ou email inválidos.' });
          break;
        case 'Email Not Authorized':
          res.status(403).json({ message: 'Confirme seu e-mail antes de fazer login.' });
          break;
        default:
          res.status(500).json({ message: 'Erro interno no servidor! Tente novamente.' });
          break;
      }
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body as { email: string };

      await userService.sendEmailToChangePassword(email);

      res.status(200).send({ message: 'Verifique seu e-mail para redefinir sua senha!' });
    } catch (error) {
      const messageTypeError = (error as Error).message;

      switch (messageTypeError) {
        case 'Invalid Email User Forgot':
          res.status(400).json({ message: 'Nenhum usuário encontrado com esse e-mail. Tente novamente.' });
          break;
        default:
          res.status(500).json({ message: 'Erro interno no servidor.' });
          break;
      }
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
      const messageTypeError = (error as Error).message;

      switch (messageTypeError) {
        case 'Invalid Token or User':
          res.status(400).json({ message: 'Token inválido ou usuário não encontrado.' });
          break;
        case 'Invalid Regex Password':
          res.status(400).json({ message: 'A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, e um caractere especial.' });
          break;
        default:
          res.status(500).json({ message: 'Erro interno no servidor.' });
          break;
      }
      return;
    }
  }

  async userProfileData(req: Request, res: Response) {
    try {
      const userId = req.user;

      if (!userId) {
        console.error('userId ausente no req.user após validação do token.');
        throw new Error('Invalid UserId In Req');
      }

      const user = await userService.findByInternalIdService(userId);

      res.status(200).send(user);
    } catch (error) {
      const messageTypeError = (error as Error).message;

      switch (messageTypeError) {
        case 'Invalid UserId In Req':
          res.status(401).json({ message: 'Falha no login! Tente novamente.' })
          break;
        default:
          res.status(500).json({ message: 'Erro interno no servidor! Tente novamente.' })
          break;
      }
    }
  }

  // async resendEmailConfirmation(req: Request, res: Response) => {
    
  // }
}
