import { Message, CreateMessageRequest } from '../types';
export declare class MessageService {
    private static instance;
    private messages;
    private roomMessages;
    private userService;
    private constructor();
    static getInstance(): MessageService;
    createMessage(messageData: CreateMessageRequest, senderId: string): Message | null;
    getMessageById(id: string): Message | undefined;
    getMessagesByRoom(roomId: string, limit?: number, offset?: number): Message[];
    getRecentMessages(limit?: number): Message[];
    getMessagesByUser(userId: string, limit?: number): Message[];
    deleteMessage(messageId: string, userId: string): boolean;
    createSystemMessage(roomId: string, content: string): Message;
    getMessagesCount(): number;
    getRoomMessagesCount(roomId: string): number;
    searchMessages(query: string, roomId?: string): Message[];
}
//# sourceMappingURL=MessageService.d.ts.map