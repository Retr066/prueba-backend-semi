import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRegister = [
    body('username').isString().notEmpty().withMessage('El usuario es requerido'),
    body('email').isEmail().withMessage('El correo debe ser válido'),
    body('name').isString().notEmpty().withMessage('El nombre es requerido'),
    body('lastname').isString().notEmpty().withMessage('El apellido paterno es requerido'),
    body('second_lastname').isString().notEmpty().withMessage('El apellido materno es requerido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


export const validateLogin = [
    body('email').isEmail().withMessage('El correo debe ser válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
