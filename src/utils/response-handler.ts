import { Response } from 'express';
import { SuccessResponse } from '@shared/interfaces/success-response.interface';
import { SuccessType } from '@shared/enums/success-type.enum';
import { ErrorType } from '@shared/enums/error-type.enum';
import { ErrorResponse } from '@shared/interfaces/error-response.interface';

export const successResponse = <T>(res:Response, message: string, status: SuccessType = SuccessType.OK, data?: T): Response => {
  const response: SuccessResponse<T> = {
      status,
      statusText: SuccessType[status],
      data: data,
      message
  };
  return res.status(status).json(response);
}


export const errorResponse = (
  res: Response,
  message: string,
  status: ErrorType = ErrorType.INTERNAL_ERROR,
  errorDetails?: any
): Response => {
  const response: ErrorResponse = {
      status,
      statusText: ErrorType[status],
      message,
      errorDetails
  };
  return res.status(status).json(response);
};
