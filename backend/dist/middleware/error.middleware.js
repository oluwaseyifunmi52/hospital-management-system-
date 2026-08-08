"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const response_1 = require("../utils/response");
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof response_1.AppError) {
        (0, response_1.sendError)(res, err.statusCode, err.message, err.errors, err.code);
        return;
    }
    if (err.name === 'ValidationError') {
        (0, response_1.sendError)(res, 400, 'Validation error', err.message);
        return;
    }
    if (err.name === 'CastError') {
        (0, response_1.sendError)(res, 400, 'Invalid ID format');
        return;
    }
    if (err.code === 11000) {
        (0, response_1.sendError)(res, 409, 'Duplicate field value');
        return;
    }
    (0, response_1.sendError)(res, 500, 'Internal server error');
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    (0, response_1.sendError)(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=error.middleware.js.map