"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var user_routes_1 = __importDefault(require("./routes/user.routes"));
// Configuração do cors para requisições web
var corsConfig = {
    origin: "http:/localhost:5050",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
};
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsConfig));
// Rota dos Usuários
app.use('/user', user_routes_1.default);
// Rota da HOME para acesso primário
app.get('/', function (req, res) {
    res.json({
        message: "Route HOME"
    });
});
// Roda o servidor
app.listen(3333, function () {
    console.log("\nServer running in\nURL: http://localhost:3333\n");
});
