import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { authStore } from './stores';

// --- Helper Functions ---

async function fetcher(url: string, body?: object) {
  const options: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data.error || 'An unknown error occurred';
    authStore.setError(errorMsg);
    throw new Error(errorMsg);
  }

  return data;
}

// --- API Functions ---

export async function register(requestUrl: string, responseUrl: string) {
  try {
    const regOptions = await fetcher(requestUrl);
    const regResponse = await startRegistration(regOptions);
    const verification = await fetcher(responseUrl, regResponse);

    if (verification.verified && verification.user) {
      authStore.setLoggedIn(verification.user.id);
    } else {
      authStore.setError('Registration verification failed.');
    }
  } catch (error: any) {
    authStore.setError(error.message || 'Registration failed.');
  }
}

export async function login(requestUrl: string, responseUrl: string) {
  try {
    const authOptions = await fetcher(requestUrl);
    const authResponse = await startAuthentication(authOptions);
    const verification = await fetcher(responseUrl, authResponse);

    if (verification.verified && verification.user) {
      authStore.setLoggedIn(verification.user.id);
    } else {
      authStore.setError('Login verification failed.');
    }
  } catch (error: any) {
    authStore.setError(error.message || 'Login failed.');
  }
}

export async function logout(url: string) {
  try {
    await fetcher(url);
    authStore.setLoggedOut();
  } catch (error: any) {
    authStore.setError(error.message || 'Logout failed.');
  }
}

export async function checkSession(url: string) {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const session = await res.json();
      if (session.isLoggedIn && session.user) {
        authStore.setLoggedIn(session.user.id);
      } else {
        authStore.setLoggedOut();
      }
    } else {
      authStore.setLoggedOut();
    }
  } catch (error) {
    authStore.setLoggedOut();
  }
}
