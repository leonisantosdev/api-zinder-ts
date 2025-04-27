"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var task_controller_1 = require("../controllers/task.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var route = express_1.default.Router();
var taskController = new task_controller_1.TaskController();
// Cria uma tarefa (ROTA PRIVADA)
route.post('/create', auth_middleware_1.validToken, taskController.createTask);
// Lista todas as tarefas do respectivo usuário (ROTA PRIVADA)
route.get('/listAll', auth_middleware_1.validToken, taskController.getAllTasks);
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
exports.default = route;
