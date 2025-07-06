"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RoomController_1 = require("../controllers/RoomController");
const router = (0, express_1.Router)();
const roomController = RoomController_1.RoomController.getInstance();
router.post('/', roomController.createRoom);
router.get('/', roomController.getAllRooms);
router.get('/public', roomController.getPublicRooms);
router.get('/stats', roomController.getStats);
router.get('/:id', roomController.getRoomById);
router.get('/:roomId/participants', roomController.getRoomParticipants);
router.get('/user/:userId', roomController.getUserRooms);
router.post('/:roomId/join', roomController.joinRoom);
router.post('/:roomId/leave', roomController.leaveRoom);
router.delete('/:id', roomController.deleteRoom);
exports.default = router;
//# sourceMappingURL=roomRoutes.js.map