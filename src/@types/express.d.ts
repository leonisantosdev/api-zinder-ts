import { User } from './models/User'; // Ajuste o caminho conforme seu modelo de User

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        username: string,
        name: string;
        email: string;
        role: string;
      };
    }
  }
}
