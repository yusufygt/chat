"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
class UserController {
    constructor() {
        this.createUser = (req, res) => {
            try {
                const userData = req.body;
                if (!userData.username || !userData.email) {
                    const response = {
                        success: false,
                        error: 'Username and email are required'
                    };
                    res.status(400).json(response);
                    return;
                }
                const existingUser = this.userService.getUserByEmail(userData.email);
                if (existingUser) {
                    const response = {
                        success: false,
                        error: 'User with this email already exists'
                    };
                    res.status(409).json(response);
                    return;
                }
                const existingUsername = this.userService.getUserByUsername(userData.username);
                if (existingUsername) {
                    const response = {
                        success: false,
                        error: 'Username already taken'
                    };
                    res.status(409).json(response);
                    return;
                }
                const user = this.userService.createUser(userData);
                const response = {
                    success: true,
                    data: user,
                    message: 'User created successfully'
                };
                res.status(201).json(response);
            }
            catch (error) {
                const response = {
                    success: false,
                    error: 'Internal server error'
                };
                res.status(500).json(response);
            }
        };
        this.getUserById = (req, res) => {
            try {
                const { id } = req.params;
                const user = this.userService.getUserById(id);
                if (!user) {
                    const response = {
                        success: false,
                        error: 'User not found'
                    };
                    res.status(404).json(response);
                    return;
                }
                const response = {
                    success: true,
                    data: user
                };
                res.status(200).json(response);
            }
            catch (error) {
                const response = {
                    success: false,
                    error: 'Internal server error'
                };
                res.status(500).json(response);
            }
        };
        this.getAllUsers = (req, res) => {
            try {
                const users = this.userService.getAllUsers();
                const response = {
                    success: true,
                    data: users
                };
                res.status(200).json(response);
            }
            catch (error) {
                const response = {
                    success: false,
                    error: 'Internal server error'
                };
                res.status(500).json(response);
            }
        };
        this.getOnlineUsers = (req, res) => {
            try {
                const users = this.userService.getOnlineUsers();
                const response = {
                    success: true,
                    data: users
                };
                res.status(200).json(response);
            }
            catch (error) {
                const response = {
                    success: false,
                    error: 'Internal server error'
                };
                res.status(500).json(response);
            }
        };
        this.updateUserStatus = (req, res) => {
            try {
                const { id } = req.params;
                const { isOnline } = req.body;
                if (typeof isOnline !== 'boolean') {
                    const response = {
                        success: false,
                        error: 'isOnline must be a boolean'
                    };
                    res.status(400).json(response);
                    return;
                }
                const success = this.userService.updateUserOnlineStatus(id, isOnline);
                if (!success) {
                    const response = {
                        success: false,
                        error: 'User not found'
                    };
                    res.status(404).json(response);
                    return;
                }
                const response = {
                    success: true,
                    message: 'User status updated successfully'
                };
                res.status(200).json(response);
            }
            catch (error) {
                const response = {
                    success: false,
                    error: 'Internal server error'
                };
                res.status(500).json(response);
            }
        };
        this.deleteUser = (req, res) => {
            try {
                const { id } = req.params;
                const success = this.userService.deleteUser(id);
                if (!success) {
                    const response = {
                        success: false,
                        error: 'User not found'
                    };
                    res.status(404).json(response);
                    return;
                }
                const response = {
                    success: true,
                    message: 'User deleted successfully'
                };
                res.status(200).json(response);
            }
            catch (error) {
                const response = {
                    success: false,
                    error: 'Internal server error'
                };
                res.status(500).json(response);
            }
        };
        this.getStats = (req, res) => {
            try {
                const stats = {
                    totalUsers: this.userService.getUsersCount(),
                    onlineUsers: this.userService.getOnlineUsersCount()
                };
                const response = {
                    success: true,
                    data: stats
                };
                res.status(200).json(response);
            }
            catch (error) {
                const response = {
                    success: false,
                    error: 'Internal server error'
                };
                res.status(500).json(response);
            }
        };
        this.userService = UserService_1.UserService.getInstance();
    }
    static getInstance() {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map