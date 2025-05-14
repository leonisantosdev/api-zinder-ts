import { prisma } from '../config/prisma/prismaConfig.js'
import type { TaskSubset } from '../schemas/task.schema.js'


export class TaskServices {
  async createTaskService({ title, description, priority, type, status }: TaskSubset, userId: string) {
  
  await prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      type,
      user: {
        connect: { id: userId }
      },
      createdBy: {
        connect: { id: userId }
      }
    }
  });

  };

  async findAllTasks (id: string): Promise<object> {
    return await prisma.task.findMany({
      where: {
        userId: id
      },
      select: {
        title: true,
        description: true,
        status: true,
        priority: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            email: true,
            username: true,
          },
        },
        createdBy: {
          select: {
            email: true,
            username: true,
          },
        },
      }
    });
  };
}