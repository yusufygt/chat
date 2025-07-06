<script lang="ts">
  import { currentUser } from '$lib/stores';
  import Login from '$lib/components/Login.svelte';
  import Chat from '$lib/components/Chat.svelte';
</script>

<svelte:head>
  <title>Chat App</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</svelte:head>

{#if $currentUser}
  <Chat />
{:else}
  <Login />
{/if}

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f8f9fa;
  }

  :global(button) {
    font-family: inherit;
  }

  :global(input, textarea) {
    font-family: inherit;
  }
</style>
