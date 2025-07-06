import { Request, Response } from 'express';
export declare class RoomController {
    private static instance;
    private roomService;
    private userService;
    private constructor();
    static getInstance(): RoomController;
    createRoom: (req: Request, res: Response) => void;
    getRoomById: (req: Request, res: Response) => void;
    getAllRooms: (req: Request, res: Response) => void;
    getPublicRooms: (req: Request, res: Response) => void;
    getUserRooms: (req: Request, res: Response) => void;
    joinRoom: (req: Request, res: Response) => void;
    leaveRoom: (req: Request, res: Response) => void;
    getRoomParticipants: (req: Request, res: Response) => void;
    deleteRoom: (req: Request, res: Response) => void;
    getStats: (req: Request, res: Response) => void;
}
//# sourceMappingURL=RoomController.d.ts.map