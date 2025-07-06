<script lang="ts">
  import { currentUser } from '../stores';
  import type { Message } from '../types';

  export let message: Message;

  $: isOwnMessage = $currentUser && message.senderId === $currentUser.id;
  $: isSystemMessage = message.type === 'system';
  $: formattedTime = new Date(message.timestamp).toLocaleTimeString();
</script>

{#if isSystemMessage}
  <div class="message system">
    <div class="message-content">
      <div class="message-text">{message.content}</div>
    </div>
  </div>
{:else}
  <div class="message {isOwnMessage ? 'own' : ''}">
    <div class="message-content">
      <div class="message-header">
        <span class="message-sender">{message.senderName}</span>
        <span class="message-time">{formattedTime}</span>
      </div>
      <div class="message-text">{message.content}</div>
    </div>
  </div>
{/if}

<style>
  .message {
    display: flex;
    gap: 10px;
    max-width: 70%;
  }

  .message.own {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  .message.system {
    align-self: center;
    max-width: 50%;
  }

  .message-content {
    background: white;
    padding: 12px 16px;
    border-radius: 18px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .message.own .message-content {
    background: #667eea;
    color: white;
  }

  .message.system .message-content {
    background: #f8f9fa;
    color: #666;
    font-style: italic;
    text-align: center;
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }

  .message-sender {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .message-time {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .message-text {
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .message {
      max-width: 90%;
    }
  }
</style> 