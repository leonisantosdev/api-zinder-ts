import type { Application } from 'express';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import tokenRoutes from './routes/token.routes.js';

const app: Application = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: false,
}));

app.use(express.json());

// ROTAS GERAIS
app.use('/user', userRoutes);
app.use('/task', taskRoutes);
app.use('/token', tokenRoutes)

// Roda o servidor
app.listen(3333, () => {
  console.log(`
Server running in
URL: https://apizinder.up.railway.app
`);
});