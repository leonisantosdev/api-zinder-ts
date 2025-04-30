import { Request, Response } from "express";
import { userSubsetSchema, loginUserSchema } from "../schemas/user.schema";
import { UserServices } from '../services/user.service';
import { AuthService } from "../services/auth.service";
import { z } from 'zod';
import { logger } from "../config/winston/logger";

const authService: AuthService = new AuthService();
const userService = new UserServices();

export class UserController {
  async createUser (req: Request, res: Response) {
    try {
      const userData = userSubsetSchema.parse(req.body);
      logger.info(`Pegando dados: ${userData.email} - ${userData.name} - ${userData.password} - ${userData.confirmPassword}`)

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if(!passwordRegex.test(userData.password)) {
        res.status(400).send({ message: "A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial." });
        return;
      }
      logger.info('Passou no regex')

      if(userData.password !== userData.confirmPassword) {
        res.status(400).send({ message: "As senhas não conferem." });
        return;
      }
      logger.info('Passou no confirmPassword')

      const verifyToken = await userService.createUserService(userData);
      logger.info(`Token para verificar email: ${verifyToken}`)

      await userService.sendVerificationEmail(userData.email, verifyToken);
      logger.info(`Conta criada com sucesso e email enviado para ${userData.email}`)
      logger.info('========================================================================')

      res.status(201).send({ message: "Usuário cadastrado! Verifique seu email." });
    } catch (err) {
      if(err instanceof z.ZodError) {
        const message =  err.errors[0]?.message || "Erro de validação, verifique os dados enviados."
        res.status(400).send({ message });
        return;
      };
      
      res.status(409).send({ error: "Email já está em uso, por favor tente novamente." });
    };
  };

  async verifyEmail (req: Request, res: Response) {
    try {
      const { token } = req.query;
      console.log(token)

      const user = await userService.findByToken(token as string)
      console.log(user)
      if(!user) {
        res.status(400).send({ message: "Token inválido ou expirado." });
        return;
      }
  
      await userService.userUpdateByToken(user.id);
  
      res.status(200).send({ message: "E-mail verificado com sucesso! Agora você pode fazer login." });
    } catch(error) {

    }
  }

  async getUsers (req: Request, res: Response) {
    try {
      const users = await userService.findAllUsers();

      res.send(users);

    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuários" });
    };
  };

  async findById (req: Request, res: Response) {
    try {
      const publicId = Number(req.params.id);

      const user = await userService.findByIdService(publicId);

      if(!user) {
        res.status(400).send({ message: "Usuário não encontrado" });
      }

      res.status(200).send(user);
    } catch (error) {
      res.status(500).send("Erro interno do servidor");
    };
  };

  async updateUser (req: Request, res: Response) {
    try {
      const publicId = Number(req.params.id);
      const userData = userSubsetSchema.parse(req.body);

      if(!await userService.findByIdService(publicId)) {
        res.status(404).send({ message: "Usuário não encontrado" });
        return;
      }

      await userService.updateUserById(publicId, userData);
      res.status(201).send("Usuário atualizado.");
      return; 
    } catch (error) {
      console.log(error);
    };
  };

  async login (req: Request, res: Response) {
    try {
      const { email, password } = loginUserSchema.parse(req.body);
      const token = await authService.authLogin({ email, password });

      res.status(200).send({ token }); 
      return;
    } catch (error) {
      res.status(500).json({ error });
      return;
    };
  };
};