
import { prisma } from '../config/prisma/prismaConfig'
import { TaskSubset } from '../schemas/task.schema'
import { UserSubsetTask } from '../schemas/user.schema'

export class TaskServices {
  async createTaskService({ title, description, priority, type, status }: TaskSubset, user: any) {
    
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
    })
  }
}