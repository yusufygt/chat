"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
const userController = UserController_1.UserController.getInstance();
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/online', userController.getOnlineUsers);
router.get('/stats', userController.getStats);
router.get('/:id', userController.getUserById);
router.patch('/:id/status', userController.updateUserStatus);
router.delete('/:id', userController.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map