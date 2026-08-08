"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.sendPaginated = exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, statusCode = 200, message, data) => {
    const response = {
        success: true,
    };
    if (message)
        response.message = message;
    if (data !== undefined)
        response.data = data;
    res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, statusCode = 500, message, errors, code) => {
    const response = {
        success: false,
        message,
    };
    if (errors)
        response.errors = errors;
    if (code)
        response.code = code;
    res.status(statusCode).json(response);
};
exports.sendError = sendError;
const sendPaginated = (res, data, total, page, limit, message) => {
    const pagination = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
    const response = {
        success: true,
        data: {
            data,
            pagination,
        },
    };
    if (message)
        response.message = message;
    res.status(200).json(response);
};
exports.sendPaginated = sendPaginated;
class AppError extends Error {
    constructor(message, statusCode = 500, code = 'ERROR', errors) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.errors = errors;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=response.js.map