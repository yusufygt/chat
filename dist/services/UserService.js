"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const uuid_1 = require("uuid");
class UserService {
    constructor() {
        this.users = new Map();
        this.onlineUsers = new Set();
    }
    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    createUser(userData) {
        const id = (0, uuid_1.v4)();
        const now = new Date();
        const user = {
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
    getUserById(id) {
        return this.users.get(id);
    }
    getUserByEmail(email) {
        return Array.from(this.users.values()).find(user => user.email === email);
    }
    getUserByUsername(username) {
        return Array.from(this.users.values()).find(user => user.username === username);
    }
    getAllUsers() {
        return Array.from(this.users.values());
    }
    getOnlineUsers() {
        return Array.from(this.users.values()).filter(user => user.isOnline);
    }
    updateUserOnlineStatus(userId, isOnline) {
        const user = this.users.get(userId);
        if (!user)
            return false;
        user.isOnline = isOnline;
        user.lastSeen = new Date();
        if (isOnline) {
            this.onlineUsers.add(userId);
        }
        else {
            this.onlineUsers.delete(userId);
        }
        return true;
    }
    updateLastSeen(userId) {
        const user = this.users.get(userId);
        if (!user)
            return false;
        user.lastSeen = new Date();
        return true;
    }
    deleteUser(userId) {
        const user = this.users.get(userId);
        if (!user)
            return false;
        this.users.delete(userId);
        this.onlineUsers.delete(userId);
        return true;
    }
    isUserOnline(userId) {
        return this.onlineUsers.has(userId);
    }
    getUsersCount() {
        return this.users.size;
    }
    getOnlineUsersCount() {
        return this.onlineUsers.size;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map