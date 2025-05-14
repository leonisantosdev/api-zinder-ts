import type { Request, Response } from 'express';
import { TokenServices } from '../services/token.service.js';

const tokenService = new TokenServices();

export class TokenController {
  async validateTokenUserForgotPassword(req: Request, res: Response) {
    try {
      const { token } = req.body as { token: string };

      await tokenService.validateTokenReset(token);

      res.status(200).json({ message: "Token válido" });
    } catch (error) {
      if (error instanceof Error && error.message === "Token inválido") {
        res.status(401).json({ message: "Token inválido" });
        return;
      }

      if (error instanceof Error && error.message === "Token expirado.") {
        res.status(401).json({ message: "Token expirado" });
        return;
      }

      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}