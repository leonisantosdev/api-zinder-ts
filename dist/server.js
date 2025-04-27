"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var user_routes_1 = __importDefault(require("./routes/user.routes"));
var task_routes_1 = __importDefault(require("./routes/task.routes"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: false,
}));
app.use(express_1.default.json());
// Rota dos Usuários
app.use('/user', user_routes_1.default);
app.use('/task', task_routes_1.default);
// Roda o servidor
app.listen(3333, function () {
    console.log("\nServer running in\nURL: http://localhost:3333\n");
});
