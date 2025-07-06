import { Router } from 'express';
import userRoutes from './userRoutes';
import messageRoutes from './messageRoutes';
import roomRoutes from './roomRoutes';

const router = Router();

// API version prefix
const API_PREFIX = '/api/v1';

// Mount routes
router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/messages`, messageRoutes);
router.use(`${API_PREFIX}/rooms`, roomRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Chat API is running',
    timestamp: new Date().toISOString()
  });
});

// API info endpoint
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

export default router; 