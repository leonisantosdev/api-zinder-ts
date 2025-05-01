import { nativeEnum, z } from 'zod';
import { transformName } from '../utils/transformName';
import { Gender, Role } from '@prisma/client';

export const UserSchema = z.object({
  id: z.string().uuid(),
  publicId: z.number().int().nonnegative(),
  username: z.string().min(5, "O nome de usuário deve ter no mínimo 5 caracteres"),
  name: z.string().min(3, {message: 'O nome deve ter no mínimo 3 caracteres'}).transform(transformName),
  email: z.string().email({message: 'O email deve ter o formato padrão example@gmail.com'}),
  password: z.string().min(8, {message: 'A senha deve ter no mínimo 8 caracteres'}),
  confirmPassword: z.string().min(8, {message: 'As senhas não conferem'}),
  profilePictureUrl: z.string().url().optional().nullable(),
  birthDate: z.coerce.date().optional().nullable(),
  gender: nativeEnum(Gender).optional().nullable(),
  isActive: z.boolean().default(true),
  role: nativeEnum(Role),
  isEmailVerified: z.boolean(),
  verifyToken: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  lastLogin: z.coerce.date().optional().nullable()
});

export const userSubsetSchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
  confirmPassword: true,
});

export type UserSubset = z.infer<typeof userSubsetSchema>;

export const loginUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha inválida'),
});

export type loginUser = z.infer<typeof loginUserSchema>;

export const userSubsetTaskSchema = UserSchema.pick({
  id: true,
  username: true,
  name: true,
  email: true,
  role: true,
});

export type UserSubsetTask = z.infer<typeof userSubsetTaskSchema>