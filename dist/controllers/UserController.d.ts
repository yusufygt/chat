import { Request, Response } from 'express';
export declare class UserController {
    private static instance;
    private userService;
    private constructor();
    static getInstance(): UserController;
    createUser: (req: Request, res: Response) => void;
    getUserById: (req: Request, res: Response) => void;
    getAllUsers: (req: Request, res: Response) => void;
    getOnlineUsers: (req: Request, res: Response) => void;
    updateUserStatus: (req: Request, res: Response) => void;
    deleteUser: (req: Request, res: Response) => void;
    getStats: (req: Request, res: Response) => void;
}
//# sourceMappingURL=UserController.d.ts.map