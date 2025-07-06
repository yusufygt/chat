"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const messageRoutes_1 = __importDefault(require("./messageRoutes"));
const roomRoutes_1 = __importDefault(require("./roomRoutes"));
const router = (0, express_1.Router)();
const API_PREFIX = '/api/v1';
router.use(`${API_PREFIX}/users`, userRoutes_1.default);
router.use(`${API_PREFIX}/messages`, messageRoutes_1.default);
router.use(`${API_PREFIX}/rooms`, roomRoutes_1.default);
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Chat API is running',
        timestamp: new Date().toISOString()
    });
});
router.get(`${API_PREFIX}`, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Conversational Chat API',
        version: '1.0.0',
        endpoints: {
            users: `${API_PREFIX}/users`,
            messages: `${API_PREFIX}/messages`,
            rooms: `${API_PREFIX}/rooms`
        }
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map