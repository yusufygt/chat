import { User, CreateUserRequest } from '../types';
export declare class UserService {
    private static instance;
    private users;
    private onlineUsers;
    private constructor();
    static getInstance(): UserService;
    createUser(userData: CreateUserRequest): User;
    getUserById(id: string): User | undefined;
    getUserByEmail(email: string): User | undefined;
    getUserByUsername(username: string): User | undefined;
    getAllUsers(): User[];
    getOnlineUsers(): User[];
    updateUserOnlineStatus(userId: string, isOnline: boolean): boolean;
    updateLastSeen(userId: string): boolean;
    deleteUser(userId: string): boolean;
    isUserOnline(userId: string): boolean;
    getUsersCount(): number;
    getOnlineUsersCount(): number;
}
//# sourceMappingURL=UserService.d.ts.map