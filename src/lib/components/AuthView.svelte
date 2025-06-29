<script lang="ts">
  import { authStore } from '../stores';
  import { register, login } from '../passkey-api';
  import { getTranslations, type Translations } from '../i18n/translations';

  export let registerRequestUrl: string;
  export let registerResponseUrl: string;
  export let loginRequestUrl: string;
  export let loginResponseUrl: string;
  export let locale: string = 'en';
  export let title: string | undefined = undefined;

  let isLoading = false;
  let t: Translations;

  $: t = getTranslations(locale);
  $: displayTitle = title || t.auth.title;

  const handleRegister = async () => {
    isLoading = true;
    authStore.setError(null);
    await register(registerRequestUrl, registerResponseUrl);
    isLoading = false;
  };

  const handleLogin = async () => {
    isLoading = true;
    authStore.setError(null);
    await login(loginRequestUrl, loginResponseUrl);
    isLoading = false;
  };
</script>

<div class="auth-view">
  <h1>{displayTitle}</h1>
  <div class="actions">
    <button on:click={handleLogin} disabled={isLoading}>
      {isLoading ? t.auth.processing : t.auth.signIn}
    </button>
    <button on:click={handleRegister} disabled={isLoading} class="secondary">
      {isLoading ? t.auth.processing : t.auth.createAccount}
    </button>
  </div>

  {#if $authStore.error}
    <p class="error">{t.auth.error} {$authStore.error}</p>
  {/if}
</div>

<style>
  .auth-view {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
  }
  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  button {
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    background-color: #007bff;
    color: white;
  }
  button.secondary {
    background-color: #6c757d;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .error {
    margin-top: 1rem;
    color: #dc3545;
  }
</style>
