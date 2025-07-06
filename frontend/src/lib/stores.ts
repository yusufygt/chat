import { writable, derived } from 'svelte/store';
import type { User, Message, ChatRoom } from './types';
import { apiService } from './api';
import { socketService } from './socket';

// User store
export const currentUser = writable<User | null>(null);

// Rooms store
export const rooms = writable<ChatRoom[]>([]);
export const currentRoom = writable<ChatRoom | null>(null);

// Messages store
export const messages = writable<Message[]>([]);

// Online users store
export const onlineUsers = writable<User[]>([]);

// UI state stores
export const isTyping = writable<{ [roomId: string]: string[] }>({});
export const showCreateRoomModal = writable(false);
export const isLoading = writable(false);

// Derived stores
export const isInCurrentRoom = derived(
  [currentUser, currentRoom],
  ([$currentUser, $currentRoom]) => {
    if (!$currentUser || !$currentRoom) return false;
    return $currentRoom.participants.includes($currentUser.id);
  }
);

export const currentRoomMessages = derived(
  [messages, currentRoom],
  ([$messages, $currentRoom]) => {
    if (!$currentRoom) return [];
    return $messages.filter(msg => msg.roomId === $currentRoom.id);
  }
);

// Actions
export const chatActions = {
  // User actions
  async login(username: string, email: string): Promise<boolean> {
    try {
      isLoading.set(true);
      const response = await apiService.createUser({ username, email });
      
      if (response.success && response.data) {
        currentUser.set(response.data);
        socketService.connect(response.data.id);
        this.setupSocketListeners();
        await this.loadRooms();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      isLoading.set(false);
    }
  },

  logout(): void {
    socketService.disconnect();
    currentUser.set(null);
    currentRoom.set(null);
    rooms.set([]);
    messages.set([]);
    onlineUsers.set([]);
    isTyping.set({});
  },

  // Room actions
  async loadRooms(): Promise<void> {
    try {
      const response = await apiService.getAllRooms();
      if (response.success && response.data) {
        rooms.set(response.data);
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  },

  async createRoom(name: string, description: string, isPrivate: boolean): Promise<boolean> {
    try {
      const user = get(currentUser) as User | null;
      if (!user) return false;

      const response = await apiService.createRoom(
        { name, description, isPrivate },
        user.id
      );

      if (response.success) {
        await this.loadRooms();
        showCreateRoomModal.set(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create room:', error);
      return false;
    }
  },

  async joinRoom(roomId: string): Promise<boolean> {
    try {
      const user = get(currentUser) as User | null;
      if (!user) return false;

      const response = await apiService.joinRoom(roomId, user.id);
      
      if (response.success) {
        socketService.joinRoom(roomId);
        await this.loadRooms();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to join room:', error);
      return false;
    }
  },

  async leaveRoom(roomId: string): Promise<boolean> {
    try {
      const user = get(currentUser) as User | null;
      if (!user) return false;

      const response = await apiService.leaveRoom(roomId, user.id);
      
      if (response.success) {
        socketService.leaveRoom(roomId);
        await this.loadRooms();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to leave room:', error);
      return false;
    }
  },

  selectRoom(room: ChatRoom): void {
    currentRoom.set(room);
    this.loadMessages(room.id);
  },

  // Message actions
  async loadMessages(roomId: string): Promise<void> {
    try {
      const response = await apiService.getMessagesByRoom(roomId);
      if (response.success && response.data) {
        messages.set(response.data);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  },

  async sendMessage(content: string): Promise<boolean> {
    try {
      const user = get(currentUser) as User | null;
      const room = get(currentRoom) as ChatRoom | null;
      
      if (!user || !room) return false;

      const response = await apiService.createMessage(
        { content, roomId: room.id },
        user.id
      );

      if (response.success) {
        socketService.stopTyping(room.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  },

  handleTyping(): void {
    const room = get(currentRoom) as ChatRoom | null;
    if (!room) return;

    socketService.startTyping(room.id);
    
    // Stop typing after 1 second
    setTimeout(() => {
      socketService.stopTyping(room.id);
    }, 1000);
  },

  // Socket event handlers
  setupSocketListeners(): void {
    socketService.onUserJoined((data) => {
      rooms.set(data.rooms || []);
    });

    socketService.onMessageReceived((message) => {
      messages.update(msgs => [...msgs, message]);
    });

    socketService.onUserJoinedRoom((data) => {
      this.addSystemMessage(`${data.username} joined the room`);
    });

    socketService.onUserLeftRoom((data) => {
      this.addSystemMessage(`${data.username} left the room`);
    });

    socketService.onTypingStarted((data) => {
      isTyping.update(typing => ({
        ...typing,
        [data.roomId]: [...(typing[data.roomId] || []), data.username]
      }));
    });

    socketService.onTypingStopped((data) => {
      isTyping.update(typing => ({
        ...typing,
        [data.roomId]: (typing[data.roomId] || []).filter(name => name !== data.username)
      }));
    });

    socketService.onError((data) => {
      console.error('Socket error:', data);
    });
  },

  addSystemMessage(content: string): void {
    const room = get(currentRoom) as ChatRoom | null;
    const systemMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: 'system',
      senderName: 'System',
      timestamp: new Date(),
      roomId: room?.id || '',
      type: 'system'
    };
    
    messages.update(msgs => [...msgs, systemMessage]);
  },

  // Update online users
  async updateOnlineUsers(): Promise<void> {
    try {
      const response = await apiService.getOnlineUsers();
      if (response.success && response.data) {
        onlineUsers.set(response.data);
      }
    } catch (error) {
      console.error('Failed to update online users:', error);
    }
  }
};

// Helper function to get store value
function get<T>(store: any): T {
  let value: T;
  store.subscribe((val: T) => value = val)();
  return value!;
} 