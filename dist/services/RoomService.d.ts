import { ChatRoom, CreateRoomRequest, ChatSession } from '../types';
export declare class RoomService {
    private static instance;
    private rooms;
    private userSessions;
    private roomSessions;
    private userService;
    private messageService;
    private constructor();
    static getInstance(): RoomService;
    private createDefaultRoom;
    createRoom(roomData: CreateRoomRequest, creatorId: string): ChatRoom | null;
    getRoomById(id: string): ChatRoom | undefined;
    getAllRooms(): ChatRoom[];
    getPublicRooms(): ChatRoom[];
    getUserRooms(userId: string): ChatRoom[];
    addUserToRoom(userId: string, roomId: string): boolean;
    removeUserFromRoom(userId: string, roomId: string): boolean;
    getRoomParticipants(roomId: string): string[];
    getUserSessions(userId: string): ChatSession[];
    getRoomSessions(roomId: string): ChatSession[];
    updateLastRead(userId: string, roomId: string): boolean;
    deleteRoom(roomId: string, userId: string): boolean;
    getRoomsCount(): number;
    getRoomParticipantsCount(roomId: string): number;
}
//# sourceMappingURL=RoomService.d.ts.map