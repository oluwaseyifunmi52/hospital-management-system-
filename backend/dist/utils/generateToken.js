"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const ACCESS_EXPIRY_MS = 15 * 60 * 1000;
const REFRESH_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
const generateAccessToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, role }, env_1.config.jwt.accessSecret, {
        expiresIn: Math.floor(ACCESS_EXPIRY_MS / 1000),
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, env_1.config.jwt.refreshSecret, {
        expiresIn: Math.floor(REFRESH_EXPIRY_MS / 1000),
    });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.config.jwt.accessSecret);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.config.jwt.refreshSecret);
};
exports.verifyRefreshToken = verifyRefreshToken;
const generateTokens = (user) => {
    const accessToken = (0, exports.generateAccessToken)(user._id.toString(), user.role);
    const refreshToken = (0, exports.generateRefreshToken)(user._id.toString());
    return {
        accessToken,
        refreshToken,
    };
};
exports.generateTokens = generateTokens;
//# sourceMappingURL=generateToken.js.map