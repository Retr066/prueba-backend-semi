import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorResponse, successResponse } from 'src/utils/response-handler';
import { SuccessType } from '@shared/enums/success-type.enum';
import { ErrorType } from '@shared/enums/error-type.enum';
import logger from 'src/utils/logger';
import { JWT_SECRET } from '@config/env';
import { JwtPayload } from '@shared/interfaces/auth.interface';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const {
    username: usuario,
    email: correo,
    name: nombre,
    lastname: apell_paterno,
    second_lastname: apell_materno,
    password: contrasena
  } = req.body;

  const findUser = await prisma.usuario.findUnique({
    where: {
      correo,
    },
  });

  if (findUser) {
    return errorResponse(res, 'El correo ya está registrado', ErrorType.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(contrasena, 10);

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
    successResponse(res, 'Usuario creado satisfactoriamente', SuccessType.CREATED);
  } catch (error) {
    logger.error('Error al crear el usuario', error);
    errorResponse(res, 'Error al crear el usuario');
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.usuario.findUnique({
      where: { correo: email },
    });

    if (!user) {
      return errorResponse(res, 'Credenciales incorrectas', ErrorType.BAD_REQUEST);
    }

    const isPasswordValid = await bcrypt.compare(password, user.contrasena);

    if (!isPasswordValid) {
      return errorResponse(res, 'Credenciales incorrectas', ErrorType.BAD_REQUEST);
    }

    const token = jwt.sign({ userId: user.id, role: user.tipo_usuario }, JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ userId: user.id, role: user.tipo_usuario }, JWT_SECRET, { expiresIn: '7d' });

    successResponse(res, 'Inicio de sesión exitoso', SuccessType.OK, { token, user, refreshToken });
  } catch (error) {
    logger.error('Error al iniciar sesión', error);
    errorResponse(res, 'Error al iniciar sesión');
  }
};


export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;

    const user = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', ErrorType.NOT_FOUND);
    }

    const newToken = jwt.sign({ userId: decoded.userId, role: user.tipo_usuario }, JWT_SECRET, { expiresIn: '1d' });
    const newRefreshToken = jwt.sign({ userId: decoded.userId, role: user.tipo_usuario }, JWT_SECRET, { expiresIn: '7d' });

    successResponse(res, 'Token refrescado exitosamente', SuccessType.OK, { token: newToken, refreshToken: newRefreshToken });
  } catch (error) {
    logger.error('Error al actualizar el token', error);
    errorResponse(res, 'Error al actualizar el token');
  }
}
