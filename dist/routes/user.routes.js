"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_controller_1 = require("../controllers/user.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var route = express_1.default.Router();
var userControler = new user_controller_1.UserController();
// Cria um usuário
route.post('/register', userControler.createUser);
// Rota para logar os usuários
route.post('/login', userControler.login);
// Lista todos os usuários (ROTA PRIVADA)
route.get('/', auth_middleware_1.validToken, userControler.getUsers);
// Lista um usuário pela publicId
route.get('/:id', auth_middleware_1.validToken, userControler.findById);
// Atualiza um usuário pelo publicId
route.patch('/:id', auth_middleware_1.validToken, userControler.updateUser);
exports.default = route;
