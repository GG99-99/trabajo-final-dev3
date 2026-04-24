import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
export interface ConnectedUser {
    socketId: string;
    userId: string;
    email: string;
    userType: string;
    connectedAt: Date;
}
export declare function initSocketIO(httpServer: HttpServer): SocketIOServer;
export declare function getIO(): SocketIOServer;
export declare function getConnectedUsers(): ConnectedUser[];
//# sourceMappingURL=socket.service.d.ts.map