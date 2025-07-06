"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const uuid_1 = require("uuid");
const UserService_1 = require("./UserService");
const MessageService_1 = require("./MessageService");
class RoomService {
    constructor() {
        this.rooms = new Map();
        this.userSessions = new Map();
        this.roomSessions = new Map();
        this.userService = UserService_1.UserService.getInstance();
        this.messageService = MessageService_1.MessageService.getInstance();
        this.createDefaultRoom();
    }
    static getInstance() {
        if (!RoomService.instance) {
            RoomService.instance = new RoomService();
        }
        return RoomService.instance;
    }
    createDefaultRoom() {
        const generalRoom = {
            id: 'general',
            name: 'General',
            description: 'General chat room for all users',
            createdAt: new Date(),
            participants: [],
            isPrivate: false
        };
        this.rooms.set('general', generalRoom);
    }
    createRoom(roomData, creatorId) {
        const creator = this.userService.getUserById(creatorId);
        if (!creator)
            return null;
        const id = (0, uuid_1.v4)();
        const now = new Date();
        const room = {
            id,
            name: roomData.name,
            description: roomData.description,
            createdAt: now,
            participants: [creatorId, ...(roomData.participants || [])],
            isPrivate: roomData.isPrivate || false
        };
        this.rooms.set(id, room);
        room.participants.forEach(participantId => {
            this.addUserToRoom(participantId, id);
        });
        this.messageService.createSystemMessage(id, `${creator.username} created this room`);
        return room;
    }
    getRoomById(id) {
        return this.rooms.get(id);
    }
    getAllRooms() {
        return Array.from(this.rooms.values());
    }
    getPublicRooms() {
        return Array.from(this.rooms.values()).filter(room => !room.isPrivate);
    }
    getUserRooms(userId) {
        return Array.from(this.rooms.values()).filter(room => room.participants.includes(userId));
    }
    addUserToRoom(userId, roomId) {
        const user = this.userService.getUserById(userId);
        const room = this.rooms.get(roomId);
        if (!user || !room)
            return false;
        if (room.participants.includes(userId))
            return true;
        room.participants.push(userId);
        const session = {
            id: (0, uuid_1.v4)(),
            userId,
            roomId,
            joinedAt: new Date(),
            lastReadAt: new Date()
        };
        if (!this.userSessions.has(userId)) {
            this.userSessions.set(userId, []);
        }
        this.userSessions.get(userId).push(session);
        if (!this.roomSessions.has(roomId)) {
            this.roomSessions.set(roomId, []);
        }
        this.roomSessions.get(roomId).push(session);
        this.messageService.createSystemMessage(roomId, `${user.username} joined the room`);
        return true;
    }
    removeUserFromRoom(userId, roomId) {
        const user = this.userService.getUserById(userId);
        const room = this.rooms.get(roomId);
        if (!user || !room)
            return false;
        const participantIndex = room.participants.indexOf(userId);
        if (participantIndex === -1)
            return false;
        room.participants.splice(participantIndex, 1);
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
        this.messageService.createSystemMessage(roomId, `${user.username} left the room`);
        return true;
    }
    getRoomParticipants(roomId) {
        const room = this.rooms.get(roomId);
        return room ? room.participants : [];
    }
    getUserSessions(userId) {
        return this.userSessions.get(userId) || [];
    }
    getRoomSessions(roomId) {
        return this.roomSessions.get(roomId) || [];
    }
    updateLastRead(userId, roomId) {
        const userSessions = this.userSessions.get(userId);
        if (!userSessions)
            return false;
        const session = userSessions.find(s => s.roomId === roomId);
        if (!session)
            return false;
        session.lastReadAt = new Date();
        return true;
    }
    deleteRoom(roomId, userId) {
        const room = this.rooms.get(roomId);
        if (!room || !room.participants.includes(userId))
            return false;
        this.roomSessions.delete(roomId);
        for (const [userId, sessions] of this.userSessions.entries()) {
            this.userSessions.set(userId, sessions.filter(s => s.roomId !== roomId));
        }
        this.rooms.delete(roomId);
        return true;
    }
    getRoomsCount() {
        return this.rooms.size;
    }
    getRoomParticipantsCount(roomId) {
        const room = this.rooms.get(roomId);
        return room ? room.participants.length : 0;
    }
}
exports.RoomService = RoomService;
//# sourceMappingURL=RoomService.js.map