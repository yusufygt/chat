"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const UserService_1 = require("./UserService");
const MessageService_1 = require("./MessageService");
const RoomService_1 = require("./RoomService");
class SocketService {
    constructor() {
        this.io = null;
        this.userSockets = new Map();
        this.socketUsers = new Map();
        this.userService = UserService_1.UserService.getInstance();
        this.messageService = MessageService_1.MessageService.getInstance();
        this.roomService = RoomService_1.RoomService.getInstance();
    }
    static getInstance() {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }
    initialize(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        this.setupEventHandlers();
    }
    setupEventHandlers() {
        if (!this.io)
            return;
        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.id}`);
            socket.on('user:join', (userId) => {
                this.handleUserJoin(socket, userId);
            });
            socket.on('user:leave', (userId) => {
                this.handleUserLeave(socket, userId);
            });
            socket.on('message:send', (messageData) => {
                this.handleMessageSend(socket, messageData);
            });
            socket.on('room:join', (request) => {
                this.handleRoomJoin(socket, request);
            });
            socket.on('room:leave', (roomId) => {
                this.handleRoomLeave(socket, roomId);
            });
            socket.on('typing:start', (roomId) => {
                this.handleTypingStart(socket, roomId);
            });
            socket.on('typing:stop', (roomId) => {
                this.handleTypingStop(socket, roomId);
            });
            socket.on('disconnect', () => {
                this.handleDisconnect(socket);
            });
        });
    }
    handleUserJoin(socket, userId) {
        const user = this.userService.getUserById(userId);
        if (!user) {
            socket.emit('error', { message: 'User not found' });
            return;
        }
        this.userService.updateUserOnlineStatus(userId, true);
        this.userSockets.set(userId, socket.id);
        this.socketUsers.set(socket.id, userId);
        const userRooms = this.roomService.getUserRooms(userId);
        userRooms.forEach(room => {
            socket.join(room.id);
        });
        socket.broadcast.emit('user:online', { userId, username: user.username });
        socket.emit('user:joined', { user, rooms: userRooms });
    }
    handleUserLeave(socket, userId) {
        this.userService.updateUserOnlineStatus(userId, false);
        this.userSockets.delete(userId);
        this.socketUsers.delete(socket.id);
        const user = this.userService.getUserById(userId);
        if (user) {
            socket.broadcast.emit('user:offline', { userId, username: user.username });
        }
    }
    handleMessageSend(socket, messageData) {
        const userId = this.socketUsers.get(socket.id);
        if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
        }
        const message = this.messageService.createMessage(messageData, userId);
        if (!message) {
            socket.emit('error', { message: 'Failed to create message' });
            return;
        }
        this.io?.to(messageData.roomId).emit('message:received', message);
        const room = this.roomService.getRoomById(messageData.roomId);
        if (room) {
            room.lastMessage = message;
        }
    }
    handleRoomJoin(socket, request) {
        const userId = this.socketUsers.get(socket.id);
        if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
        }
        const success = this.roomService.addUserToRoom(userId, request.roomId);
        if (success) {
            socket.join(request.roomId);
            socket.emit('room:joined', { roomId: request.roomId });
            socket.to(request.roomId).emit('user:joined_room', {
                userId,
                roomId: request.roomId,
                username: this.userService.getUserById(userId)?.username
            });
        }
        else {
            socket.emit('error', { message: 'Failed to join room' });
        }
    }
    handleRoomLeave(socket, roomId) {
        const userId = this.socketUsers.get(socket.id);
        if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
        }
        const success = this.roomService.removeUserFromRoom(userId, roomId);
        if (success) {
            socket.leave(roomId);
            socket.emit('room:left', { roomId });
            socket.to(roomId).emit('user:left_room', {
                userId,
                roomId,
                username: this.userService.getUserById(userId)?.username
            });
        }
        else {
            socket.emit('error', { message: 'Failed to leave room' });
        }
    }
    handleTypingStart(socket, roomId) {
        const userId = this.socketUsers.get(socket.id);
        if (!userId)
            return;
        const user = this.userService.getUserById(userId);
        if (user) {
            socket.to(roomId).emit('typing:started', {
                userId,
                username: user.username,
                roomId
            });
        }
    }
    handleTypingStop(socket, roomId) {
        const userId = this.socketUsers.get(socket.id);
        if (!userId)
            return;
        socket.to(roomId).emit('typing:stopped', { userId, roomId });
    }
    handleDisconnect(socket) {
        const userId = this.socketUsers.get(socket.id);
        if (userId) {
            this.userService.updateUserOnlineStatus(userId, false);
            this.userSockets.delete(userId);
            this.socketUsers.delete(socket.id);
            const user = this.userService.getUserById(userId);
            if (user) {
                socket.broadcast.emit('user:offline', { userId, username: user.username });
            }
        }
        console.log(`User disconnected: ${socket.id}`);
    }
    emitToUser(userId, event, data) {
        const socketId = this.userSockets.get(userId);
        if (socketId) {
            this.io?.to(socketId).emit(event, data);
        }
    }
    emitToRoom(roomId, event, data) {
        this.io?.to(roomId).emit(event, data);
    }
    emitToAll(event, data) {
        this.io?.emit(event, data);
    }
    getConnectedUsersCount() {
        return this.userSockets.size;
    }
    isUserConnected(userId) {
        return this.userSockets.has(userId);
    }
}
exports.SocketService = SocketService;
//# sourceMappingURL=SocketService.js.map