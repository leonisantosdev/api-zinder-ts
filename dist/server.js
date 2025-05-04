import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import taskRoute from './routes/task.routes.js';
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: false,
}));
app.use(express.json());
// Rota dos Usuários
app.use('/user', userRoutes);
app.use('/task', taskRoute);
// Roda o servidor
app.listen(3333, () => {
    console.log(`
Server running in
URL: http://localhost:3333
`);
});
