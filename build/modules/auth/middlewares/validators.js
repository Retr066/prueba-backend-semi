"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegister = [
    (0, express_validator_1.body)('username').isString().notEmpty().withMessage('El usuario es requerido'),
    (0, express_validator_1.body)('email').isEmail().withMessage('El correo debe ser válido'),
    (0, express_validator_1.body)('name').isString().notEmpty().withMessage('El nombre es requerido'),
    (0, express_validator_1.body)('lastname').isString().notEmpty().withMessage('El apellido paterno es requerido'),
    (0, express_validator_1.body)('second_lastname').isString().notEmpty().withMessage('El apellido materno es requerido'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().withMessage('El correo debe ser válido'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
