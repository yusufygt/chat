import { Request, Response } from 'express';
export declare class MessageController {
    private static instance;
    private messageService;
    private roomService;
    private constructor();
    static getInstance(): MessageController;
    createMessage: (req: Request, res: Response) => void;
    getMessageById: (req: Request, res: Response) => void;
    getMessagesByRoom: (req: Request, res: Response) => void;
    getRecentMessages: (req: Request, res: Response) => void;
    getMessagesByUser: (req: Request, res: Response) => void;
    deleteMessage: (req: Request, res: Response) => void;
    searchMessages: (req: Request, res: Response) => void;
    getStats: (req: Request, res: Response) => void;
}
//# sourceMappingURL=MessageController.d.ts.map