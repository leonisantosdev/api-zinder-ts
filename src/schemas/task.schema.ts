import { Priority, Status } from '@prisma/client';
import { nativeEnum, z } from 'zod';

export const TaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'O título deve conter no mínimo 1 caracter'),
  description: z.string().optional().nullable(),
  status: nativeEnum(Status).default('pending'),
  priority: nativeEnum(Priority).default('low'),
  type: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  completedAt: z.coerce.date().optional().nullable(),
  userId: z.string(),
  createdById: z.string(),
  updatedById: z.string().optional(),
});

export const taskCreateSchema = TaskSchema.pick({
  title: true,
  description: true,
  status: true,
  priority: true,
  type: true,
});

export type TaskSubset = z.infer<typeof taskCreateSchema>;
