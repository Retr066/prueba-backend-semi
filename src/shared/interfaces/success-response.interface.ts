import { SuccessType } from "@shared/enums/success-type.enum";

export interface SuccessResponse<T> {
    status: SuccessType;
    statusText: string;
    data?: T;
    message: string;
}
