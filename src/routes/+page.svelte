<script>
	import { PasskeyAuth } from '$lib';
</script>

<svelte:head>
	<title>Svelte Passkey Component Demo</title>
</svelte:head>

<main>
	<h1>Svelte Passkey Component Demo</h1>
	<PasskeyAuth
		registerRequestUrl="/api/auth/register-request"
		registerResponseUrl="/api/auth/register-response"
		loginRequestUrl="/api/auth/login-request"
		loginResponseUrl="/api/auth/login-response"
		logoutUrl="/api/auth/logout"
		sessionUrl="/api/auth/session"
	/>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}
	
	h1 {
		text-align: center;
		margin-bottom: 2rem;
	}
</style> 