"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = exports.AuditService = void 0;
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
class AuditService {
    async log(data) {
        await AuditLog_1.default.create({
            ...data,
            result: data.result || 'success',
        });
    }
    async getLogs(filters) {
        const { user, resource, action, page = 1, limit = 50 } = filters;
        const query = {};
        if (user)
            query.user = user;
        if (resource)
            query.resource = resource;
        if (action)
            query.action = action;
        const total = await AuditLog_1.default.countDocuments(query);
        const logs = await AuditLog_1.default.find(query)
            .populate('user', 'firstName lastName email role')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        return {
            data: logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
}
exports.AuditService = AuditService;
exports.auditService = new AuditService();
//# sourceMappingURL=audit.service.js.map