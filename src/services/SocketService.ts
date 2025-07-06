import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { UserService } from './UserService';
import { MessageService } from './MessageService';
import { RoomService } from './RoomService';
import { CreateMessageRequest, JoinRoomRequest } from '../types';

export class SocketService {
  private static instance: SocketService;
  private io: SocketIOServer | null = null;
  private userSockets: Map<string, string> = new Map(); // userId -> socketId
  private socketUsers: Map<string, string> = new Map(); // socketId -> userId
  private userService: UserService;
  private messageService: MessageService;
  private roomService: RoomService;

  private constructor() {
    this.userService = UserService.getInstance();
    this.messageService = MessageService.getInstance();
    this.roomService = RoomService.getInstance();
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Handle user join
      socket.on('user:join', (userId: string) => {
        this.handleUserJoin(socket, userId);
      });

      // Handle user leave
      socket.on('user:leave', (userId: string) => {
        this.handleUserLeave(socket, userId);
      });

      // Handle message sending
      socket.on('message:send', (messageData: CreateMessageRequest) => {
        this.handleMessageSend(socket, messageData);
      });

      // Handle room join
      socket.on('room:join', (request: JoinRoomRequest) => {
        this.handleRoomJoin(socket, request);
      });

      // Handle room leave
      socket.on('room:leave', (roomId: string) => {
        this.handleRoomLeave(socket, roomId);
      });

      // Handle typing indicators
      socket.on('typing:start', (roomId: string) => {
        this.handleTypingStart(socket, roomId);
      });

      socket.on('typing:stop', (roomId: string) => {
        this.handleTypingStop(socket, roomId);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private handleUserJoin(socket: any, userId: string): void {
    const user = this.userService.getUserById(userId);
    if (!user) {
      socket.emit('error', { message: 'User not found' });
      return;
    }

    // Update user online status
    this.userService.updateUserOnlineStatus(userId, true);

    // Store socket mappings
    this.userSockets.set(userId, socket.id);
    this.socketUsers.set(socket.id, userId);

    // Join user to their rooms
    const userRooms = this.roomService.getUserRooms(userId);
    userRooms.forEach(room => {
      socket.join(room.id);
    });

    // Notify others about user online status
    socket.broadcast.emit('user:online', { userId, username: user.username });

    socket.emit('user:joined', { user, rooms: userRooms });
  }

  private handleUserLeave(socket: any, userId: string): void {
    this.userService.updateUserOnlineStatus(userId, false);
    this.userSockets.delete(userId);
    this.socketUsers.delete(socket.id);

    const user = this.userService.getUserById(userId);
    if (user) {
      socket.broadcast.emit('user:offline', { userId, username: user.username });
    }
  }

  private handleMessageSend(socket: any, messageData: CreateMessageRequest): void {
    const userId = this.socketUsers.get(socket.id);
    if (!userId) {
      socket.emit('error', { message: 'User not authenticated' });
      return;
    }

    const message = this.messageService.createMessage(messageData, userId);
    if (!message) {
      socket.emit('error', { message: 'Failed to create message' });
      return;
    }

    // Emit to all users in the room
    this.io?.to(messageData.roomId).emit('message:received', message);

    // Update room's last message
    const room = this.roomService.getRoomById(messageData.roomId);
    if (room) {
      room.lastMessage = message;
    }
  }

  private handleRoomJoin(socket: any, request: JoinRoomRequest): void {
    const userId = this.socketUsers.get(socket.id);
    if (!userId) {
      socket.emit('error', { message: 'User not authenticated' });
      return;
    }

    const success = this.roomService.addUserToRoom(userId, request.roomId);
    if (success) {
      socket.join(request.roomId);
      socket.emit('room:joined', { roomId: request.roomId });
      
      // Notify others in the room
      socket.to(request.roomId).emit('user:joined_room', { 
        userId, 
        roomId: request.roomId,
        username: this.userService.getUserById(userId)?.username 
      });
    } else {
      socket.emit('error', { message: 'Failed to join room' });
    }
  }

  private handleRoomLeave(socket: any, roomId: string): void {
    const userId = this.socketUsers.get(socket.id);
    if (!userId) {
      socket.emit('error', { message: 'User not authenticated' });
      return;
    }

    const success = this.roomService.removeUserFromRoom(userId, roomId);
    if (success) {
      socket.leave(roomId);
      socket.emit('room:left', { roomId });
      
      // Notify others in the room
      socket.to(roomId).emit('user:left_room', { 
        userId, 
        roomId,
        username: this.userService.getUserById(userId)?.username 
      });
    } else {
      socket.emit('error', { message: 'Failed to leave room' });
    }
  }

  private handleTypingStart(socket: any, roomId: string): void {
    const userId = this.socketUsers.get(socket.id);
    if (!userId) return;

    const user = this.userService.getUserById(userId);
    if (user) {
      socket.to(roomId).emit('typing:started', { 
        userId, 
        username: user.username,
        roomId 
      });
    }
  }

  private handleTypingStop(socket: any, roomId: string): void {
    const userId = this.socketUsers.get(socket.id);
    if (!userId) return;

    socket.to(roomId).emit('typing:stopped', { userId, roomId });
  }

  private handleDisconnect(socket: any): void {
    const userId = this.socketUsers.get(socket.id);
    if (userId) {
      this.userService.updateUserOnlineStatus(userId, false);
      this.userSockets.delete(userId);
      this.socketUsers.delete(socket.id);

      const user = this.userService.getUserById(userId);
      if (user) {
        socket.broadcast.emit('user:offline', { userId, username: user.username });
      }
    }

    console.log(`User disconnected: ${socket.id}`);
  }

  public emitToUser(userId: string, event: string, data: any): void {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io?.to(socketId).emit(event, data);
    }
  }

  public emitToRoom(roomId: string, event: string, data: any): void {
    this.io?.to(roomId).emit(event, data);
  }

  public emitToAll(event: string, data: any): void {
    this.io?.emit(event, data);
  }

  public getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  public isUserConnected(userId: string): boolean {
    return this.userSockets.has(userId);
  }
} 