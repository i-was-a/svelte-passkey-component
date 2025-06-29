<script lang="ts">
  import { authStore } from '../stores';
  import { logout } from '../passkey-api';
  import { getTranslations, type Translations } from '../i18n/translations';

  export let logoutUrl: string;
  export let locale: string = 'en';
  export let title: string | undefined = undefined;

  let t: Translations;

  $: t = getTranslations(locale);
  $: displayTitle = title || t.dashboard.title;

  const handleLogout = () => {
    logout(logoutUrl);
  };
</script>

<div class="dashboard">
  <h2>{displayTitle}</h2>
  <p>{t.dashboard.loggedIn}</p>
  <p><small>{t.dashboard.userHandle} {$authStore.userHandle}</small></p>
  <button on:click={handleLogout}>{t.dashboard.logout}</button>
</div>

<style>
  .dashboard {
    text-align: center;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  small {
    color: #666;
  }
</style>
