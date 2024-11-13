"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
    ErrorType[ErrorType["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ErrorType[ErrorType["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ErrorType[ErrorType["FORBIDDEN"] = 403] = "FORBIDDEN";
    ErrorType[ErrorType["NOT_FOUND"] = 404] = "NOT_FOUND";
    ErrorType[ErrorType["CONFLICT"] = 409] = "CONFLICT";
    ErrorType[ErrorType["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    ErrorType[ErrorType["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
