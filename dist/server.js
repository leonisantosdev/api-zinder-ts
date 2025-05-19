import express from 'express';
import './config/env/env.js';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import tokenRoutes from './routes/token.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json' with { type: 'json' };
const app = express();
app.use(cors({
    origin: `${process.env.FRONT_URL}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: false,
}));
app.use(express.json());
// ROTAS GERAIS
app.use('/user', userRoutes);
app.use('/task', taskRoutes);
app.use('/token', tokenRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Roda o servidor
app.listen(process.env.PORT || 3333, () => {
    console.log(`
Server running in
URL: ${process.env.API_URL}
Docs: ${process.env.API_URL || 'http://localhost:3333'}/docs
`);
});
