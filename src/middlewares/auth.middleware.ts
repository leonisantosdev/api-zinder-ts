import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const validToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).send({ message: 'Acesso negado' });
      return;
    }

    const { id } = jwt.verify(token, JWT_SECRET) as { id: string; iat: number; exp: number };

    req.user = id
    next();
  } catch (error) {
    res.status(401).send({ message: 'Token inválido ou expirado' });
    return;
  }
};
