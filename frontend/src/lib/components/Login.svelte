<script lang="ts">
  import { chatActions, isLoading } from '../stores';
  
  let username = '';
  let email = '';
  let error = '';

  async function handleSubmit() {
    if (!username.trim() || !email.trim()) {
      error = 'Please fill in all fields';
      return;
    }

    error = '';
    const success = await chatActions.login(username, email);
    
    if (!success) {
      error = 'Failed to create user. Please try again.';
    }
  }
</script>

<div class="login-section">
  <div class="login-card">
    <h1>💬 Chat App</h1>
    <p>Join the conversation</p>
    
    <form on:submit|preventDefault={handleSubmit}>
      <div class="input-group">
        <input 
          type="text" 
          bind:value={username} 
          placeholder="Username" 
          required
          disabled={$isLoading}
        />
        <i class="fas fa-user"></i>
      </div>
      
      <div class="input-group">
        <input 
          type="email" 
          bind:value={email} 
          placeholder="Email" 
          required
          disabled={$isLoading}
        />
        <i class="fas fa-envelope"></i>
      </div>
      
      {#if error}
        <div class="error-message">{error}</div>
      {/if}
      
      <button type="submit" class="btn-primary" disabled={$isLoading}>
        {#if $isLoading}
          <i class="fas fa-spinner fa-spin"></i> Connecting...
        {:else}
          <i class="fas fa-sign-in-alt"></i> Join Chat
        {/if}
      </button>
    </form>
  </div>
</div>

<style>
  .login-section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .login-card {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 400px;
    width: 100%;
  }

  .login-card h1 {
    color: #667eea;
    margin-bottom: 10px;
    font-size: 2.5rem;
  }

  .login-card p {
    color: #666;
    margin-bottom: 30px;
    font-size: 1.1rem;
  }

  .input-group {
    position: relative;
    margin-bottom: 20px;
  }

  .input-group input {
    width: 100%;
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

  .input-group i {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #667eea;
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
    width: 100%;
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

  .error-message {
    color: #dc3545;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 15px;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .login-card {
      margin: 20px;
      padding: 30px 20px;
    }
  }
</style> 