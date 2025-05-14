import { taskCreateSchema } from '../schemas/task.schema.js';
import type { Request, Response } from 'express';
import { TaskServices } from '../services/task.service.js';
import { AdmServices } from '../admin/adm.service.js';

const taskService = new TaskServices();
const admService = new AdmServices();

export class TaskController {
  async createTask(req: Request, res: Response) {
    try {
      const taskData = taskCreateSchema.parse(req.body);
      // console.log(taskData)

      if (!req.user) {
        throw new Error('Usuário não encontrado	');
      }

      const userData = req.user;

      await taskService.createTaskService(taskData, userData);

      res.status(201).json({ message: 'Tarefa criada com sucesso' });
    } catch (error) {
      // console.log(error)
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async getAllTasks(req: Request, res: Response) {
    try {
      const userId = req.user;

      if (!userId) {
        throw new Error('Usuário não encontrado');
      }

      const tasks = await taskService.findAllTasks(userId);
      res.status(200).send(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar tasks' });
    }
  }

  async getTaskById(req: Request, res: Response) {
    try {
      const { id } = req.query;

      res.status(200).send(id);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar task' });
    }
  }
}
