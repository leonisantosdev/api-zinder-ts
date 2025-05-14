import express from 'express';
import { TokenController } from '../controllers/token.controller.js';
const route = express.Router();
const tokenController = new TokenController();
// Valida o token de redefinição de senha para que não seja acessada por qualquer usuário(ROTA PRIVADA)
route.post('/validate-forgot-password-token', tokenController.validateTokenUserForgotPassword);
export default route;
