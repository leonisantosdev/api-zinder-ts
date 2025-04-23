"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_controller_1 = require("../controllers/user.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var route = express_1.default.Router();
// Cria um usuário
route.post('/', user_controller_1.UserController.createUser);
// Lista todos os usuários
route.get('/', auth_middleware_1.validToken, user_controller_1.UserController.getUsers);
// Lista um usuário pela publicId
route.get('/:id', user_controller_1.UserController.findById);
// Atualiza um usuário pelo publicId
route.patch('/:id', user_controller_1.UserController.updateUser);
// Rota para logar os usuários
route.post('/login', user_controller_1.UserController.login);
exports.default = route;
