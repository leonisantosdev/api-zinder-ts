import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';

// Configuração do cors para requisições web
const corsConfig = {
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  // credentials: true,
};

const app: Application = express();
app.use(express.json());
app.use(cors(corsConfig));

// Rota dos Usuários
app.use('/user', userRoutes);


// Rota da HOME para acesso primário
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: "Route HOME"
   });
});

// Roda o servidor
app.listen(3333, () => {
  console.log(`
Server running in
URL: http://localhost:3333
`);
});