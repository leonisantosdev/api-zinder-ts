"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
var task_schema_1 = require("../schemas/task.schema");
var task_service_1 = require("../services/task.service");
var adm_service_1 = require("../admin/adm.service");
var taskService = new task_service_1.TaskServices();
var admService = new adm_service_1.AdmServices();
var TaskController = /** @class */ (function () {
    function TaskController() {
    }
    TaskController.prototype.createTask = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var taskData, userData;
            return __generator(this, function (_a) {
                try {
                    taskData = task_schema_1.taskCreateSchema.parse(req.body);
                    if (!req.user) {
                        throw new Error("Usuário não encontrado	");
                    }
                    userData = req.user;
                    taskService.createTaskService(taskData, userData);
                    res.status(201).json({ message: "Tarefa criada com sucesso" });
                    return [2 /*return*/];
                }
                catch (error) {
                    res.status(500).json({ message: "Erro interno do servidor" });
                    return [2 /*return*/];
                }
                return [2 /*return*/];
            });
        });
    };
    ;
    TaskController.prototype.getAllTasks = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, tasks, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user;
                        if (!userId) {
                            throw new Error("Usuário não encontrado");
                        }
                        return [4 /*yield*/, taskService.findAllTasks(userId)];
                    case 1:
                        tasks = _a.sent();
                        res.status(200).send(tasks);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        res.status(500).json({ error: "Erro ao buscar tasks" });
                        return [3 /*break*/, 3];
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    TaskController.prototype.getTaskById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                try {
                    id = req.query.id;
                    console.log("ID recebido: ".concat(id));
                    res.status(200).send(id);
                }
                catch (error) {
                    res.status(500).json({ error: "Erro ao buscar task" });
                }
                return [2 /*return*/];
            });
        });
    };
    return TaskController;
}());
exports.TaskController = TaskController;
;
