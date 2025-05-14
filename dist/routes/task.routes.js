import express from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { validToken } from '../middlewares/auth.middleware.js';
const route = express.Router();
const taskController = new TaskController();
// Cria uma tarefa (ROTA PRIVADA)
route.post('/create', validToken, taskController.createTask);
// Lista todas as tarefas do respectivo usuário (ROTA PRIVADA)
route.get('/listAll', validToken, taskController.getAllTasks);
// Lista uma tarefa pelo publicId (ROTA PRIVADA )
// E a tarefa que será lista deve ser somente do usuário logado
// para listagem de tarefas de outros usuários deve ser concedida uma permissão de visualização do outro usuário
// route.get('/', taskController.getTasks);
// // Lista todas as tarefas pelo username do usuário
// route.get('/:username', userControler.findById);
// // Atualiza uma tarefa pela id
// route.patch('/:id', userControler.updateUser);
// Deleta uma tarefa pelo vinculada a um usuário pelo id // ADM ou USER(OWNER TASK)
// route.delete('')
// Deleta todas as tarefas vinculadas a um usuario // ADM ou USER(OWNER TASK)
// route.delete('')
export default route;
