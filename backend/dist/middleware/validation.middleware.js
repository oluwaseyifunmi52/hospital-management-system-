"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                (0, response_1.sendError)(res, 400, 'Validation error', errors);
                return;
            }
            (0, response_1.sendError)(res, 500, 'Validation error');
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validation.middleware.js.map