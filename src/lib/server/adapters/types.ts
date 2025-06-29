import type { 
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse 
} from '@simplewebauthn/server';

// Types based on Prisma schema from the original svelte-passkey project
export interface Authenticator {
  credentialID: string; // This is a base64url encoded string
  credentialPublicKey: Buffer;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports: string[];
  userId: string;
}

export interface User {
  id: string;
  authenticators: Authenticator[];
}

/**
 * The adapter that the library user needs to implement to interact with their database.
 */
export interface StorageAdapter {
  // User methods
  getUser(userHandle: string): Promise<User | null>;
  createUser(): Promise<User>;

  // Authenticator methods
  getAuthenticator(credentialID: string): Promise<Authenticator | null>;
  saveAuthenticator(authenticator: Authenticator): Promise<void>;
  updateAuthenticatorCounter(credentialID: string, newCounter: number): Promise<void>;
  linkAuthenticatorToUser(userHandle: string, authenticator: Authenticator): Promise<void>;
}

/**
 * The adapter for handling session storage (e.g., Redis).
 */
export interface SessionAdapter {
  getSession(sessionId: string): Promise<string | null>; // Returns user handle
  setSession(sessionId: string, userHandle: string): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
}
