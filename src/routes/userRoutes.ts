import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = UserController.getInstance();

// Create a new user
router.post('/', userController.createUser);

// Get all users
router.get('/', userController.getAllUsers);

// Get online users
router.get('/online', userController.getOnlineUsers);

// Get user statistics
router.get('/stats', userController.getStats);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user online status
router.patch('/:id/status', userController.updateUserStatus);

// Delete user
router.delete('/:id', userController.deleteUser);

export default router; 