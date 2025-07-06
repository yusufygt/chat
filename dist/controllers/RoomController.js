"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const RoomService_1 = require("../services/RoomService");
const UserService_1 = require("../services/UserService");
class RoomController {
    constructor() {
        this.createRoom = (req, res) => {
            try {
                const roomData = req.body;
                const creatorId = req.headers['user-id'];
                if (!roomData.name) {
                    const response = {
                        success: false,
                        error: 'Room name is required'
                    };
                    res.status(400).json(response);
                    return;
                }
                if (!creatorId) {
                    const response = {
                        success: false,
                        error: 'User ID is required'
                    };
                    res.status(401).json(response);
                    return;
                }
                const creator = this.userService.getUserById(creatorId);
                if (!creator) {
                    const response = {
                        success: false,
                        error: 'Creator user not found'
                    };
                    res.status(404).json(response);
                    return;
                }
                if (roomData.participants) {
                    for (const participantId of roomData.participants) {
                        const participant = this.userService.getUserById(participantId);
                        if (!participant) {
                            const response = {
                                success: false,
                                error: `Participant with ID ${participantId} not found`
                            };
                            res.status(404).json(response);
                            return;
                        }
                    }
                }
                const room = this.roomService.createRoom(roomData, creatorId);
                if (!room) {
                    const response = {
                        success: false,
                        error: 'Failed to create room'
                    };
                    res.status(500).json(response);
                    return;
                }
                const response = {
                    success: true,
                    data: room,
                    message: 'Room created successfully'
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
        this.getRoomById = (req, res) => {
            try {
                const { id } = req.params;
                const room = this.roomService.getRoomById(id);
                if (!room) {
                    const response = {
                        success: false,
                        error: 'Room not found'
                    };
                    res.status(404).json(response);
                    return;
                }
                const response = {
                    success: true,
                    data: room
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
        this.getAllRooms = (req, res) => {
            try {
                const rooms = this.roomService.getAllRooms();
                const response = {
                    success: true,
                    data: rooms
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
        this.getPublicRooms = (req, res) => {
            try {
                const rooms = this.roomService.getPublicRooms();
                const response = {
                    success: true,
                    data: rooms
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
        this.getUserRooms = (req, res) => {
            try {
                const { userId } = req.params;
                const rooms = this.roomService.getUserRooms(userId);
                const response = {
                    success: true,
                    data: rooms
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
        this.joinRoom = (req, res) => {
            try {
                const { roomId } = req.params;
                const userId = req.headers['user-id'];
                if (!userId) {
                    const response = {
                        success: false,
                        error: 'User ID is required'
                    };
                    res.status(401).json(response);
                    return;
                }
                const success = this.roomService.addUserToRoom(userId, roomId);
                if (!success) {
                    const response = {
                        success: false,
                        error: 'Failed to join room'
                    };
                    res.status(400).json(response);
                    return;
                }
                const response = {
                    success: true,
                    message: 'Successfully joined room'
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
        this.leaveRoom = (req, res) => {
            try {
                const { roomId } = req.params;
                const userId = req.headers['user-id'];
                if (!userId) {
                    const response = {
                        success: false,
                        error: 'User ID is required'
                    };
                    res.status(401).json(response);
                    return;
                }
                const success = this.roomService.removeUserFromRoom(userId, roomId);
                if (!success) {
                    const response = {
                        success: false,
                        error: 'Failed to leave room'
                    };
                    res.status(400).json(response);
                    return;
                }
                const response = {
                    success: true,
                    message: 'Successfully left room'
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
        this.getRoomParticipants = (req, res) => {
            try {
                const { roomId } = req.params;
                const participantIds = this.roomService.getRoomParticipants(roomId);
                const participants = participantIds
                    .map(id => this.userService.getUserById(id))
                    .filter(user => user !== undefined);
                const response = {
                    success: true,
                    data: participants
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
        this.deleteRoom = (req, res) => {
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
                const success = this.roomService.deleteRoom(id, userId);
                if (!success) {
                    const response = {
                        success: false,
                        error: 'Room not found or unauthorized'
                    };
                    res.status(404).json(response);
                    return;
                }
                const response = {
                    success: true,
                    message: 'Room deleted successfully'
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
                    totalRooms: this.roomService.getRoomsCount()
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
        this.roomService = RoomService_1.RoomService.getInstance();
        this.userService = UserService_1.UserService.getInstance();
    }
    static getInstance() {
        if (!RoomController.instance) {
            RoomController.instance = new RoomController();
        }
        return RoomController.instance;
    }
}
exports.RoomController = RoomController;
//# sourceMappingURL=RoomController.js.map