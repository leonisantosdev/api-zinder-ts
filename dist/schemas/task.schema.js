"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskCreateSchema = exports.TaskSchema = void 0;
var client_1 = require("@prisma/client");
var zod_1 = require("zod");
exports.TaskSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string().min(1, "O título deve conter no mínimo 1 caracter"),
    description: zod_1.z.string().optional().nullable(),
    status: (0, zod_1.nativeEnum)(client_1.Status).default('pending'),
    priority: (0, zod_1.nativeEnum)(client_1.Priority).default('low'),
    type: zod_1.z.string().optional().nullable(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
    completedAt: zod_1.z.coerce.date().optional().nullable(),
    userId: zod_1.z.string(),
    createdById: zod_1.z.string(),
    updatedById: zod_1.z.string().optional(),
});
exports.taskCreateSchema = exports.TaskSchema.pick({
    title: true,
    description: true,
    status: true,
    priority: true,
    type: true,
});
