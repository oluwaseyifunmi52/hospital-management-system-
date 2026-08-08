"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const User_1 = __importDefault(require("../models/User"));
const seedAdmin = async () => {
    try {
        await mongoose_1.default.connect(env_1.config.mongodbUri);
        console.log('Connected to MongoDB');
        const existingAdmin = await User_1.default.findOne({ email: 'admin@smartcare.com' });
        if (existingAdmin) {
            console.log('Admin account already exists');
            process.exit(0);
        }
        const admin = await User_1.default.create({
            email: 'admin@smartcare.com',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            phone: '+1234567890',
            role: 'admin',
            isVerified: true,
            isActive: true,
        });
        console.log('Admin account created:', admin.email);
        process.exit(0);
    }
    catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};
seedAdmin();
//# sourceMappingURL=seed.js.map