import { io, Socket } from 'socket.io-client';
import type { Message, CreateMessageRequest } from './types';

export class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string): void {
    this.userId = userId;
    this.socket = io('http://localhost:3000');
    
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket?.emit('user:join', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  // Event listeners
  onUserJoined(callback: (data: any) => void): void {
    this.socket?.on('user:joined', callback);
  }

  onMessageReceived(callback: (message: Message) => void): void {
    this.socket?.on('message:received', callback);
  }

  onUserJoinedRoom(callback: (data: any) => void): void {
    this.socket?.on('user:joined_room', callback);
  }

  onUserLeftRoom(callback: (data: any) => void): void {
    this.socket?.on('user:left_room', callback);
  }

  onUserOnline(callback: (data: any) => void): void {
    this.socket?.on('user:online', callback);
  }

  onUserOffline(callback: (data: any) => void): void {
    this.socket?.on('user:offline', callback);
  }

  onTypingStarted(callback: (data: any) => void): void {
    this.socket?.on('typing:started', callback);
  }

  onTypingStopped(callback: (data: any) => void): void {
    this.socket?.on('typing:stopped', callback);
  }

  onError(callback: (data: any) => void): void {
    this.socket?.on('error', callback);
  }

  // Event emitters
  sendMessage(messageData: CreateMessageRequest): void {
    this.socket?.emit('message:send', messageData);
  }

  joinRoom(roomId: string): void {
    this.socket?.emit('room:join', { roomId });
  }

  leaveRoom(roomId: string): void {
    this.socket?.emit('room:leave', roomId);
  }

  startTyping(roomId: string): void {
    this.socket?.emit('typing:start', roomId);
  }

  stopTyping(roomId: string): void {
    this.socket?.emit('typing:stop', roomId);
  }

  // Remove event listeners
  off(event: string): void {
    this.socket?.off(event);
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService(); 