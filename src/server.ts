import express, { type Application } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import tokenRoutes from './routes/token.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import './config/env/env.js';

const app: Application = express();
app.use(
  cors({
    origin: `${process.env.FRONT_URL}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: false,
  })
);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Zinder',
    version: '1.0.0',
    description: 'Documentação da API Zinder',
  },
  servers: [
    {
      url: process.env.API_URL || 'http://localhost:3333',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use(express.json());

// ROTAS GERAIS
app.use('/user', userRoutes);
app.use('/task', taskRoutes);
app.use('/token', tokenRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Roda o servidor
app.listen(process.env.PORT || 3333, () => {
  console.log(`
Server running in
URL: ${process.env.API_URL}
Docs: ${process.env.API_URL || 'http://localhost:3333'}/docs
`);
});