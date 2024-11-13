"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_handler_1 = require("src/utils/response-handler");
const success_type_enum_1 = require("@shared/enums/success-type.enum");
const error_type_enum_1 = require("@shared/enums/error-type.enum");
const logger_1 = __importDefault(require("src/utils/logger"));
const env_1 = require("@config/env");
const prisma = new client_1.PrismaClient();
const register = async (req, res) => {
    const { username: usuario, email: correo, name: nombre, lastname: apell_paterno, second_lastname: apell_materno, password: contrasena } = req.body;
    const findUser = await prisma.usuario.findUnique({
        where: {
            correo,
        },
    });
    if (findUser) {
        return (0, response_handler_1.errorResponse)(res, 'El correo ya está registrado', error_type_enum_1.ErrorType.CONFLICT);
    }
    const hashedPassword = await bcryptjs_1.default.hash(contrasena, 10);
    try {
        await prisma.usuario.create({
            data: {
                usuario,
                correo,
                nombre,
                apell_paterno,
                apell_materno,
                contrasena: hashedPassword,
                tipo_usuario: 'USER',
            },
        });
        (0, response_handler_1.successResponse)(res, 'Usuario creado satisfactoriamente', success_type_enum_1.SuccessType.CREATED);
    }
    catch (error) {
        logger_1.default.error('Error al crear el usuario', error);
        (0, response_handler_1.errorResponse)(res, 'Error al crear el usuario');
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.usuario.findUnique({
            where: { correo: email },
        });
        if (!user) {
            return (0, response_handler_1.errorResponse)(res, 'Credenciales incorrectas', error_type_enum_1.ErrorType.BAD_REQUEST);
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.contrasena);
        if (!isPasswordValid) {
            return (0, response_handler_1.errorResponse)(res, 'Credenciales incorrectas', error_type_enum_1.ErrorType.BAD_REQUEST);
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.tipo_usuario }, env_1.JWT_SECRET, { expiresIn: '1d' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.tipo_usuario }, env_1.JWT_SECRET, { expiresIn: '7d' });
        (0, response_handler_1.successResponse)(res, 'Inicio de sesión exitoso', success_type_enum_1.SuccessType.OK, { token, user, refreshToken });
    }
    catch (error) {
        logger_1.default.error('Error al iniciar sesión', error);
        (0, response_handler_1.errorResponse)(res, 'Error al iniciar sesión');
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.JWT_SECRET);
        const user = await prisma.usuario.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            return (0, response_handler_1.errorResponse)(res, 'Usuario no encontrado', error_type_enum_1.ErrorType.NOT_FOUND);
        }
        const newToken = jsonwebtoken_1.default.sign({ userId: decoded.userId, role: user.tipo_usuario }, env_1.JWT_SECRET, { expiresIn: '1d' });
        const newRefreshToken = jsonwebtoken_1.default.sign({ userId: decoded.userId, role: user.tipo_usuario }, env_1.JWT_SECRET, { expiresIn: '7d' });
        (0, response_handler_1.successResponse)(res, 'Token refrescado exitosamente', success_type_enum_1.SuccessType.OK, { token: newToken, refreshToken: newRefreshToken });
    }
    catch (error) {
        logger_1.default.error('Error al actualizar el token', error);
        (0, response_handler_1.errorResponse)(res, 'Error al actualizar el token');
    }
};
exports.refreshToken = refreshToken;
