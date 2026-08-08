"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = __importDefault(require("./config/db"));
const startServer = async () => {
    await (0, db_1.default)();
    app_1.default.listen(env_1.config.port, () => {
        console.log(`SmartCare API running on port ${env_1.config.port} in ${env_1.config.nodeEnv} mode`);
    });
};
startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map