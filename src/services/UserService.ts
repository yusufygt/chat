import { User, CreateUserRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  private static instance: UserService;
  private users: Map<string, User> = new Map();
  private onlineUsers: Set<string> = new Set();

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public createUser(userData: CreateUserRequest): User {
    const id = uuidv4();
    const now = new Date();
    
    const user: User = {
      id,
      username: userData.username,
      email: userData.email,
      createdAt: now,
      lastSeen: now,
      isOnline: false
    };

    this.users.set(id, user);
    return user;
  }

  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  public getUserByUsername(username: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  public getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  public getOnlineUsers(): User[] {
    return Array.from(this.users.values()).filter(user => user.isOnline);
  }

  public updateUserOnlineStatus(userId: string, isOnline: boolean): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    user.isOnline = isOnline;
    user.lastSeen = new Date();

    if (isOnline) {
      this.onlineUsers.add(userId);
    } else {
      this.onlineUsers.delete(userId);
    }

    return true;
  }

  public updateLastSeen(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    user.lastSeen = new Date();
    return true;
  }

  public deleteUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    this.users.delete(userId);
    this.onlineUsers.delete(userId);
    return true;
  }

  public isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  public getUsersCount(): number {
    return this.users.size;
  }

  public getOnlineUsersCount(): number {
    return this.onlineUsers.size;
  }
} 