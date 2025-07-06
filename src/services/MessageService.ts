import { Message, CreateMessageRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './UserService';

export class MessageService {
  private static instance: MessageService;
  private messages: Map<string, Message> = new Map();
  private roomMessages: Map<string, string[]> = new Map(); // roomId -> messageIds[]
  private userService: UserService;

  private constructor() {
    this.userService = UserService.getInstance();
  }

  public static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  public createMessage(messageData: CreateMessageRequest, senderId: string): Message | null {
    const sender = this.userService.getUserById(senderId);
    if (!sender) return null;

    const id = uuidv4();
    const now = new Date();

    const message: Message = {
      id,
      content: messageData.content,
      senderId,
      senderName: sender.username,
      timestamp: now,
      roomId: messageData.roomId,
      type: 'text'
    };

    this.messages.set(id, message);

    // Add message to room's message list
    if (!this.roomMessages.has(messageData.roomId)) {
      this.roomMessages.set(messageData.roomId, []);
    }
    this.roomMessages.get(messageData.roomId)!.push(id);

    return message;
  }

  public getMessageById(id: string): Message | undefined {
    return this.messages.get(id);
  }

  public getMessagesByRoom(roomId: string, limit: number = 50, offset: number = 0): Message[] {
    const messageIds = this.roomMessages.get(roomId) || [];
    const paginatedIds = messageIds.slice(offset, offset + limit);
    
    return paginatedIds
      .map(id => this.messages.get(id))
      .filter((message): message is Message => message !== undefined)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  public getRecentMessages(limit: number = 20): Message[] {
    return Array.from(this.messages.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public getMessagesByUser(userId: string, limit: number = 50): Message[] {
    return Array.from(this.messages.values())
      .filter(message => message.senderId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public deleteMessage(messageId: string, userId: string): boolean {
    const message = this.messages.get(messageId);
    if (!message || message.senderId !== userId) return false;

    this.messages.delete(messageId);
    
    // Remove from room's message list
    const roomMessages = this.roomMessages.get(message.roomId);
    if (roomMessages) {
      const index = roomMessages.indexOf(messageId);
      if (index > -1) {
        roomMessages.splice(index, 1);
      }
    }

    return true;
  }

  public createSystemMessage(roomId: string, content: string): Message {
    const id = uuidv4();
    const now = new Date();

    const message: Message = {
      id,
      content,
      senderId: 'system',
      senderName: 'System',
      timestamp: now,
      roomId,
      type: 'system'
    };

    this.messages.set(id, message);

    if (!this.roomMessages.has(roomId)) {
      this.roomMessages.set(roomId, []);
    }
    this.roomMessages.get(roomId)!.push(id);

    return message;
  }

  public getMessagesCount(): number {
    return this.messages.size;
  }

  public getRoomMessagesCount(roomId: string): number {
    return this.roomMessages.get(roomId)?.length || 0;
  }

  public searchMessages(query: string, roomId?: string): Message[] {
    const searchTerm = query.toLowerCase();
    let messagesToSearch = Array.from(this.messages.values());

    if (roomId) {
      messagesToSearch = messagesToSearch.filter(message => message.roomId === roomId);
    }

    return messagesToSearch.filter(message => 
      message.content.toLowerCase().includes(searchTerm) ||
      message.senderName.toLowerCase().includes(searchTerm)
    );
  }
} 