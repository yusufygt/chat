"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MessageController_1 = require("../controllers/MessageController");
const router = (0, express_1.Router)();
const messageController = MessageController_1.MessageController.getInstance();
router.post('/', messageController.createMessage);
router.get('/recent', messageController.getRecentMessages);
router.get('/search', messageController.searchMessages);
router.get('/stats', messageController.getStats);
router.get('/:id', messageController.getMessageById);
router.get('/room/:roomId', messageController.getMessagesByRoom);
router.get('/user/:userId', messageController.getMessagesByUser);
router.delete('/:id', messageController.deleteMessage);
exports.default = router;
//# sourceMappingURL=messageRoutes.js.map