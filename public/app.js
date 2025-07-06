// Global variables
let socket;
let currentUser = null;
let currentRoom = null;
let rooms = [];
let typingTimeout;

// DOM elements
const loginSection = document.getElementById('loginSection');
const chatSection = document.getElementById('chatSection');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const createRoomBtn = document.getElementById('createRoomBtn');
const createRoomModal = document.getElementById('createRoomModal');
const createRoomForm = document.getElementById('createRoomForm');
const closeCreateRoomModal = document.getElementById('closeCreateRoomModal');
const cancelCreateRoom = document.getElementById('cancelCreateRoom');
const roomList = document.getElementById('roomList');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const leaveRoomBtn = document.getElementById('leaveRoomBtn');
const currentRoomName = document.getElementById('currentRoomName');
const userInfo = document.getElementById('userInfo');
const currentUserSpan = document.getElementById('currentUser');
const onlineUsersSpan = document.getElementById('onlineUsers');
const typingIndicator = document.getElementById('typingIndicator');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    checkForExistingUser();
});

function initializeEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Create room
    createRoomBtn.addEventListener('click', showCreateRoomModal);
    closeCreateRoomModal.addEventListener('click', hideCreateRoomModal);
    cancelCreateRoom.addEventListener('click', hideCreateRoomModal);
    createRoomForm.addEventListener('submit', handleCreateRoom);
    
    // Message input
    messageInput.addEventListener('input', handleTyping);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    sendMessageBtn.addEventListener('click', sendMessage);
    
    // Room actions
    joinRoomBtn.addEventListener('click', joinCurrentRoom);
    leaveRoomBtn.addEventListener('click', leaveCurrentRoom);
    
    // Close modal on outside click
    createRoomModal.addEventListener('click', (e) => {
        if (e.target === createRoomModal) {
            hideCreateRoomModal();
        }
    });
}

