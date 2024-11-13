"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const error_type_enum_1 = require("@shared/enums/error-type.enum");
const response_handler_1 = require("src/utils/response-handler");
const adminMiddleware = (req, res, next) => {
    console.log(req.user);
    if (!req.user || req.user.role !== 'ADMIN') {
        return (0, response_handler_1.errorResponse)(res, 'No tienes permiso para realizar esta acción', error_type_enum_1.ErrorType.FORBIDDEN);
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
