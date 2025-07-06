<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    currentUser, 
    rooms, 
    currentRoom, 
    currentRoomMessages, 
    onlineUsers, 
    isTyping, 
    isInCurrentRoom,
    chatActions 
  } from '../stores';
  import Sidebar from './Sidebar.svelte';
  import MessageArea from './MessageArea.svelte';
  import CreateRoomModal from './CreateRoomModal.svelte';

  let typingTimeout: number;

  onMount(() => {
    // Update online users periodically
    const interval = setInterval(() => {
      chatActions.updateOnlineUsers();
    }, 30000);

    return () => clearInterval(interval);
  });

  function handleLogout() {
    chatActions.logout();
  }
</script>

<div class="chat-section">
  <!-- Header -->
  <header class="chat-header">
    <div class="header-left">
      <h2>💬 Chat App</h2>
      {#if $currentUser}
        <span class="user-info">Logged in as {$currentUser.username}</span>
      {/if}
    </div>
    <div class="header-right">
      <span class="online-count">
        <i class="fas fa-circle online-indicator"></i> {$onlineUsers.length} online
      </span>
      <button class="btn-secondary" on:click={handleLogout}>
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
  </header>

  <div class="chat-container">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Chat Area -->
    <MessageArea />
  </div>
</div>

<!-- Create Room Modal -->
<CreateRoomModal />

<style>
  .chat-section {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .chat-header {
    background: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }

  .header-left h2 {
    color: #667eea;
    font-size: 1.5rem;
  }

  .user-info {
    color: #666;
    font-size: 0.9rem;
    margin-left: 10px;
  }

  .online-count {
    color: #28a745;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .online-indicator {
    color: #28a745;
    font-size: 0.8rem;
  }

  .chat-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .btn-secondary {
    background: #f8f9fa;
    color: #667eea;
    border: 2px solid #667eea;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .btn-secondary:hover {
    background: #667eea;
    color: white;
  }

  @media (max-width: 768px) {
    .chat-container {
      flex-direction: column;
    }
    
    .chat-header {
      padding: 10px 15px;
    }
  }
</style> 