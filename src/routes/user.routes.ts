import express from 'express';
import { UserController } from '../controllers/user.controller';
import { validToken } from '../middlewares/auth.middleware';

const route = express.Router();
const userControler = new UserController();

// Cria um usuário
route.post('/register', userControler.createUser);

// Rota para verificar o email do usuário
route.get('/verify-email', userControler.verifyEmail)

// Rota para logar os usuários
route.post('/login', userControler.login);

// Lista todos os usuários (ROTA PRIVADA)
route.get('/', validToken, userControler.getUsers);

// Lista um usuário pela publicId
route.get('/:id', validToken, userControler.findById);

// Atualiza um usuário pelo publicId
route.patch('/:id', validToken, userControler.updateUser);

// Recupera a senha do usuário
route.post('/recover-password', userControler.forgotPassword);

export default route;