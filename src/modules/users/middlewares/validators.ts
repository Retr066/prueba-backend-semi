// const validFilterFields = ['tipo_usuario', 'correo', 'nombre', 'apell_paterno', 'apell_materno'];

import { TipoUsuario } from "@shared/enums/user-type.enum";
import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateFilter = (filter: any,
  validFilterFields: string[] = []
) => {
  const validatedFilter: any = {};
  for (const key in filter) {
    if (validFilterFields.includes(key)) {
      validatedFilter[key] = filter[key];
    }
  }
  return validatedFilter;
};


export const validateUpdateUser = [
  body('usuario').isString().withMessage('El usuario es requerido').optional(),
  body('correo').isEmail().withMessage('El correo debe ser válido').optional(),
  body('nombre').isString().withMessage('El nombre es requerido').optional(),
  body('apell_paterno').isString().withMessage('El apellido paterno es requerido').optional(),
  body('apell_materno').isString().withMessage('El apellido materno es requerido').optional(),
  body('tipo_usuario').custom(value => {
    if (!Object.values(TipoUsuario).includes(value)) {
      throw new Error('El tipo de usuario no es válido');
    }
    return true;
  }).optional(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
