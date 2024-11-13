import { JWT_SECRET } from "@config/env";
import { AuthenticatedRequest } from "@shared/interfaces/auth.interface";
import { NextFunction, Response } from "express";
import { JwtPayload } from '../interfaces/auth.interface';
import jwt from 'jsonwebtoken';
import { errorResponse } from "src/utils/response-handler";
import { ErrorType } from "@shared/enums/error-type.enum";
import logger from "src/utils/logger";

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return errorResponse(res, 'Token no proporcionado', ErrorType.UNAUTHORIZED);
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      req.user= decoded;
      next();
    } catch (error) {
     logger.error('Error al verificar el token', error);
      return errorResponse(res, 'Token inválido', ErrorType.UNAUTHORIZED);
    }
  };
