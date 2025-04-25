import { taskCreateSchema } from "../schemas/task.schema";
import { Request, Response } from "express";
import { TaskServices } from "../services/task.service";

const taskService = new TaskServices();

export class TaskController {
  async createTask(req: Request, res: Response) {
    try {
      const taskData = taskCreateSchema.parse(req.body);
      console.log(taskData)
      if(!req.user) {
        throw new Error
      }
      const userData = req.user;
      console.log(userData)

      taskService.createTaskService(taskData, userData);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }
} 