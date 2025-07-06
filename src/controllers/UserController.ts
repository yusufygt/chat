import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ApiResponse, CreateUserRequest } from '../types';

export class UserController {
  private static instance: UserController;
  private userService: UserService;

  private constructor() {
    this.userService = UserService.getInstance();
  }

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  public createUser = (req: Request, res: Response): void => {
    try {
      const userData: CreateUserRequest = req.body;

      // Validate input
      if (!userData.username || !userData.email) {
        const response: ApiResponse = {
          success: false,
          error: 'Username and email are required'
        };
        res.status(400).json(response);
        return;
      }

      // Check if user already exists
      const existingUser = this.userService.getUserByEmail(userData.email);
      if (existingUser) {
        const response: ApiResponse = {
          success: false,
          error: 'User with this email already exists'
        };
        res.status(409).json(response);
        return;
      }

      const existingUsername = this.userService.getUserByUsername(userData.username);
      if (existingUsername) {
        const response: ApiResponse = {
          success: false,
          error: 'Username already taken'
        };
        res.status(409).json(response);
        return;
      }

      const user = this.userService.createUser(userData);
      const response: ApiResponse<User> = {
        success: true,
        data: user,
        message: 'User created successfully'
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

  public getUserById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const user = this.userService.getUserById(id);

      if (!user) {
        const response: ApiResponse = {
          success: false,
          error: 'User not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<User> = {
        success: true,
        data: user
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

  public getAllUsers = (req: Request, res: Response): void => {
    try {
      const users = this.userService.getAllUsers();
      const response: ApiResponse<User[]> = {
        success: true,
        data: users
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

  public getOnlineUsers = (req: Request, res: Response): void => {
    try {
      const users = this.userService.getOnlineUsers();
      const response: ApiResponse<User[]> = {
        success: true,
        data: users
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

  public updateUserStatus = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const { isOnline } = req.body;

      if (typeof isOnline !== 'boolean') {
        const response: ApiResponse = {
          success: false,
          error: 'isOnline must be a boolean'
        };
        res.status(400).json(response);
        return;
      }

      const success = this.userService.updateUserOnlineStatus(id, isOnline);
      if (!success) {
        const response: ApiResponse = {
          success: false,
          error: 'User not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'User status updated successfully'
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

  public deleteUser = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const success = this.userService.deleteUser(id);

      if (!success) {
        const response: ApiResponse = {
          success: false,
          error: 'User not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'User deleted successfully'
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
        totalUsers: this.userService.getUsersCount(),
        onlineUsers: this.userService.getOnlineUsersCount()
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