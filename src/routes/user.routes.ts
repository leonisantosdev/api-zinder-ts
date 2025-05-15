import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { validToken } from '../middlewares/auth.middleware.js';

const route = express.Router();
const userController = new UserController();

// Cria um usuário
route.post('/register', userController.createUser);

// Rota para verificar o email do usuário
route.get('/verify-email', userController.verifyEmail);

// Rota para logar os usuários
route.post('/login', userController.login);

// Lista todos os usuários (ROTA PRIVADA)
route.get('/', validToken, userController.getUsers);

// Lista um usuário pela publicId
route.get('/publicId/:id', validToken, userController.findByPublicId);

// Rota para listar os dados do usuário pelo ID (UUID/ROTA PRIVADA)
route.get('/profile', validToken, userController.userProfileData)

// Rota para redefinir a senha que o usuário esqueceu
route.patch('/forgot-change-password', userController.forgotChangePassword);

// Atualiza um usuário pelo publicId
route.patch('/:id', validToken, userController.updateUser);

// Rota para enviar email para redefinição de senha do usuário
route.post('/send-email-forgot-password', userController.forgotPassword);

export default route;
