"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetToken = exports.compareOTP = exports.hashOTP = exports.generateOTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};
exports.generateOTP = generateOTP;
const hashOTP = async (otp) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(otp, salt);
};
exports.hashOTP = hashOTP;
const compareOTP = async (candidateOTP, hashedOTP) => {
    return bcryptjs_1.default.compare(candidateOTP, hashedOTP);
};
exports.compareOTP = compareOTP;
const generateResetToken = () => {
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    return { token, hashedToken };
};
exports.generateResetToken = generateResetToken;
//# sourceMappingURL=otp.js.map