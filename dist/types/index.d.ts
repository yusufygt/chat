export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    lastSeen: Date;
    isOnline: boolean;
}
export interface Message {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
    roomId: string;
    type: 'text' | 'system' | 'notification';
}
export interface ChatRoom {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    participants: string[];
    isPrivate: boolean;
    lastMessage?: Message;
}
export interface ChatSession {
    id: string;
    userId: string;
    roomId: string;
    joinedAt: Date;
    lastReadAt: Date;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface CreateUserRequest {
    username: string;
    email: string;
}
export interface CreateMessageRequest {
    content: string;
    roomId: string;
}
export interface CreateRoomRequest {
    name: string;
    description?: string;
    isPrivate?: boolean;
    participants?: string[];
}
export interface JoinRoomRequest {
    roomId: string;
}
export interface SocketEvents {
    'user:join': (userId: string) => void;
    'user:leave': (userId: string) => void;
    'message:send': (message: CreateMessageRequest) => void;
    'room:join': (request: JoinRoomRequest) => void;
    'room:leave': (roomId: string) => void;
    'typing:start': (roomId: string) => void;
    'typing:stop': (roomId: string) => void;
}
//# sourceMappingURL=index.d.ts.map