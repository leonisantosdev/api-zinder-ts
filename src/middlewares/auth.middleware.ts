import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!

export const validToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
  
    if(!token) {
      res.status(401).send({ message: "Acesso negado" });
      return;
    }
    
    jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    next();

  } catch (error) {
    res.status(401).send({ message: "Token inválido" });
    return;
  };
}