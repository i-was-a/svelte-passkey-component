import { 
  generateRegistrationOptions as swoGenerateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions as swoGenerateAuthenticationOptions,
  verifyAuthenticationResponse
} from '@simplewebauthn/server';
import type { 
  GenerateRegistrationOptionsOpts,
  VerifyRegistrationResponseOpts,
  GenerateAuthenticationOptionsOpts,
  VerifyAuthenticationResponseOpts
} from '@simplewebauthn/server';
import type { StorageAdapter, SessionAdapter, User } from './adapters/types';
import { randomUUID } from 'crypto';

// --- Registration --- //

interface GenerateRegistrationOptionsArgs {
  rpID: string;
  rpName: string;
  storageAdapter: StorageAdapter;
}

export async function generateRegistrationOptions(args: GenerateRegistrationOptionsArgs) {
  const { rpID, rpName, storageAdapter } = args;

  // Create a new user in the database
  const user = await storageAdapter.createUser();

  const options = await swoGenerateRegistrationOptions({
    rpID,
    rpName,
    userID: new TextEncoder().encode(user.id),
    userName: `user-${user.id}`,
    attestationType: 'none',
    excludeCredentials: [], // No credentials to exclude for a new user
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred',
    },
  });

  // Temporarily store the challenge for the user
  // In a real app, you'd likely use a short-lived session or cache for this
  // For simplicity, we'll assume a session mechanism handles this association.

  return { options, user };
}

interface VerifyRegistrationArgs {
  response: any; // Should be RegistrationResponseJSON
  expectedChallenge: string; // This should be retrieved from session
  expectedOrigin: string;
  rpID: string;
  storageAdapter: StorageAdapter;
  user: User;
}

export async function verifyRegistration(args: VerifyRegistrationArgs) {
  const { response, expectedChallenge, expectedOrigin, rpID, storageAdapter, user } = args;

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin,
    expectedRPID: rpID,
    requireUserVerification: true,
  });

  if (verification.verified && verification.registrationInfo) {
    const { credential } = verification.registrationInfo;
    
    const newAuthenticator = {
      credentialID: Buffer.from(credential.id).toString('base64url'),
      credentialPublicKey: Buffer.from(credential.publicKey),
      counter: 0,
      credentialDeviceType: 'singleDevice',
      credentialBackedUp: false,
      transports: response.response.transports || [],
      userId: user.id,
    };

    await storageAdapter.saveAuthenticator(newAuthenticator);
    return { verified: true, user };
  }

  return { verified: false };
}

// --- Authentication --- //

interface GenerateAuthenticationOptionsArgs {
  rpID: string;
}

export async function generateAuthenticationOptions(args: GenerateAuthenticationOptionsArgs) {
  const { rpID } = args;
  const options = await swoGenerateAuthenticationOptions({
    rpID,
    userVerification: 'preferred',
    allowCredentials: [], // Allow any discoverable credential
  });
  return options;
}

interface VerifyAuthenticationArgs {
  response: any; // Should be AuthenticationResponseJSON
  expectedChallenge: string; // Retrieved from session
  expectedOrigin: string;
  rpID: string;
  storageAdapter: StorageAdapter;
}

export async function verifyAuthentication(args: VerifyAuthenticationArgs) {
  const { response, expectedChallenge, expectedOrigin, rpID, storageAdapter } = args;

  const authenticator = await storageAdapter.getAuthenticator(
    Buffer.from(response.rawId, 'base64url').toString('base64url')
  );

  if (!authenticator) {
    throw new Error(`Authenticator with ID ${response.id} not found.`);
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin,
    expectedRPID: rpID,
    credential: {
      id: authenticator.credentialID,
      publicKey: Buffer.from(authenticator.credentialPublicKey),
      counter: authenticator.counter,
      transports: authenticator.transports as any,
    },
    requireUserVerification: true,
  });

  if (verification.verified) {
    const { newCounter } = verification.authenticationInfo;
    await storageAdapter.updateAuthenticatorCounter(authenticator.credentialID, newCounter);
    const user = await storageAdapter.getUser(authenticator.userId);
    return { verified: true, user };
  }

  return { verified: false };
}

// --- Session Management --- //

interface HandleLogoutArgs {
  sessionId: string;
  sessionAdapter: SessionAdapter;
}

export async function handleLogout(args: HandleLogoutArgs) {
  await args.sessionAdapter.deleteSession(args.sessionId);
}

interface GetSessionArgs {
  sessionId: string;
  sessionAdapter: SessionAdapter;
  storageAdapter: StorageAdapter;
}

export async function getSession(args: GetSessionArgs) {
  const userHandle = await args.sessionAdapter.getSession(args.sessionId);
  if (userHandle) {
    const user = await args.storageAdapter.getUser(userHandle);
    return { isLoggedIn: true, user };
  }
  return { isLoggedIn: false, user: null };
}