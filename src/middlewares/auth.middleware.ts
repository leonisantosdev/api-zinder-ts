import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const validToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)

    if (!token) {
      res.status(401).send({ message: 'Acesso negado' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string, name: string, email: string, role: string }; 

    req.user = decoded;
    next();
    
  } catch (error) {
    res.status(401).send({ message: 'Token inválido' });
    return;
  }
};
