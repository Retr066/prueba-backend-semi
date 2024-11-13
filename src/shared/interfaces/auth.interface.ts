import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
  }

export interface JwtPayload {
    userId: number;
    role: 'USER' | 'ADMIN';
  }

