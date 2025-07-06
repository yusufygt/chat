<script lang="ts">
  import { rooms, currentRoom, currentUser, showCreateRoomModal, chatActions } from '../stores';

  function showCreateRoom() {
    showCreateRoomModal.set(true);
  }

  function selectRoom(room: any) {
    chatActions.selectRoom(room);
  }
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <h3><i class="fas fa-users"></i> Rooms</h3>
    <button class="btn-icon" on:click={showCreateRoom}>
      <i class="fas fa-plus"></i>
    </button>
  </div>
  
  <div class="room-list">
    {#each $rooms as room}
      <div 
        class="room-item {room.id === $currentRoom?.id ? 'active' : ''}"
        on:click={() => selectRoom(room)}
      >
        <div class="room-name">{room.name}</div>
        <div class="room-description">{room.description || 'No description'}</div>
        {#if room.isPrivate}
          <div class="room-private"><i class="fas fa-lock"></i> Private</div>
        {/if}
      </div>
    {/each}
  </div>

  <div class="sidebar-footer">
    <div class="user-status">
      <i class="fas fa-circle online-indicator"></i>
      <span>{$currentUser?.username || 'You'}</span>
    </div>
  </div>
</aside>

<style>
  .sidebar {
    width: 280px;
    background: white;
    border-right: 1px solid #e1e5e9;
    display: flex;
    flex-direction: column;
  }

  .sidebar-header {
    padding: 20px;
    border-bottom: 1px solid #e1e5e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sidebar-header h3 {
    color: #333;
    font-size: 1.1rem;
  }

  .room-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }

  .room-item {
    padding: 12px 15px;
    margin-bottom: 5px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }

  .room-item:hover {
    background: #f8f9fa;
  }

  .room-item.active {
    background: #667eea;
    color: white;
  }

  .room-item .room-name {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .room-item .room-description {
    font-size: 0.8rem;
    opacity: 0.8;
  }

  .room-private {
    font-size: 0.7rem;
    opacity: 0.7;
    margin-top: 4px;
  }

  .sidebar-footer {
    padding: 15px 20px;
    border-top: 1px solid #e1e5e9;
  }

  .user-status {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #28a745;
    font-size: 0.9rem;
  }

  .online-indicator {
    color: #28a745;
    font-size: 0.8rem;
  }

  .btn-icon {
    background: none;
    border: none;
    color: #667eea;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .btn-icon:hover {
    background: #f0f2ff;
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      height: 200px;
    }
  }
</style> 