import express from 'express';
import { UserController } from '../controllers/user.controller';
import { validToken } from '../middlewares/auth.middleware';

const route = express.Router();

// Cria um usuário
route.post('/register', UserController.createUser);

// Lista todos os usuários
route.get('/',validToken, UserController.getUsers);

// Lista um usuário pela publicId
route.get('/:id', UserController.findById);

// Atualiza um usuário pelo publicId
route.patch('/:id', UserController.updateUser);

// Rota para logar os usuários
route.post('/login', UserController.login);
export default route;

 // CRUD

 // CREATE
 // READ
 // UPDATE
 // DELETE