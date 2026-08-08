"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationResult = exports.getPaginationOptions = void 0;
const getPaginationOptions = (options) => {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(options.maxLimit || 100, Math.max(1, options.limit || 10));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
exports.getPaginationOptions = getPaginationOptions;
const buildPaginationResult = (total, page, limit) => {
    return {
        page,
        limit,
        skip: (page - 1) * limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
};
exports.buildPaginationResult = buildPaginationResult;
//# sourceMappingURL=pagination.js.map