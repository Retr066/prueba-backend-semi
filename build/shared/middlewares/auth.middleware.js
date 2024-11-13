"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const env_1 = require("@config/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_handler_1 = require("src/utils/response-handler");
const error_type_enum_1 = require("@shared/enums/error-type.enum");
const logger_1 = __importDefault(require("src/utils/logger"));
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return (0, response_handler_1.errorResponse)(res, 'Token no proporcionado', error_type_enum_1.ErrorType.UNAUTHORIZED);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_1.default.error('Error al verificar el token', error);
        return (0, response_handler_1.errorResponse)(res, 'Token inválido', error_type_enum_1.ErrorType.UNAUTHORIZED);
    }
};
exports.authMiddleware = authMiddleware;
