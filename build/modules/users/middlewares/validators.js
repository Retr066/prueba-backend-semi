"use strict";
// const validFilterFields = ['tipo_usuario', 'correo', 'nombre', 'apell_paterno', 'apell_materno'];
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateUser = exports.validateFilter = void 0;
const user_type_enum_1 = require("@shared/enums/user-type.enum");
const express_validator_1 = require("express-validator");
const validateFilter = (filter, validFilterFields = []) => {
    const validatedFilter = {};
    for (const key in filter) {
        if (validFilterFields.includes(key)) {
            validatedFilter[key] = filter[key];
        }
    }
    return validatedFilter;
};
exports.validateFilter = validateFilter;
exports.validateUpdateUser = [
    (0, express_validator_1.body)('usuario').isString().withMessage('El usuario es requerido').optional(),
    (0, express_validator_1.body)('correo').isEmail().withMessage('El correo debe ser válido').optional(),
    (0, express_validator_1.body)('nombre').isString().withMessage('El nombre es requerido').optional(),
    (0, express_validator_1.body)('apell_paterno').isString().withMessage('El apellido paterno es requerido').optional(),
    (0, express_validator_1.body)('apell_materno').isString().withMessage('El apellido materno es requerido').optional(),
    (0, express_validator_1.body)('tipo_usuario').custom(value => {
        if (!Object.values(user_type_enum_1.TipoUsuario).includes(value)) {
            throw new Error('El tipo de usuario no es válido');
        }
        return true;
    }).optional(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
