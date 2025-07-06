import type { 
  User, 
  Message, 
  ChatRoom, 
  CreateUserRequest, 
  CreateMessageRequest, 
  CreateRoomRequest,
  ApiResponse 
} from './types';

const API_BASE = 'http://localhost:3000/api/v1';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    return response.json();
  }

  // User endpoints
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/users');
  }

  async getOnlineUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/users/online');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  async updateUserStatus(id: string, isOnline: boolean): Promise<ApiResponse> {
    return this.request(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isOnline }),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Message endpoints
  async createMessage(messageData: CreateMessageRequest, userId: string): Promise<ApiResponse<Message>> {
    return this.request<Message>('/messages', {
      method: 'POST',
      headers: {
        'user-id': userId,
      },
      body: JSON.stringify(messageData),
    });
  }

  async getMessagesByRoom(roomId: string, limit = 50, offset = 0): Promise<ApiResponse<Message[]>> {
    return this.request<Message[]>(`/messages/room/${roomId}?limit=${limit}&offset=${offset}`);
  }

  async getRecentMessages(limit = 20): Promise<ApiResponse<Message[]>> {
    return this.request<Message[]>(`/messages/recent?limit=${limit}`);
  }

  async getMessagesByUser(userId: string, limit = 50): Promise<ApiResponse<Message[]>> {
    return this.request<Message[]>(`/messages/user/${userId}?limit=${limit}`);
  }

  async deleteMessage(messageId: string, userId: string): Promise<ApiResponse> {
    return this.request(`/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'user-id': userId,
      },
    });
  }

  async searchMessages(query: string, roomId?: string): Promise<ApiResponse<Message[]>> {
    const params = new URLSearchParams({ query });
    if (roomId) params.append('roomId', roomId);
    return this.request<Message[]>(`/messages/search?${params}`);
  }

  // Room endpoints
  async createRoom(roomData: CreateRoomRequest, userId: string): Promise<ApiResponse<ChatRoom>> {
    return this.request<ChatRoom>('/rooms', {
      method: 'POST',
      headers: {
        'user-id': userId,
      },
      body: JSON.stringify(roomData),
    });
  }

  async getAllRooms(): Promise<ApiResponse<ChatRoom[]>> {
    return this.request<ChatRoom[]>('/rooms');
  }

  async getPublicRooms(): Promise<ApiResponse<ChatRoom[]>> {
    return this.request<ChatRoom[]>('/rooms/public');
  }

  async getRoomById(id: string): Promise<ApiResponse<ChatRoom>> {
    return this.request<ChatRoom>(`/rooms/${id}`);
  }

  async getUserRooms(userId: string): Promise<ApiResponse<ChatRoom[]>> {
    return this.request<ChatRoom[]>(`/rooms/user/${userId}`);
  }

  async joinRoom(roomId: string, userId: string): Promise<ApiResponse> {
    return this.request(`/rooms/${roomId}/join`, {
      method: 'POST',
      headers: {
        'user-id': userId,
      },
    });
  }

  async leaveRoom(roomId: string, userId: string): Promise<ApiResponse> {
    return this.request(`/rooms/${roomId}/leave`, {
      method: 'POST',
      headers: {
        'user-id': userId,
      },
    });
  }

  async getRoomParticipants(roomId: string): Promise<ApiResponse<User[]>> {
    return this.request<User[]>(`/rooms/${roomId}/participants`);
  }

  async deleteRoom(roomId: string, userId: string): Promise<ApiResponse> {
    return this.request(`/rooms/${roomId}`, {
      method: 'DELETE',
      headers: {
        'user-id': userId,
      },
    });
  }
}

export const apiService = new ApiService(); 