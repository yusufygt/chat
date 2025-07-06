import { Server as HTTPServer } from 'http';
export declare class SocketService {
    private static instance;
    private io;
    private userSockets;
    private socketUsers;
    private userService;
    private messageService;
    private roomService;
    private constructor();
    static getInstance(): SocketService;
    initialize(server: HTTPServer): void;
    private setupEventHandlers;
    private handleUserJoin;
    private handleUserLeave;
    private handleMessageSend;
    private handleRoomJoin;
    private handleRoomLeave;
    private handleTypingStart;
    private handleTypingStop;
    private handleDisconnect;
    emitToUser(userId: string, event: string, data: any): void;
    emitToRoom(roomId: string, event: string, data: any): void;
    emitToAll(event: string, data: any): void;
    getConnectedUsersCount(): number;
    isUserConnected(userId: string): boolean;
}
//# sourceMappingURL=SocketService.d.ts.map