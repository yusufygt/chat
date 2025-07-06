# Conversational Chat Application

A real-time conversational chat application built with TypeScript, Node.js, Express, and Socket.IO. This application implements the Singleton pattern extensively for service management and provides a RESTful API for all operations.

## Features

- **Real-time Messaging**: Instant message delivery using Socket.IO
- **User Management**: Create, manage, and track user online status
- **Room Management**: Create public/private chat rooms, join/leave functionality
- **Message History**: Persistent message storage and retrieval
- **Typing Indicators**: Real-time typing status notifications
- **Modern UI**: Beautiful, responsive interface with modern design
- **RESTful API**: Complete REST API for all operations
- **Singleton Pattern**: Extensive use of singleton pattern for services

## Architecture

### Backend (TypeScript + Node.js)
- **Express.js**: Web framework for REST API
- **Socket.IO**: Real-time bidirectional communication
- **Singleton Services**: 
  - `UserService`: Manages user operations
  - `MessageService`: Handles message operations
  - `RoomService`: Manages chat rooms
  - `SocketService`: WebSocket communication
- **Controllers**: REST API endpoints
- **TypeScript**: Full type safety

### Frontend (HTML/CSS/JavaScript)
- **Modern UI**: Clean, responsive design
- **Real-time Updates**: Live message updates and status changes
- **Room Management**: Create, join, and leave rooms
- **User Authentication**: Simple user registration/login

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd conversational-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env file with your configuration
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Usage

1. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - The application will automatically serve the frontend

2. **Create a user account**
   - Enter your username and email
   - Click "Join Chat" to create your account

3. **Start chatting**
   - Join existing rooms or create new ones
   - Send messages in real-time
   - See typing indicators and online status

## API Endpoints

### Users
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/online` - Get online users
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id/status` - Update user online status
- `DELETE /api/v1/users/:id` - Delete user
- `GET /api/v1/users/stats` - Get user statistics

### Messages
- `POST /api/v1/messages` - Create a new message
- `GET /api/v1/messages/recent` - Get recent messages
- `GET /api/v1/messages/search` - Search messages
- `GET /api/v1/messages/:id` - Get message by ID
- `GET /api/v1/messages/room/:roomId` - Get messages by room
- `GET /api/v1/messages/user/:userId` - Get messages by user
- `DELETE /api/v1/messages/:id` - Delete message
- `GET /api/v1/messages/stats` - Get message statistics

### Rooms
- `POST /api/v1/rooms` - Create a new room
- `GET /api/v1/rooms` - Get all rooms
- `GET /api/v1/rooms/public` - Get public rooms
- `GET /api/v1/rooms/:id` - Get room by ID
- `GET /api/v1/rooms/:roomId/participants` - Get room participants
- `GET /api/v1/rooms/user/:userId` - Get user rooms
- `POST /api/v1/rooms/:roomId/join` - Join room
- `POST /api/v1/rooms/:roomId/leave` - Leave room
- `DELETE /api/v1/rooms/:id` - Delete room
- `GET /api/v1/rooms/stats` - Get room statistics

### System
- `GET /health` - Health check endpoint
- `GET /api/v1` - API information

## Socket.IO Events

### Client to Server
- `user:join` - User joins the chat
- `user:leave` - User leaves the chat
- `message:send` - Send a message
- `room:join` - Join a room
- `room:leave` - Leave a room
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

### Server to Client
- `user:joined` - User successfully joined
- `message:received` - New message received
- `user:joined_room` - User joined a room
- `user:left_room` - User left a room
- `user:online` - User came online
- `user:offline` - User went offline
- `typing:started` - User started typing
- `typing:stopped` - User stopped typing
- `error` - Error message

## Singleton Pattern Implementation

The application extensively uses the Singleton pattern for service management:

### UserService Singleton
```typescript
export class UserService {
  private static instance: UserService;
  
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
}
```

### Benefits of Singleton Pattern
- **Single Instance**: Ensures only one instance of each service exists
- **Global Access**: Provides global access point to services
- **Resource Management**: Efficient memory usage
- **State Management**: Centralized state management
- **Thread Safety**: Safe for concurrent access

## Project Structure

```
├── src/
│   ├── controllers/          # REST API controllers
│   │   ├── UserController.ts
│   │   ├── MessageController.ts
│   │   └── RoomController.ts
│   ├── services/            # Singleton services
│   │   ├── UserService.ts
│   │   ├── MessageService.ts
│   │   ├── RoomService.ts
│   │   └── SocketService.ts
│   ├── routes/              # API routes
│   │   ├── index.ts
│   │   ├── userRoutes.ts
│   │   ├── messageRoutes.ts
│   │   └── roomRoutes.ts
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts
│   └── server.ts            # Main server file
├── public/                  # Frontend files
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── dist/                    # Compiled JavaScript
├── package.json
├── tsconfig.json
├── env.example
└── README.md
```

## Development

### Available Scripts
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run dev` - Start development server with ts-node
- `npm run watch` - Start development server with nodemon
- `npm test` - Run tests

### TypeScript Configuration
The project uses strict TypeScript configuration with:
- Strict null checks
- No implicit any
- Strict function types
- Source maps for debugging
- Declaration files generation

## Future Enhancements

- **Database Integration**: PostgreSQL/MongoDB for persistent storage
- **Authentication**: JWT-based authentication system
- **File Upload**: Image and file sharing capabilities
- **Message Encryption**: End-to-end encryption
- **Push Notifications**: Browser push notifications
- **Mobile App**: React Native mobile application
- **Video/Audio Calls**: WebRTC integration
- **Message Reactions**: Emoji reactions to messages
- **Message Threading**: Reply to specific messages
- **User Profiles**: Extended user profile management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 