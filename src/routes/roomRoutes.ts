import { Router } from 'express';
import { RoomController } from '../controllers/RoomController';

const router = Router();
const roomController = RoomController.getInstance();

// Create a new room
router.post('/', roomController.createRoom);

// Get all rooms
router.get('/', roomController.getAllRooms);

// Get public rooms
router.get('/public', roomController.getPublicRooms);

// Get room statistics
router.get('/stats', roomController.getStats);

// Get room by ID
router.get('/:id', roomController.getRoomById);

// Get room participants
router.get('/:roomId/participants', roomController.getRoomParticipants);

// Get user rooms
router.get('/user/:userId', roomController.getUserRooms);

// Join room
router.post('/:roomId/join', roomController.joinRoom);

// Leave room
router.post('/:roomId/leave', roomController.leaveRoom);

// Delete room
router.delete('/:id', roomController.deleteRoom);

export default router; 