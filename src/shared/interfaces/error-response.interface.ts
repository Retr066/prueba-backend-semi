import { ErrorType } from "@shared/enums/error-type.enum";

export interface ErrorResponse {
    status: ErrorType;
    statusText: string;
    message: string;
    errorDetails?: any; // Información adicional sobre el error, opcional
}
