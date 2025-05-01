import { Request, Response } from "express";
import { userSubsetSchema, loginUserSchema } from "../schemas/user.schema";
import { UserServices } from '../services/user.service';
import { AuthService } from "../services/auth.service";
import { z } from 'zod';
import { logger } from "../config/winston/logger";
import { passwordRegexValidation } from "../utils/regexPassword";

const authService: AuthService = new AuthService();
const userService = new UserServices();

export class UserController {
  async createUser (req: Request, res: Response) {
    try {
      const userData = userSubsetSchema.parse(req.body);

      passwordRegexValidation(userData);

      const verifyToken = await userService.createUserService(userData);

      await userService.sendVerificationEmail(userData.email, verifyToken);

      res.status(201).json({ message: "Usuário cadastrado! Verifique seu email." });
    } catch (err) {
      if(err instanceof z.ZodError) {
        const message =  err.errors[0]?.message || "Erro de validação, verifique os dados enviados."
        res.status(400).json({ message });
        return;
      };
      
      const message = (err as Error).message || "Erro interno do servidor.";
      res.status(500).json({ message });
    };
  };

  async verifyEmail (req: Request, res: Response) {
    try {
      const { token } = req.query;

      const user = await userService.findByToken(token as string);

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
      const message  = (error as Error).message || "Erro interno do servidor.";

      res.status(500).json({ message });
      return;
    };
  };
};