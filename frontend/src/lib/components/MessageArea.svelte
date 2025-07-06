<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    currentRoom, 
    currentRoomMessages, 
    isInCurrentRoom, 
    isTyping, 
    chatActions 
  } from '../stores';
  import Message from './Message.svelte';

  let messageInput = '';
  let messagesContainer: HTMLElement;

  onMount(() => {
    scrollToBottom();
  });

  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  async function sendMessage() {
    if (!messageInput.trim() || !$currentRoom) return;

    const success = await chatActions.sendMessage(messageInput.trim());
    if (success) {
      messageInput = '';
      setTimeout(scrollToBottom, 100);
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function handleTyping() {
    chatActions.handleTyping();
  }

  $: if ($currentRoomMessages.length > 0) {
    setTimeout(scrollToBottom, 100);
  }
</script>

<main class="chat-main">
  <div class="chat-header-room">
    <h3>{$currentRoom?.name || 'Select a room'}</h3>
    <div class="room-actions">
      {#if $currentRoom}
        {#if $isInCurrentRoom}
          <button 
            class="btn-secondary" 
            on:click={() => chatActions.leaveRoom($currentRoom.id)}
          >
            <i class="fas fa-sign-out-alt"></i> Leave Room
          </button>
        {:else}
          <button 
            class="btn-secondary" 
            on:click={() => chatActions.joinRoom($currentRoom.id)}
          >
            <i class="fas fa-sign-in-alt"></i> Join Room
          </button>
        {/if}
      {/if}
    </div>
  </div>

  <div class="messages-container" bind:this={messagesContainer}>
    {#if !$currentRoom}
      <div class="welcome-message">
        <i class="fas fa-comments"></i>
        <h3>Welcome to Chat App!</h3>
        <p>Select a room to start chatting</p>
      </div>
    {:else if $currentRoomMessages.length === 0}
      <div class="welcome-message">
        <i class="fas fa-comments"></i>
        <h3>No messages yet</h3>
        <p>Be the first to send a message!</p>
      </div>
    {:else}
      {#each $currentRoomMessages as message (message.id)}
        <Message {message} />
      {/each}
    {/if}
  </div>

  <div class="message-input-container">
    {#if $currentRoom && $isInCurrentRoom}
      {#if $isTyping[$currentRoom.id] && $isTyping[$currentRoom.id].length > 0}
        <div class="typing-indicator">
          <span>{$isTyping[$currentRoom.id].join(', ')} {#if $isTyping[$currentRoom.id].length === 1}is{:else}are{/if} typing...</span>
        </div>
      {/if}
      <div class="input-group">
        <input 
          type="text" 
          bind:value={messageInput}
          placeholder="Type your message..." 
          on:input={handleTyping}
          on:keypress={handleKeyPress}
        />
        <button class="btn-primary" on:click={sendMessage} disabled={!messageInput.trim()}>
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    {:else if $currentRoom}
      <div class="input-group">
        <input 
          type="text" 
          placeholder="Join the room to send messages..." 
          disabled
        />
        <button class="btn-primary" disabled>
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    {:else}
      <div class="input-group">
        <input 
          type="text" 
          placeholder="Select a room to start chatting..." 
        />
        <button class="btn-primary" on:click={sendMessage}>
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    {/if}
  </div>
</main>

<style>
  .chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f8f9fa;
  }

  .chat-header-room {
    background: white;
    padding: 15px 20px;
    border-bottom: 1px solid #e1e5e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chat-header-room h3 {
    color: #333;
    font-size: 1.2rem;
  }

  .room-actions {
    display: flex;
    gap: 10px;
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .welcome-message {
    text-align: center;
    color: #666;
    margin: auto;
  }

  .welcome-message i {
    font-size: 3rem;
    color: #667eea;
    margin-bottom: 20px;
  }

  .welcome-message h3 {
    margin-bottom: 10px;
    color: #333;
  }

  .message-input-container {
    background: white;
    padding: 20px;
    border-top: 1px solid #e1e5e9;
  }

  .typing-indicator {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 10px;
    font-style: italic;
  }

  .input-group {
    display: flex;
    gap: 10px;
  }

  .input-group input {
    flex: 1;
    padding: 15px 45px 15px 15px;
    border: 2px solid #e1e5e9;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f8f9fa;
  }

  .input-group input:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .input-group input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .input-group button {
    padding: 15px 20px;
    width: auto;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 10px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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
    .chat-header-room {
      padding: 10px 15px;
    }
    
    .messages-container {
      padding: 15px;
    }
    
    .message-input-container {
      padding: 15px;
    }
  }
</style> 