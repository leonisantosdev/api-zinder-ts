import express from 'express';
// import { UserController } from '../controllers/user.controller';
// import { validToken } from '../middlewares/auth.middleware';
import { TaskController } from '../controllers/task.controller';
import { validToken } from '../middlewares/auth.middleware';

const route = express.Router();
const taskController = new TaskController();

// Cria uma tarefa
route.post('/create', validToken ,taskController.createTask );

// // Lista todas as tarefas
// route.get('/', validToken, userControler.getUsers);

// // Lista uma tarefa pelo publicId
// route.get('/:id', userControler.findById);

// // Lista todas as tarefas pelo username do usuário
// route.get('/:username', userControler.findById);

// // Atualiza uma tarefa pela id  
// route.patch('/:id', userControler.updateUser);

// Deleta uma tarefa pelo vinculada a um usuário pelo id // ADM ou USER(OWNER TASK)
// route.delete('')

// Deleta todas as tarefas vinculadas a um usuario // ADM ou USER(OWNER TASK)
// route.delete('')

export default route;