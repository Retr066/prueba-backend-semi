import { ErrorType } from "@shared/enums/error-type.enum";
import { AuthenticatedRequest } from "@shared/interfaces/auth.interface";
import { NextFunction, Response } from "express";
import { errorResponse } from "src/utils/response-handler";

export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  console.log(req.user);
    if (!req.user || req.user.role !== 'ADMIN') {
      return errorResponse(res, 'No tienes permiso para realizar esta acción', ErrorType.FORBIDDEN);
    }
    next();
  };
  

  