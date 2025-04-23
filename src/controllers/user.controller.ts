import { Request, Response } from "express";
import { userSubsetSchema, loginUserSchema } from "../schemas/user.schema";
import { UserServices } from '../services/user.service';
import { verifyPassword } from "../utils/hashPassword";
import { z } from 'zod';
import { AuthService } from "../services/auth.service";

export class UserController {
  static createUser = async (req: Request, res: Response) => {
    try {
      const userData = userSubsetSchema.parse(req.body);

      await UserServices.createUserService(userData);
      
      res.status(201).send({ message: "Usuário cadastrado!" });
    } catch (err) {
      if(err instanceof z.ZodError) {
        const message =  err.errors[0]?.message || "Erro de validação, verifique os dados enviados."
        res.status(400).send({ message });
        return;
      };
  
      res.status(500).send({ error: "Erro interno no servidor" });
    };
  };

  static getUsers = async (req: Request, res: Response) => {
    try {
      const users = await UserServices.findAll();

      res.send(users)

    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuários" });
    };
  };
  
  static findById = async (req: Request, res: Response) => {
    try {
      const publicId = Number(req.params.id);

      const user = await UserServices.findByIdService(publicId);

      if(!user) {
        res.status(400).send({ message: "Usuário não encontrado" });
      }

      res.status(200).send(user);
    } catch (error) {
      res.status(500).send("Erro interno do servidor");
    };
  };

  static updateUser = async (req: Request, res: Response) => {
    try {
      const publicId = Number(req.params.id);
      const userData = userSubsetSchema.parse(req.body);

      if(!await UserServices.findByIdService(publicId)) {
        res.status(404).send({ message: "Usuário não encontrado" });
        return;
      }

      await UserServices.updateUserById(publicId, userData);
      res.status(201).send("Usuário atualizado.");
      return; 
    } catch (error) {
      console.log(error);
    };
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = loginUserSchema.parse(req.body);

      const user = await AuthService.verifyEmail(email);

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      };

      const isMatch = await verifyPassword(password, user?.password);

      if (!isMatch) {
        res.status(400).json({ message: "Senha inválida" });
        return;
      }

      const token = await AuthService.genToken(user.id)

      res.status(200).send({ message: token });
      return;
    } catch (error) {
      res.status(500).json({ error });
      return;
    };
  };
};