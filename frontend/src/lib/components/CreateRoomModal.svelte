<script lang="ts">
  import { showCreateRoomModal, chatActions } from '../stores';

  let roomName = '';
  let roomDescription = '';
  let isPrivate = false;
  let error = '';

  function closeModal() {
    showCreateRoomModal.set(false);
    resetForm();
  }

  function resetForm() {
    roomName = '';
    roomDescription = '';
    isPrivate = false;
    error = '';
  }

  async function handleSubmit() {
    if (!roomName.trim()) {
      error = 'Room name is required';
      return;
    }

    error = '';
    const success = await chatActions.createRoom(roomName.trim(), roomDescription.trim(), isPrivate);
    
    if (!success) {
      error = 'Failed to create room. Please try again.';
    }
  }

  function handleOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }
</script>

{#if $showCreateRoomModal}
  <div class="modal" on:click={handleOutsideClick}>
    <div class="modal-content">
      <div class="modal-header">
        <h3><i class="fas fa-plus-circle"></i> Create New Room</h3>
        <button class="close-btn" on:click={closeModal}>
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form on:submit|preventDefault={handleSubmit}>
        <div class="input-group">
          <input 
            type="text" 
            bind:value={roomName}
            placeholder="Room name" 
            required
          />
          <i class="fas fa-hashtag"></i>
        </div>
        
        <div class="input-group">
          <textarea 
            bind:value={roomDescription}
            placeholder="Room description (optional)"
            rows="3"
          ></textarea>
          <i class="fas fa-align-left"></i>
        </div>
        
        <div class="checkbox-group">
          <input 
            type="checkbox" 
            id="isPrivate"
            bind:checked={isPrivate}
          />
          <label for="isPrivate">Private room</label>
        </div>
        
        {#if error}
          <div class="error-message">{error}</div>
        {/if}
        
        <div class="modal-actions">
          <button type="button" class="btn-secondary" on:click={closeModal}>
            Cancel
          </button>
          <button type="submit" class="btn-primary">
            Create Room
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 15px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .modal-header h3 {
    color: #333;
    font-size: 1.3rem;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #666;
    cursor: pointer;
    padding: 5px;
  }

  .input-group {
    position: relative;
    margin-bottom: 20px;
  }

  .input-group input,
  .input-group textarea {
    width: 100%;
    padding: 15px 45px 15px 15px;
    border: 2px solid #e1e5e9;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f8f9fa;
    font-family: inherit;
  }

  .input-group input:focus,
  .input-group textarea:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .input-group i {
    position: absolute;
    right: 15px;
    top: 15px;
    color: #667eea;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .checkbox-group input[type="checkbox"] {
    width: auto;
    margin-right: 8px;
  }

  .error-message {
    color: #dc3545;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 15px;
    font-size: 0.9rem;
  }

  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
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

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  .btn-secondary {
    background: #f8f9fa;
    color: #667eea;
    border: 2px solid #667eea;
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

  .btn-secondary:hover {
    background: #667eea;
    color: white;
  }
</style> 