"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const success_type_enum_1 = require("@shared/enums/success-type.enum");
const error_type_enum_1 = require("@shared/enums/error-type.enum");
const successResponse = (res, message, status = success_type_enum_1.SuccessType.OK, data) => {
    const response = {
        status,
        statusText: success_type_enum_1.SuccessType[status],
        data: data,
        message
    };
    return res.status(status).json(response);
};
exports.successResponse = successResponse;
const errorResponse = (res, message, status = error_type_enum_1.ErrorType.INTERNAL_ERROR, errorDetails) => {
    const response = {
        status,
        statusText: error_type_enum_1.ErrorType[status],
        message,
        errorDetails
    };
    return res.status(status).json(response);
};
exports.errorResponse = errorResponse;
