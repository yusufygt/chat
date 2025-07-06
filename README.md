# Conversational Chat Application

A modern, real-time chat application built with TypeScript, Node.js, and Svelte. Features a RESTful API backend with extensive use of the singleton pattern and a responsive Svelte frontend.

## 🚀 Features

### Backend (TypeScript + Node.js)
- **RESTful API** with Express.js
- **Real-time messaging** with Socket.IO
- **Singleton Pattern** implementation for services
- **User management** (create, update, delete, online status)
- **Room management** (create, join, leave, public/private rooms)
- **Message handling** (send, receive, search, delete)
- **Security** with Helmet.js and CORS
- **TypeScript** for type safety

### Frontend (Svelte)
- **Modern UI** with responsive design
- **Real-time updates** with Socket.IO client
- **User authentication** and session management
- **Room management** interface
- **Live typing indicators**
- **Online user status**
- **Message history** and search
- **Mobile-responsive** design

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **Helmet.js** - Security middleware
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

### Frontend
- **Svelte** - Modern reactive framework
- **TypeScript** - Type safety
- **Socket.IO Client** - Real-time communication
- **Font Awesome** - Icons
- **CSS3** - Styling with modern features

## 📁 Project Structure

```
deneme1/
├── src/                    # Backend source code
│   ├── controllers/        # REST API controllers
│   ├── routes/            # API routes
│   ├── services/          # Singleton services
│   ├── types/             # TypeScript type definitions
│   └── server.ts          # Main server file
├── frontend/              # Svelte frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/ # Svelte components
│   │   │   ├── stores.ts   # Svelte stores
│   │   │   ├── api.ts      # API service
│   │   │   ├── socket.ts   # Socket.IO service
│   │   │   └── types.ts    # TypeScript types
│   │   └── routes/         # SvelteKit routes
│   └── build/             # Built frontend files
├── package.json           # Backend dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd deneme1
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Build the application**
   ```bash
   npm run build
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Development Commands

```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Build both backend and frontend
npm run build

# Build only backend
npm run build:backend

# Build only frontend
npm run build:frontend

# Start development server (backend)
npm run dev

# Start frontend development server
npm run dev:frontend

# Start production server
npm start

# Run tests
npm test
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### API Endpoints

The backend provides the following RESTful API endpoints:

#### Users
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/online` - Get online users
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id/status` - Update user status
- `DELETE /api/v1/users/:id` - Delete user

#### Messages
- `POST /api/v1/messages` - Send a message
- `GET /api/v1/messages/room/:roomId` - Get messages by room
- `GET /api/v1/messages/recent` - Get recent messages
- `GET /api/v1/messages/user/:userId` - Get messages by user
- `DELETE /api/v1/messages/:id` - Delete message
- `GET /api/v1/messages/search` - Search messages

#### Rooms
- `POST /api/v1/rooms` - Create a new room
- `GET /api/v1/rooms` - Get all rooms
- `GET /api/v1/rooms/public` - Get public rooms
- `GET /api/v1/rooms/:id` - Get room by ID
- `POST /api/v1/rooms/:id/join` - Join a room
- `POST /api/v1/rooms/:id/leave` - Leave a room
- `GET /api/v1/rooms/:id/participants` - Get room participants
- `DELETE /api/v1/rooms/:id` - Delete room

#### Health Check
- `GET /health` - Health check endpoint

## 🔌 Socket.IO Events

### Client to Server
- `user:join` - User joins the chat
- `message:send` - Send a message
- `room:join` - Join a room
- `room:leave` - Leave a room
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

### Server to Client
- `user:joined` - User joined notification
- `message:received` - New message received
- `user:joined_room` - User joined room notification
- `user:left_room` - User left room notification
- `user:online` - User came online
- `user:offline` - User went offline
- `typing:started` - User started typing
- `typing:stopped` - User stopped typing

## 🎨 Frontend Components

### Core Components
- **Login.svelte** - User authentication
- **Chat.svelte** - Main chat interface
- **Sidebar.svelte** - Room management sidebar
- **MessageArea.svelte** - Message display and input
- **Message.svelte** - Individual message component
- **CreateRoomModal.svelte** - Room creation modal

### State Management
- **stores.ts** - Svelte stores for state management
- **api.ts** - API service for backend communication
- **socket.ts** - Socket.IO service for real-time features

## 🔒 Security Features

- **Content Security Policy (CSP)** with Helmet.js
- **CORS** configuration for cross-origin requests
- **Input validation** and sanitization
- **Rate limiting** (can be added)
- **Authentication** (can be extended)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔄 Real-time Features

- **Live messaging** with instant delivery
- **Typing indicators** showing when users are typing
- **Online/offline status** updates
- **Room join/leave notifications**
- **Message history** persistence

## 🚀 Deployment

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

### Environment Variables for Production

```env
PORT=3000
CORS_ORIGIN=https://yourdomain.com
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ using TypeScript, Node.js, and Svelte** 