import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '@utils/logger';
import { errorResponse, successResponse } from '@utils/response-handler';
import { ErrorType } from '@shared/enums/error-type.enum';
import { SuccessType } from '@shared/enums/success-type.enum';
import { validateFilter } from '../middlewares/validators';



const prisma = new PrismaClient();


export const getUsers = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = 'id', order = 'asc', search = '', filter = {} } = req.query;
  console.log(req.query);
  const offset = (Number(page) - 1) * Number(limit);

  try {
    const validFilterFields = ['tipo_usuario'];
    const parsedFilter = typeof filter === 'string' ? JSON.parse(filter) : {};
    const validatedFilter = validateFilter(parsedFilter, validFilterFields);
    const searchTerms = (search as string).split(' ').map(term => term.trim());

    const users = await prisma.usuario.findMany({
      skip: offset,
      take: Number(limit),
      orderBy: {
        [sort as string]: order as 'asc' | 'desc',
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

    successResponse(res, 'Usuarios obtenidos exitosamente',SuccessType.OK, { users, totalUsers });
  } catch (error) {
    logger.error(`Error obteniendo usuarios:`, error);
    errorResponse(res,'Error obteniendo usuarios');
  }
};


export const getUsersSecond = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, sort = 'id', order = 'asc', search = '', filter = '{}' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
  
    try {
      const validFilterFields = ['id', 'usuario', 'tipo_usuario'];
      const parsedFilter = typeof filter === 'string' ? JSON.parse(filter) : {};
      const validatedFilter = validateFilter(parsedFilter, validFilterFields);
  
      const users = await prisma.usuario.findMany({
        skip: offset,
        take: Number(limit),
        orderBy: {
          [sort as string]: order as 'asc' | 'desc',
        },
        where: {
          OR: [
            {
              usuario: {
                contains: search as string,
              },
            },
            {
              tipo_usuario: {
                contains: search as string,
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
                contains: search as string,
              },
            },
            {
              tipo_usuario: {
                contains: search as string,
              },
            },
          ],
          ...validatedFilter,
        },
      });
  
      successResponse(res, 'Usuarios obtenidos exitosamente', SuccessType.OK, { users, totalUsers });
    } catch (error) {
      logger.error(`Error obteniendo usuarios:`, error);
      errorResponse(res, 'Error obteniendo usuarios');
    }
  };

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', ErrorType.NOT_FOUND);
    }

    successResponse(res, 'Usuario obtenido exitosamente', SuccessType.OK, user);
  } catch (error) {
    logger.error(`Error obteniendo usuario: `, error);
    errorResponse(res, 'Error obteniendo usuario');
  }
};

export const updateUser = async (req: Request, res: Response) => {
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

    successResponse(res, 'Usuario actualizado exitosamente', SuccessType.OK, updatedUser);
  } catch (error) {
    logger.error(`Error actualizando usuario:`, error);
    errorResponse(res, 'Error actualizando usuario');
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    successResponse(res, 'Usuario eliminado exitosamente', SuccessType.OK);
  } catch (error) {
    logger.error(`Error eliminando usuario:`, error);
    errorResponse(res, 'Error eliminando usuario');
  }
};
