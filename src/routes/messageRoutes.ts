import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';

const router = Router();
const messageController = MessageController.getInstance();

// Create a new message
router.post('/', messageController.createMessage);

// Get recent messages
router.get('/recent', messageController.getRecentMessages);

// Search messages
router.get('/search', messageController.searchMessages);

// Get message statistics
router.get('/stats', messageController.getStats);

// Get message by ID
router.get('/:id', messageController.getMessageById);

// Get messages by room
router.get('/room/:roomId', messageController.getMessagesByRoom);

// Get messages by user
router.get('/user/:userId', messageController.getMessagesByUser);

// Delete message
router.delete('/:id', messageController.deleteMessage);

export default router; 