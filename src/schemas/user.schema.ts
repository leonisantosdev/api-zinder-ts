import { z } from 'zod';

export const GenderEnum = z.enum(['MALE', 'FEMALE', 'OTHER']);
export const RoleEnum = z.enum(['USER', 'ADMIN']);

export const UserSchema = z.object({
  id: z.string().uuid(),
  publicId: z.number().int().nonnegative(),
  name: z.string().min(3, {message: 'O nome deve ter no mínimo 3 caracteres'}),
  email: z.string().email({message: 'O email deve ter o formato padrão example@gmail.com'}),
  password: z.string().min(6, {message: 'A senha deve ter no mínimo 6 caracteres'}),
  profilePictureUrl: z.string().url().optional().nullable(),
  birthDate: z.coerce.date().optional().nullable(),
  gender: GenderEnum.optional().nullable(),
  isActive: z.boolean().default(true),
  role: RoleEnum.default('USER'),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  lastLogin: z.coerce.date().optional().nullable()
});

export const userSubsetSchema = UserSchema.pick({
  name: true,
  email: true,
  password: true
})

export type UserSubset = z.infer<typeof userSubsetSchema>;

export const loginUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha inválida'),
});