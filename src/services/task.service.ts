import type { User } from '@prisma/client';
import { prisma } from '../config/prisma/prismaConfig.js'
import type { TaskSubset } from '../schemas/task.schema.js'


export class TaskServices {
  async createTaskService({ title, description, priority, type, status }: TaskSubset, user: User) {
    
  await prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      type,
      user: {
        connect: { id: user.id }
      },
      createdBy: {
        connect: { id: user.id }
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