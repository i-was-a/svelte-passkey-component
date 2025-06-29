<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from './stores';
  import { checkSession } from './passkey-api';
  import AuthView from './components/AuthView.svelte';
  import DashboardView from './components/DashboardView.svelte';

  // --- Required API URL props ---
  export let registerRequestUrl: string;
  export let registerResponseUrl: string;
  export let loginRequestUrl: string;
  export let loginResponseUrl: string;
  export let logoutUrl: string;
  export let sessionUrl: string;
  
  // --- Optional props ---
  export let locale: string = 'en';
  export let title: string | undefined = undefined; // 認証画面のタイトル
  export let dashboardTitle: string | undefined = undefined; // ダッシュボードのタイトル

  onMount(() => {
    // Check if a session already exists when the component is loaded
    checkSession(sessionUrl);
  });
</script>

<div class="passkey-auth-widget">
  {#if $authStore.isLoggedIn}
    <DashboardView {logoutUrl} {locale} title={dashboardTitle} />
  {:else}
    <AuthView
      {registerRequestUrl}
      {registerResponseUrl}
      {loginRequestUrl}
      {loginResponseUrl}
      {locale}
      {title}
    />
  {/if}
</div>

<style>
  .passkey-auth-widget {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
