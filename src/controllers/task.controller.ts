import { taskCreateSchema } from "../schemas/task.schema";
import { Request, Response } from "express";
import { TaskServices } from "../services/task.service";
import { User } from "@prisma/client";

const taskService = new TaskServices();

export class TaskController {
  async createTask(req: Request, res: Response) {
    try {
      const taskData = taskCreateSchema.parse(req.body);

      if(!req.user) {
        throw new Error("Usuário não encontrado	");
      }

      const userData = req.user;

      taskService.createTaskService(taskData, userData as unknown as User);
      
      res.status(201).json({ message: "Tarefa criada com sucesso" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
      return;
    }
  };

  async getAllTasks (req: Request, res: Response) {
    try {
      const userId = req.user;
      
      if(!userId) {
        throw new Error("Usuário não encontrado");
      }

      const tasks = await taskService.findAllTasks(userId);

      res.status(200).send(tasks);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar tasks" });
    };
  };

  async getTaskById (req: Request, res: Response) {
    try {
      const { id } = req.query;
      console.log(`ID recebido: ${id}`);

      res.status(200).send(id);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar task" });
    }
  }
};