function checkForExistingUser() {
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showChatSection();
        initializeSocket();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    
    try {
        const response = await fetch('/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.data;
            localStorage.setItem('chatUser', JSON.stringify(currentUser));
            showChatSection();
            initializeSocket();
        } else {
            alert(data.error || 'Failed to create user');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Failed to connect to server');
    }
}

function handleLogout() {
    if (socket) {
        socket.disconnect();
    }
    currentUser = null;
    currentRoom = null;
    localStorage.removeItem('chatUser');
    showLoginSection();
}

function showLoginSection() {
    loginSection.classList.remove('hidden');
    chatSection.classList.add('hidden');
}

function showChatSection() {
    loginSection.classList.add('hidden');
    chatSection.classList.remove('hidden');
    updateUserInfo();
}

function initializeSocket() {
    socket = io();
    
    socket.on('connect', () => {
        console.log('Connected to server');
        socket.emit('user:join', currentUser.id);
    });
    
    socket.on('user:joined', (data) => {
        console.log('User joined:', data);
        rooms = data.rooms;
        updateRoomList();
        loadMessages();
    });
    
    socket.on('message:received', (message) => {
        addMessageToUI(message);
    });
    
    socket.on('user:joined_room', (data) => {
        addSystemMessage(`${data.username} joined the room`);
    });
    
    socket.on('user:left_room', (data) => {
        addSystemMessage(`${data.username} left the room`);
    });
    
    socket.on('user:online', (data) => {
        updateOnlineCount();
    });
    
    socket.on('user:offline', (data) => {
        updateOnlineCount();
    });
    
    socket.on('typing:started', (data) => {
        showTypingIndicator(data.username);
    });
    
    socket.on('typing:stopped', (data) => {
        hideTypingIndicator();
    });
    
    socket.on('error', (data) => {
        alert(data.message || 'An error occurred');
    });
    
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
}

function updateUserInfo() {
    if (currentUser) {
        userInfo.textContent = `Logged in as ${currentUser.username}`;
        currentUserSpan.textContent = currentUser.username;
    }
}

async function loadRooms() {
    try {
        const response = await fetch('/api/v1/rooms');
        const data = await response.json();
        
        if (data.success) {
            rooms = data.data;
            updateRoomList();
        }
    } catch (error) {
        console.error('Failed to load rooms:', error);
    }
}

function updateRoomList() {
    roomList.innerHTML = '';
    
    rooms.forEach(room => {
        const roomElement = document.createElement('div');
        roomElement.className = 'room-item';
        if (currentRoom && currentRoom.id === room.id) {
            roomElement.classList.add('active');
        }
        
        roomElement.innerHTML = `
            <div class="room-name">${room.name}</div>
            <div class="room-description">${room.description || 'No description'}</div>
        `;
        
        roomElement.addEventListener('click', () => selectRoom(room));
        roomList.appendChild(roomElement);
    });
}

function selectRoom(room) {
    currentRoom = room;
    currentRoomName.textContent = room.name;
    
    // Update room list active state
    document.querySelectorAll('.room-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.room-item').classList.add('active');
    
    // Enable/disable buttons
    const isInRoom = room.participants.includes(currentUser.id);
    joinRoomBtn.disabled = isInRoom;
    leaveRoomBtn.disabled = !isInRoom;
    messageInput.disabled = !isInRoom;
    sendMessageBtn.disabled = !isInRoom;
    
    // Load messages for this room
    loadMessages();
}

async function loadMessages() {
    if (!currentRoom) return;
    
    try {
        const response = await fetch(`/api/v1/messages/room/${currentRoom.id}`);
        const data = await response.json();
        
        if (data.success) {
            messagesContainer.innerHTML = '';
            data.data.forEach(message => {
                addMessageToUI(message);
            });
            scrollToBottom();
        }
    } catch (error) {
        console.error('Failed to load messages:', error);
    }
}

function addMessageToUI(message) {
    if (message.type === 'system') {
        addSystemMessage(message.content);
        return;
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.senderId === currentUser.id ? 'own' : ''}`;
    
    const time = new Date(message.timestamp).toLocaleTimeString();
    
    messageElement.innerHTML = `
        <div class="message-content">
            <div class="message-header">
                <span class="message-sender">${message.senderName}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-text">${escapeHtml(message.content)}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
}

function addSystemMessage(content) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message system';
    messageElement.innerHTML = `
        <div class="message-content">
            <div class="message-text">${escapeHtml(content)}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleTyping() {
    if (!currentRoom) return;
    
    clearTimeout(typingTimeout);
    socket.emit('typing:start', currentRoom.id);
    
    typingTimeout = setTimeout(() => {
        socket.emit('typing:stop', currentRoom.id);
    }, 1000);
}

function showTypingIndicator(username) {
    typingIndicator.textContent = `${username} is typing...`;
    typingIndicator.style.display = 'block';
}

function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

async function sendMessage() {
    const content = messageInput.value.trim();
    if (!content || !currentRoom) return;
    
    try {
        const response = await fetch('/api/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': currentUser.id
            },
            body: JSON.stringify({
                content,
                roomId: currentRoom.id
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            messageInput.value = '';
            socket.emit('typing:stop', currentRoom.id);
        } else {
            alert(data.error || 'Failed to send message');
        }
    } catch (error) {
        console.error('Failed to send message:', error);
        alert('Failed to send message');
    }
}

async function joinCurrentRoom() {
    if (!currentRoom) return;
    
    try {
        const response = await fetch(`/api/v1/rooms/${currentRoom.id}/join`, {
            method: 'POST',
            headers: {
                'user-id': currentUser.id
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            socket.emit('room:join', { roomId: currentRoom.id });
            joinRoomBtn.disabled = true;
            leaveRoomBtn.disabled = false;
            messageInput.disabled = false;
            sendMessageBtn.disabled = false;
            loadRooms(); // Refresh room list
        } else {
            alert(data.error || 'Failed to join room');
        }
    } catch (error) {
        console.error('Failed to join room:', error);
        alert('Failed to join room');
    }
}

async function leaveCurrentRoom() {
    if (!currentRoom) return;
    
    try {
        const response = await fetch(`/api/v1/rooms/${currentRoom.id}/leave`, {
            method: 'POST',
            headers: {
                'user-id': currentUser.id
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            socket.emit('room:leave', currentRoom.id);
            joinRoomBtn.disabled = false;
            leaveRoomBtn.disabled = true;
            messageInput.disabled = true;
            sendMessageBtn.disabled = true;
            loadRooms(); // Refresh room list
        } else {
            alert(data.error || 'Failed to leave room');
        }
    } catch (error) {
        console.error('Failed to leave room:', error);
        alert('Failed to leave room');
    }
}

function showCreateRoomModal() {
    createRoomModal.classList.remove('hidden');
}

function hideCreateRoomModal() {
    createRoomModal.classList.add('hidden');
    createRoomForm.reset();
}

async function handleCreateRoom(e) {
    e.preventDefault();
    
    const name = document.getElementById('roomName').value;
    const description = document.getElementById('roomDescription').value;
    const isPrivate = document.getElementById('isPrivate').checked;
    
    try {
        const response = await fetch('/api/v1/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': currentUser.id
            },
            body: JSON.stringify({
                name,
                description,
                isPrivate
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            hideCreateRoomModal();
            loadRooms(); // Refresh room list
            alert('Room created successfully!');
        } else {
            alert(data.error || 'Failed to create room');
        }
    } catch (error) {
        console.error('Failed to create room:', error);
        alert('Failed to create room');
    }
}

async function updateOnlineCount() {
    try {
        const response = await fetch('/api/v1/users/online');
        const data = await response.json();
        
        if (data.success) {
            onlineUsersSpan.textContent = data.data.length;
        }
    } catch (error) {
        console.error('Failed to update online count:', error);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update online count periodically
setInterval(updateOnlineCount, 30000); 