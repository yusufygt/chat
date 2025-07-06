import { ChatRoom, CreateRoomRequest, ChatSession } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './UserService';
import { MessageService } from './MessageService';

export class RoomService {
  private static instance: RoomService;
  private rooms: Map<string, ChatRoom> = new Map();
  private userSessions: Map<string, ChatSession[]> = new Map(); // userId -> sessions[]
  private roomSessions: Map<string, ChatSession[]> = new Map(); // roomId -> sessions[]
  private userService: UserService;
  private messageService: MessageService;

  private constructor() {
    this.userService = UserService.getInstance();
    this.messageService = MessageService.getInstance();
    this.createDefaultRoom();
  }

  public static getInstance(): RoomService {
    if (!RoomService.instance) {
      RoomService.instance = new RoomService();
    }
    return RoomService.instance;
  }

  private createDefaultRoom(): void {
    const generalRoom: ChatRoom = {
      id: 'general',
      name: 'General',
      description: 'General chat room for all users',
      createdAt: new Date(),
      participants: [],
      isPrivate: false
    };
    this.rooms.set('general', generalRoom);
  }

  public createRoom(roomData: CreateRoomRequest, creatorId: string): ChatRoom | null {
    const creator = this.userService.getUserById(creatorId);
    if (!creator) return null;

    const id = uuidv4();
    const now = new Date();

    const room: ChatRoom = {
      id,
      name: roomData.name,
      description: roomData.description,
      createdAt: now,
      participants: [creatorId, ...(roomData.participants || [])],
      isPrivate: roomData.isPrivate || false
    };

    this.rooms.set(id, room);

    // Add participants to the room
    room.participants.forEach(participantId => {
      this.addUserToRoom(participantId, id);
    });

    // Create system message
    this.messageService.createSystemMessage(id, `${creator.username} created this room`);

    return room;
  }

  public getRoomById(id: string): ChatRoom | undefined {
    return this.rooms.get(id);
  }

  public getAllRooms(): ChatRoom[] {
    return Array.from(this.rooms.values());
  }

  public getPublicRooms(): ChatRoom[] {
    return Array.from(this.rooms.values()).filter(room => !room.isPrivate);
  }

  public getUserRooms(userId: string): ChatRoom[] {
    return Array.from(this.rooms.values()).filter(room => 
      room.participants.includes(userId)
    );
  }

  public addUserToRoom(userId: string, roomId: string): boolean {
    const user = this.userService.getUserById(userId);
    const room = this.rooms.get(roomId);
    
    if (!user || !room) return false;

    if (room.participants.includes(userId)) return true; // Already in room

    room.participants.push(userId);

    // Create session
    const session: ChatSession = {
      id: uuidv4(),
      userId,
      roomId,
      joinedAt: new Date(),
      lastReadAt: new Date()
    };

    // Add to user sessions
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, []);
    }
    this.userSessions.get(userId)!.push(session);

    // Add to room sessions
    if (!this.roomSessions.has(roomId)) {
      this.roomSessions.set(roomId, []);
    }
    this.roomSessions.get(roomId)!.push(session);

    // Create system message
    this.messageService.createSystemMessage(roomId, `${user.username} joined the room`);

    return true;
  }

  public removeUserFromRoom(userId: string, roomId: string): boolean {
    const user = this.userService.getUserById(userId);
    const room = this.rooms.get(roomId);
    
    if (!user || !room) return false;

    const participantIndex = room.participants.indexOf(userId);
    if (participantIndex === -1) return false;

    room.participants.splice(participantIndex, 1);

    // Remove session
    const userSessions = this.userSessions.get(userId) || [];
    const sessionIndex = userSessions.findIndex(session => session.roomId === roomId);
    if (sessionIndex !== -1) {
      userSessions.splice(sessionIndex, 1);
    }

    const roomSessions = this.roomSessions.get(roomId) || [];
    const roomSessionIndex = roomSessions.findIndex(session => session.userId === userId);
    if (roomSessionIndex !== -1) {
      roomSessions.splice(roomSessionIndex, 1);
    }

    // Create system message
    this.messageService.createSystemMessage(roomId, `${user.username} left the room`);

    return true;
  }

  public getRoomParticipants(roomId: string): string[] {
    const room = this.rooms.get(roomId);
    return room ? room.participants : [];
  }

  public getUserSessions(userId: string): ChatSession[] {
    return this.userSessions.get(userId) || [];
  }

  public getRoomSessions(roomId: string): ChatSession[] {
    return this.roomSessions.get(roomId) || [];
  }

  public updateLastRead(userId: string, roomId: string): boolean {
    const userSessions = this.userSessions.get(userId);
    if (!userSessions) return false;

    const session = userSessions.find(s => s.roomId === roomId);
    if (!session) return false;

    session.lastReadAt = new Date();
    return true;
  }

  public deleteRoom(roomId: string, userId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room || !room.participants.includes(userId)) return false;

    // Remove all sessions for this room
    this.roomSessions.delete(roomId);
    
    // Remove room sessions from user sessions
    for (const [userId, sessions] of this.userSessions.entries()) {
      this.userSessions.set(userId, sessions.filter(s => s.roomId !== roomId));
    }

    this.rooms.delete(roomId);
    return true;
  }

  public getRoomsCount(): number {
    return this.rooms.size;
  }

  public getRoomParticipantsCount(roomId: string): number {
    const room = this.rooms.get(roomId);
    return room ? room.participants.length : 0;
  }
} 