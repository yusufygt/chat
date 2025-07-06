"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const MessageService_1 = require("../services/MessageService");
const RoomService_1 = require("../services/RoomService");
class MessageController {
    constructor() {
        this.createMessage = (req, res) => {
            try {
                const messageData = req.body;
                const senderId = req.headers['user-id'];
                if (!messageData.content || !messageData.roomId) {
                    const response = {
                        success: false,
                        error: 'Content and roomId are required'
                    };
                    res.status(400).json(response);
                    return;
                }
                if (!senderId) {
                    const response = {
                        success: false,
                        error: 'User ID is required'
                    };
                    res.status(401).json(response);
                    return;
                }
                const room = this.roomService.getRoomById(messageData.roomId);
                if (!room) {
                    const response = {
                        success: false,
                        error: 'Room not found'
                    };
                    res.status(404).json(response);
                    return;
                }
                if (!room.participants.includes(senderId)) {
                    const response = {
                        success: false,
                        error: 'User is not a participant in this room'
                    };
                    res.status(403).json(response);
                    return;
                }
                const message = this.messageService.createMessage(messageData, senderId);
                if (!message) {
                    const response = {
                        success: false,
                        error: 'Failed to create message'
                    };
                    res.status(500).json(response);
                    return;
                }
                const response = {
                    success: true,
                    data: message,
                    message: 'Message created successfully'
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
        this.getMessageById = (req, res) => {
            try {
                const { id } = req.params;
                const message = this.messageService.getMessageById(id);
                if (!message) {
                    const response = {
                        success: false,
                        error: 'Message not found'
                    };
                    res.status(404).json(response);
                    return;
                }
                const response = {
                    success: true,
                    data: message
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
        this.getMessagesByRoom = (req, res) => {
            try {
                const { roomId } = req.params;
                const limit = parseInt(req.query.limit) || 50;
                const offset = parseInt(req.query.offset) || 0;
                const room = this.roomService.getRoomById(roomId);
                if (!room) {
                    const response = {
                        success: false,
                        error: 'Room not found'
                    };
                    res.status(404).json(response);
                    return;
                }
                const messages = this.messageService.getMessagesByRoom(roomId, limit, offset);
                const response = {
                    success: true,
                    data: messages
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
        this.getRecentMessages = (req, res) => {
            try {
                const limit = parseInt(req.query.limit) || 20;
                const messages = this.messageService.getRecentMessages(limit);
                const response = {
                    success: true,
                    data: messages
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
        this.getMessagesByUser = (req, res) => {
            try {
                const { userId } = req.params;
                const limit = parseInt(req.query.limit) || 50;
                const messages = this.messageService.getMessagesByUser(userId, limit);
                const response = {
                    success: true,
                    data: messages
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
        this.deleteMessage = (req, res) => {
            try {
                const { id } = req.params;
                const userId = req.headers['user-id'];
                if (!userId) {
                    const response = {
                        success: false,
                        error: 'User ID is required'
                    };
                    res.status(401).json(response);
                    return;
                }
                const success = this.messageService.deleteMessage(id, userId);
                if (!success) {
                    const response = {
                        success: false,
                        error: 'Message not found or unauthorized'
                    };
                    res.status(404).json(response);
                    return;
                }
                const response = {
                    success: true,
                    message: 'Message deleted successfully'
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
        this.searchMessages = (req, res) => {
            try {
                const { query } = req.query;
                const { roomId } = req.query;
                if (!query || typeof query !== 'string') {
                    const response = {
                        success: false,
                        error: 'Search query is required'
                    };
                    res.status(400).json(response);
                    return;
                }
                const messages = this.messageService.searchMessages(query, roomId);
                const response = {
                    success: true,
                    data: messages
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
                    totalMessages: this.messageService.getMessagesCount()
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
        this.messageService = MessageService_1.MessageService.getInstance();
        this.roomService = RoomService_1.RoomService.getInstance();
    }
    static getInstance() {
        if (!MessageController.instance) {
            MessageController.instance = new MessageController();
        }
        return MessageController.instance;
    }
}
exports.MessageController = MessageController;
//# sourceMappingURL=MessageController.js.map