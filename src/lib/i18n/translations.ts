export interface Translations {
  auth: {
    title?: string;
    signIn: string;
    createAccount: string;
    processing: string;
    error: string;
  };
  dashboard: {
    title?: string;
    welcome: string;
    loggedIn: string;
    userHandle: string;
    logout: string;
  };
}

export const translations: Record<string, Translations> = {
  en: {
    auth: {
      title: 'Passkey Authentication',
      signIn: 'Sign In with Passkey',
      createAccount: 'Create New Account with Passkey',
      processing: 'Processing...',
      error: 'Error:'
    },
    dashboard: {
      title: 'Welcome!',
      welcome: 'Welcome!',
      loggedIn: 'You are logged in.',
      userHandle: 'Your User Handle:',
      logout: 'Logout'
    }
  },
  ja: {
    auth: {
      title: 'パスキー認証',
      signIn: 'パスキーでサインイン',
      createAccount: 'パスキーで新規アカウント作成',
      processing: '処理中...',
      error: 'エラー:'
    },
    dashboard: {
      title: 'ようこそ！',
      welcome: 'ようこそ！',
      loggedIn: 'ログインしています。',
      userHandle: 'ユーザーハンドル:',
      logout: 'ログアウト'
    }
  }
};

export function getTranslations(locale: string = 'en'): Translations {
  return translations[locale] || translations.en;
} 