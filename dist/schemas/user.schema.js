"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.userSubsetSchema = exports.UserSchema = exports.RoleEnum = exports.GenderEnum = void 0;
var zod_1 = require("zod");
exports.GenderEnum = zod_1.z.enum(['MALE', 'FEMALE', 'OTHER']);
exports.RoleEnum = zod_1.z.enum(['USER', 'ADMIN']);
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    publicId: zod_1.z.number().int().nonnegative(),
    name: zod_1.z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres' }),
    email: zod_1.z.string().email({ message: 'O email deve ter o formato padrão example@gmail.com' }),
    password: zod_1.z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    profilePictureUrl: zod_1.z.string().url().optional().nullable(),
    birthDate: zod_1.z.coerce.date().optional().nullable(),
    gender: exports.GenderEnum.optional().nullable(),
    isActive: zod_1.z.boolean().default(true),
    role: exports.RoleEnum.default('USER'),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
    lastLogin: zod_1.z.coerce.date().optional().nullable()
});
exports.userSubsetSchema = exports.UserSchema.pick({
    name: true,
    email: true,
    password: true
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(6, 'Senha inválida'),
});
