import { Request, Response } from 'express';
import { MessageService } from '../services/MessageService';
import { RoomService } from '../services/RoomService';
import { ApiResponse, CreateMessageRequest, Message } from '../types';

export class MessageController {
  private static instance: MessageController;
  private messageService: MessageService;
  private roomService: RoomService;

  private constructor() {
    this.messageService = MessageService.getInstance();
    this.roomService = RoomService.getInstance();
  }

  public static getInstance(): MessageController {
    if (!MessageController.instance) {
      MessageController.instance = new MessageController();
    }
    return MessageController.instance;
  }

  public createMessage = (req: Request, res: Response): void => {
    try {
      const messageData: CreateMessageRequest = req.body;
      const senderId = req.headers['user-id'] as string;

      // Validate input
      if (!messageData.content || !messageData.roomId) {
        const response: ApiResponse = {
          success: false,
          error: 'Content and roomId are required'
        };
        res.status(400).json(response);
        return;
      }

      if (!senderId) {
        const response: ApiResponse = {
          success: false,
          error: 'User ID is required'
        };
        res.status(401).json(response);
        return;
      }

      // Check if user is in the room
      const room = this.roomService.getRoomById(messageData.roomId);
      if (!room) {
        const response: ApiResponse = {
          success: false,
          error: 'Room not found'
        };
        res.status(404).json(response);
        return;
      }

      if (!room.participants.includes(senderId)) {
        const response: ApiResponse = {
          success: false,
          error: 'User is not a participant in this room'
        };
        res.status(403).json(response);
        return;
      }

      const message = this.messageService.createMessage(messageData, senderId);
      if (!message) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to create message'
        };
        res.status(500).json(response);
        return;
      }

      const response: ApiResponse<Message> = {
        success: true,
        data: message,
        message: 'Message created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };

  public getMessageById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const message = this.messageService.getMessageById(id);

      if (!message) {
        const response: ApiResponse = {
          success: false,
          error: 'Message not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Message> = {
        success: true,
        data: message
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };

  public getMessagesByRoom = (req: Request, res: Response): void => {
    try {
      const { roomId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      // Check if room exists
      const room = this.roomService.getRoomById(roomId);
      if (!room) {
        const response: ApiResponse = {
          success: false,
          error: 'Room not found'
        };
        res.status(404).json(response);
        return;
      }

      const messages = this.messageService.getMessagesByRoom(roomId, limit, offset);
      const response: ApiResponse<Message[]> = {
        success: true,
        data: messages
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };

  public getRecentMessages = (req: Request, res: Response): void => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const messages = this.messageService.getRecentMessages(limit);
      const response: ApiResponse<Message[]> = {
        success: true,
        data: messages
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };

  public getMessagesByUser = (req: Request, res: Response): void => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = this.messageService.getMessagesByUser(userId, limit);
      const response: ApiResponse<Message[]> = {
        success: true,
        data: messages
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };

  public deleteMessage = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const userId = req.headers['user-id'] as string;

      if (!userId) {
        const response: ApiResponse = {
          success: false,
          error: 'User ID is required'
        };
        res.status(401).json(response);
        return;
      }

      const success = this.messageService.deleteMessage(id, userId);
      if (!success) {
        const response: ApiResponse = {
          success: false,
          error: 'Message not found or unauthorized'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Message deleted successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };

  public searchMessages = (req: Request, res: Response): void => {
    try {
      const { query } = req.query;
      const { roomId } = req.query;

      if (!query || typeof query !== 'string') {
        const response: ApiResponse = {
          success: false,
          error: 'Search query is required'
        };
        res.status(400).json(response);
        return;
      }

      const messages = this.messageService.searchMessages(query, roomId as string);
      const response: ApiResponse<Message[]> = {
        success: true,
        data: messages
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };

  public getStats = (req: Request, res: Response): void => {
    try {
      const stats = {
        totalMessages: this.messageService.getMessagesCount()
      };

      const response: ApiResponse = {
        success: true,
        data: stats
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };
} 