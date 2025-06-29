// Client-side exports
export { default as PasskeyAuth } from './PasskeyAuth.svelte';
export { default as AuthView } from './components/AuthView.svelte';
export { default as DashboardView } from './components/DashboardView.svelte';

// Server-side exports
export * from './server';
export * from './server/adapters/types';

// Client-side utilities
export * from './stores';
export * from './passkey-api';

// Internationalization
export * from './i18n/translations';
