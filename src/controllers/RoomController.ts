import { Request, Response } from 'express';
import { RoomService } from '../services/RoomService';
import { UserService } from '../services/UserService';
import { ApiResponse, CreateRoomRequest, ChatRoom } from '../types';

export class RoomController {
  private static instance: RoomController;
  private roomService: RoomService;
  private userService: UserService;

  private constructor() {
    this.roomService = RoomService.getInstance();
    this.userService = UserService.getInstance();
  }

  public static getInstance(): RoomController {
    if (!RoomController.instance) {
      RoomController.instance = new RoomController();
    }
    return RoomController.instance;
  }

  public createRoom = (req: Request, res: Response): void => {
    try {
      const roomData: CreateRoomRequest = req.body;
      const creatorId = req.headers['user-id'] as string;

      // Validate input
      if (!roomData.name) {
        const response: ApiResponse = {
          success: false,
          error: 'Room name is required'
        };
        res.status(400).json(response);
        return;
      }

      if (!creatorId) {
        const response: ApiResponse = {
          success: false,
          error: 'User ID is required'
        };
        res.status(401).json(response);
        return;
      }

      // Check if creator exists
      const creator = this.userService.getUserById(creatorId);
      if (!creator) {
        const response: ApiResponse = {
          success: false,
          error: 'Creator user not found'
        };
        res.status(404).json(response);
        return;
      }

      // Validate participants if provided
      if (roomData.participants) {
        for (const participantId of roomData.participants) {
          const participant = this.userService.getUserById(participantId);
          if (!participant) {
            const response: ApiResponse = {
              success: false,
              error: `Participant with ID ${participantId} not found`
            };
            res.status(404).json(response);
            return;
          }
        }
      }

      const room = this.roomService.createRoom(roomData, creatorId);
      if (!room) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to create room'
        };
        res.status(500).json(response);
        return;
      }

      const response: ApiResponse<ChatRoom> = {
        success: true,
        data: room,
        message: 'Room created successfully'
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

  public getRoomById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const room = this.roomService.getRoomById(id);

      if (!room) {
        const response: ApiResponse = {
          success: false,
          error: 'Room not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<ChatRoom> = {
        success: true,
        data: room
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

  public getAllRooms = (req: Request, res: Response): void => {
    try {
      const rooms = this.roomService.getAllRooms();
      const response: ApiResponse<ChatRoom[]> = {
        success: true,
        data: rooms
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

  public getPublicRooms = (req: Request, res: Response): void => {
    try {
      const rooms = this.roomService.getPublicRooms();
      const response: ApiResponse<ChatRoom[]> = {
        success: true,
        data: rooms
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

  public getUserRooms = (req: Request, res: Response): void => {
    try {
      const { userId } = req.params;
      const rooms = this.roomService.getUserRooms(userId);
      const response: ApiResponse<ChatRoom[]> = {
        success: true,
        data: rooms
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

  public joinRoom = (req: Request, res: Response): void => {
    try {
      const { roomId } = req.params;
      const userId = req.headers['user-id'] as string;

      if (!userId) {
        const response: ApiResponse = {
          success: false,
          error: 'User ID is required'
        };
        res.status(401).json(response);
        return;
      }

      const success = this.roomService.addUserToRoom(userId, roomId);
      if (!success) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to join room'
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Successfully joined room'
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

  public leaveRoom = (req: Request, res: Response): void => {
    try {
      const { roomId } = req.params;
      const userId = req.headers['user-id'] as string;

      if (!userId) {
        const response: ApiResponse = {
          success: false,
          error: 'User ID is required'
        };
        res.status(401).json(response);
        return;
      }

      const success = this.roomService.removeUserFromRoom(userId, roomId);
      if (!success) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to leave room'
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Successfully left room'
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

  public getRoomParticipants = (req: Request, res: Response): void => {
    try {
      const { roomId } = req.params;
      const participantIds = this.roomService.getRoomParticipants(roomId);
      
      // Get full user objects
      const participants = participantIds
        .map(id => this.userService.getUserById(id))
        .filter(user => user !== undefined);

      const response: ApiResponse = {
        success: true,
        data: participants
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

  public deleteRoom = (req: Request, res: Response): void => {
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

      const success = this.roomService.deleteRoom(id, userId);
      if (!success) {
        const response: ApiResponse = {
          success: false,
          error: 'Room not found or unauthorized'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Room deleted successfully'
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
        totalRooms: this.roomService.getRoomsCount()
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