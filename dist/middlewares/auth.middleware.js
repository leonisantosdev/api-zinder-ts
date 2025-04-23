"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var JWT_SECRET = process.env.JWT_SECRET;
var validToken = function (req, res, next) {
    try {
        var token = req.headers.authorization;
        if (!token) {
            res.status(401).send({ message: "Acesso negado" });
            return;
        }
        jsonwebtoken_1.default.verify(token.replace('Bearer ', ''), JWT_SECRET);
        next();
    }
    catch (error) {
        res.status(401).send({ message: "Token inválido" });
        return;
    }
    ;
};
exports.validToken = validToken;
