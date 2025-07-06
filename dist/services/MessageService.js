"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const uuid_1 = require("uuid");
const UserService_1 = require("./UserService");
class MessageService {
    constructor() {
        this.messages = new Map();
        this.roomMessages = new Map();
        this.userService = UserService_1.UserService.getInstance();
    }
    static getInstance() {
        if (!MessageService.instance) {
            MessageService.instance = new MessageService();
        }
        return MessageService.instance;
    }
    createMessage(messageData, senderId) {
        const sender = this.userService.getUserById(senderId);
        if (!sender)
            return null;
        const id = (0, uuid_1.v4)();
        const now = new Date();
        const message = {
            id,
            content: messageData.content,
            senderId,
            senderName: sender.username,
            timestamp: now,
            roomId: messageData.roomId,
            type: 'text'
        };
        this.messages.set(id, message);
        if (!this.roomMessages.has(messageData.roomId)) {
            this.roomMessages.set(messageData.roomId, []);
        }
        this.roomMessages.get(messageData.roomId).push(id);
        return message;
    }
    getMessageById(id) {
        return this.messages.get(id);
    }
    getMessagesByRoom(roomId, limit = 50, offset = 0) {
        const messageIds = this.roomMessages.get(roomId) || [];
        const paginatedIds = messageIds.slice(offset, offset + limit);
        return paginatedIds
            .map(id => this.messages.get(id))
            .filter((message) => message !== undefined)
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }
    getRecentMessages(limit = 20) {
        return Array.from(this.messages.values())
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }
    getMessagesByUser(userId, limit = 50) {
        return Array.from(this.messages.values())
            .filter(message => message.senderId === userId)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }
    deleteMessage(messageId, userId) {
        const message = this.messages.get(messageId);
        if (!message || message.senderId !== userId)
            return false;
        this.messages.delete(messageId);
        const roomMessages = this.roomMessages.get(message.roomId);
        if (roomMessages) {
            const index = roomMessages.indexOf(messageId);
            if (index > -1) {
                roomMessages.splice(index, 1);
            }
        }
        return true;
    }
    createSystemMessage(roomId, content) {
        const id = (0, uuid_1.v4)();
        const now = new Date();
        const message = {
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
        this.roomMessages.get(roomId).push(id);
        return message;
    }
    getMessagesCount() {
        return this.messages.size;
    }
    getRoomMessagesCount(roomId) {
        return this.roomMessages.get(roomId)?.length || 0;
    }
    searchMessages(query, roomId) {
        const searchTerm = query.toLowerCase();
        let messagesToSearch = Array.from(this.messages.values());
        if (roomId) {
            messagesToSearch = messagesToSearch.filter(message => message.roomId === roomId);
        }
        return messagesToSearch.filter(message => message.content.toLowerCase().includes(searchTerm) ||
            message.senderName.toLowerCase().includes(searchTerm));
    }
}
exports.MessageService = MessageService;
//# sourceMappingURL=MessageService.js.map