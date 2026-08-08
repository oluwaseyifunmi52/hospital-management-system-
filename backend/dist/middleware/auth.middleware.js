"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticate = void 0;
const generateToken_1 = require("../utils/generateToken");
const User_1 = __importDefault(require("../models/User"));
const response_1 = require("../utils/response");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            (0, response_1.sendError)(res, 401, 'Access denied. No token provided.');
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, generateToken_1.verifyAccessToken)(token);
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            (0, response_1.sendError)(res, 401, 'User not found.');
            return;
        }
        if (!user.isActive) {
            (0, response_1.sendError)(res, 403, 'Account is deactivated. Please contact administrator.');
            return;
        }
        req.user = {
            id: user._id.toString(),
            role: user.role,
        };
        req.currentUser = user;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            (0, response_1.sendError)(res, 401, 'Token expired.');
            return;
        }
        if (error.name === 'JsonWebTokenError') {
            (0, response_1.sendError)(res, 401, 'Invalid token.');
            return;
        }
        (0, response_1.sendError)(res, 500, 'Authentication error.');
    }
};
exports.authenticate = authenticate;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, generateToken_1.verifyAccessToken)(token);
        const user = await User_1.default.findById(decoded.id);
        if (user && user.isActive) {
            req.user = {
                id: user._id.toString(),
                role: user.role,
            };
            req.currentUser = user;
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.middleware.js.map