"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsersSecond = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("@utils/logger"));
const response_handler_1 = require("@utils/response-handler");
const error_type_enum_1 = require("@shared/enums/error-type.enum");
const success_type_enum_1 = require("@shared/enums/success-type.enum");
const validators_1 = require("../middlewares/validators");
const prisma = new client_1.PrismaClient();
const getUsers = async (req, res) => {
    const { page = 1, limit = 10, sort = 'id', order = 'asc', search = '', filter = {} } = req.query;
    console.log(req.query);
    const offset = (Number(page) - 1) * Number(limit);
    try {
        const validFilterFields = ['tipo_usuario'];
        const parsedFilter = typeof filter === 'string' ? JSON.parse(filter) : {};
        const validatedFilter = (0, validators_1.validateFilter)(parsedFilter, validFilterFields);
        const searchTerms = search.split(' ').map(term => term.trim());
        const users = await prisma.usuario.findMany({
            skip: offset,
            take: Number(limit),
            orderBy: {
                [sort]: order,
            },
            where: {
                AND: searchTerms.map(term => ({
                    OR: [
                        { nombre: { contains: term } },
                        { apell_paterno: { contains: term } },
                        { apell_materno: { contains: term } },
                    ],
                })),
                ...validatedFilter,
            },
        });
        const totalUsers = await prisma.usuario.count({
            where: {
                AND: searchTerms.map(term => ({
                    OR: [
                        { nombre: { contains: term } },
                        { apell_paterno: { contains: term } },
                        { apell_materno: { contains: term } },
                    ],
                })),
                ...validatedFilter,
            },
        });
        (0, response_handler_1.successResponse)(res, 'Usuarios obtenidos exitosamente', success_type_enum_1.SuccessType.OK, { users, totalUsers });
    }
    catch (error) {
        logger_1.default.error(`Error obteniendo usuarios:`, error);
        (0, response_handler_1.errorResponse)(res, 'Error obteniendo usuarios');
    }
};
exports.getUsers = getUsers;
const getUsersSecond = async (req, res) => {
    const { page = 1, limit = 10, sort = 'id', order = 'asc', search = '', filter = '{}' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    try {
        const validFilterFields = ['id', 'usuario', 'tipo_usuario'];
        const parsedFilter = typeof filter === 'string' ? JSON.parse(filter) : {};
        const validatedFilter = (0, validators_1.validateFilter)(parsedFilter, validFilterFields);
        const users = await prisma.usuario.findMany({
            skip: offset,
            take: Number(limit),
            orderBy: {
                [sort]: order,
            },
            where: {
                OR: [
                    {
                        usuario: {
                            contains: search,
                        },
                    },
                    {
                        tipo_usuario: {
                            contains: search,
                        },
                    },
                ],
                ...validatedFilter,
            },
        });
        const totalUsers = await prisma.usuario.count({
            where: {
                OR: [
                    {
                        usuario: {
                            contains: search,
                        },
                    },
                    {
                        tipo_usuario: {
                            contains: search,
                        },
                    },
                ],
                ...validatedFilter,
            },
        });
        (0, response_handler_1.successResponse)(res, 'Usuarios obtenidos exitosamente', success_type_enum_1.SuccessType.OK, { users, totalUsers });
    }
    catch (error) {
        logger_1.default.error(`Error obteniendo usuarios:`, error);
        (0, response_handler_1.errorResponse)(res, 'Error obteniendo usuarios');
    }
};
exports.getUsersSecond = getUsersSecond;
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.usuario.findUnique({
            where: { id: Number(id) },
        });
        if (!user) {
            return (0, response_handler_1.errorResponse)(res, 'Usuario no encontrado', error_type_enum_1.ErrorType.NOT_FOUND);
        }
        (0, response_handler_1.successResponse)(res, 'Usuario obtenido exitosamente', success_type_enum_1.SuccessType.OK, user);
    }
    catch (error) {
        logger_1.default.error(`Error obteniendo usuario: `, error);
        (0, response_handler_1.errorResponse)(res, 'Error obteniendo usuario');
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { usuario, correo, nombre, apell_paterno, apell_materno, tipo_usuario } = req.body;
    try {
        const updatedUser = await prisma.usuario.update({
            where: { id: Number(id) },
            data: {
                usuario,
                correo,
                nombre,
                apell_paterno,
                apell_materno,
                tipo_usuario,
            },
        });
        (0, response_handler_1.successResponse)(res, 'Usuario actualizado exitosamente', success_type_enum_1.SuccessType.OK, updatedUser);
    }
    catch (error) {
        logger_1.default.error(`Error actualizando usuario:`, error);
        (0, response_handler_1.errorResponse)(res, 'Error actualizando usuario');
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.usuario.delete({
            where: { id: Number(id) },
        });
        (0, response_handler_1.successResponse)(res, 'Usuario eliminado exitosamente', success_type_enum_1.SuccessType.OK);
    }
    catch (error) {
        logger_1.default.error(`Error eliminando usuario:`, error);
        (0, response_handler_1.errorResponse)(res, 'Error eliminando usuario');
    }
};
exports.deleteUser = deleteUser;
