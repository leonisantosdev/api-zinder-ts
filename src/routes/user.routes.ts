import express from 'express';
import { UserController } from '../controllers/user.controller';
import { validToken } from '../middlewares/auth.middleware';

const route = express.Router();
const userControler = new UserController();

// Cria um usuário
route.post('/register', userControler.createUser);

// Lista todos os usuários
route.get('/', validToken, userControler.getUsers);

// Lista um usuário pela publicId
route.get('/:id', userControler.findById);

// Atualiza um usuário pelo publicId
route.patch('/:id', userControler.updateUser);

// Rota para logar os usuários
route.post('/login', userControler.login);

export default route;