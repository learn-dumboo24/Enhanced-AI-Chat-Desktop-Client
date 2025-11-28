/**
 * ============================================================================
 * OAUTH 2.0 IMPLEMENTATION GUIDE FOR DESKTOP APPLICATIONS
 * ============================================================================
 * 
 * This file contains a comprehensive guide and implementation for OAuth 2.0
 * authentication in desktop applications, specifically for Google OAuth.
 * 
 * TABLE OF CONTENTS:
 * 1. OAuth 2.0 Concepts & Flow Explanation
 * 2. Desktop App OAuth Flow (Authorization Code + PKCE)
 * 3. Database Schema Design
 * 4. Implementation Code with Detailed Comments
 * 5. Use Cases & Best Practices
 * ============================================================================
 */

/* ============================================================================
 * SECTION 1: OAUTH 2.0 CONCEPTS EXPLAINED
 * ============================================================================
 * 
 * WHAT IS OAUTH 2.0?
 * ------------------
 * OAuth 2.0 is an authorization framework that allows applications to obtain
 * limited access to user accounts on an HTTP service. It works by delegating
 * user authentication to the service that hosts the user account (Google in
 * our case) and authorizing third-party applications to access the account.
 * 
 * KEY TERMINOLOGY:
 * ----------------
 * 1. CLIENT: Your desktop application
 * 2. RESOURCE OWNER: The user who owns the Google account
 * 3. AUTHORIZATION SERVER: Google's OAuth server (accounts.google.com)
 * 4. RESOURCE SERVER: Google's API server (apis.google.com)
 * 5. AUTHORIZATION CODE: A temporary code exchanged for access token
 * 6. ACCESS TOKEN: Used to access user's protected resources
 * 7. REFRESH TOKEN: Used to obtain new access tokens without re-authentication
 * 8. REDIRECT URI: Where Google sends the user after authentication
 * 9. CLIENT ID: Public identifier for your application
 * 10. CLIENT SECRET: Secret key (should be kept secure)
 * 11. SCOPE: Permissions your app requests (e.g., email, profile)
 * 
 * OAUTH FLOW FOR DESKTOP APPS:
 * -----------------------------
 * Desktop applications face a unique challenge: they can't securely store
 * client secrets. That's why we use PKCE (Proof Key for Code Exchange).
 * 
 * STANDARD FLOW:
 * 1. User clicks "Login with Google" in your app
 * 2. App generates a code verifier and code challenge (PKCE)
 * 3. App opens browser with Google's authorization URL
 * 4. User authenticates with Google
 * 5. Google redirects to your redirect URI with authorization code
 * 6. App exchanges authorization code + code verifier for access token
 * 7. App uses access token to fetch user profile (email, photo)
 * 8. App stores user data in database
 * 9. App stores refresh token for future sessions
 * 
 * ============================================================================
 */

/* ============================================================================
 * SECTION 2: DATABASE SCHEMA DESIGN
 * ============================================================================
 * 
 * WHY DO WE NEED A DATABASE?
 * ---------------------------
 * We need to store user information locally so that:
 * 1. Users don't have to login every time they open the app
 * 2. We can display user profile (name, photo) in the app
 * 3. We can associate app-specific data with user accounts
 * 4. We can track user sessions and preferences
 * 
 * RECOMMENDED DATABASE SCHEMA:
 * -----------------------------
 * 
 * Option 1: SQLite (Recommended for Desktop Apps)
 * ------------------------------------------------
 * CREATE TABLE users (
 *   id INTEGER PRIMARY KEY AUTOINCREMENT,
 *   google_id TEXT UNIQUE NOT NULL,        -- Google's unique user ID
 *   email TEXT UNIQUE NOT NULL,            -- User's email address
 *   name TEXT,                             -- User's display name
 *   profile_photo_url TEXT,                -- URL to user's profile photo
 *   access_token TEXT,                     -- Current access token (encrypted)
 *   refresh_token TEXT,                    -- Refresh token (encrypted)
 *   token_expires_at INTEGER,              -- Unix timestamp when token expires
 *   created_at INTEGER DEFAULT (strftime('%s', 'now')),  -- Account creation time
 *   updated_at INTEGER DEFAULT (strftime('%s', 'now'))   -- Last update time
 * );
 * 
 * Option 2: PostgreSQL/MySQL (If you need cloud sync)
 * ----------------------------------------------------
 * Same schema, but use appropriate data types:
 * - id: SERIAL PRIMARY KEY or AUTO_INCREMENT
 * - created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * - updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 * 
 * Option 3: JSON File (Simple, for prototyping)
 * ----------------------------------------------
 * Store users array in a JSON file:
 * {
 *   "users": [
 *     {
 *       "google_id": "123456789",
 *       "email": "user@example.com",
 *       "name": "John Doe",
 *       "profile_photo_url": "https://...",
 *       "access_token": "encrypted_token",
 *       "refresh_token": "encrypted_token",
 *       "token_expires_at": 1234567890
 *     }
 *   ]
 * }
 * 
 * SECURITY CONSIDERATIONS:
 * ------------------------
 * 1. NEVER store tokens in plain text - always encrypt them
 * 2. Use environment variables for sensitive data
 * 3. Implement token refresh before expiration
 * 4. Validate tokens before making API calls
 * 5. Handle token revocation gracefully
 * 
 * ============================================================================
 */

/* ============================================================================
 * SECTION 3: IMPLEMENTATION CODE WITH DETAILED COMMENTS
 * ============================================================================
 */

import crypto from 'crypto';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import open from 'open'; // For opening browser (install: npm install open)

/**
 * ============================================================================
 * CONFIGURATION
 * ============================================================================
 * 
 * These are your OAuth credentials from Google Cloud Console.
 * IMPORTANT: In production, store these in environment variables!
 */
const OAUTH_CONFIG = {
  // Your Google Client ID (public identifier)
  clientId: 'YOUR_GOOGLE_CLIENT_ID_HERE',
  
  // Your Google Client Secret (keep this secure!)
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET_HERE',
  
  // Scopes define what permissions you're requesting
  // 'openid' - Required for OpenID Connect
  // 'email' - Access to user's email address
  // 'profile' - Access to user's basic profile info (name, photo)
  scopes: ['openid', 'email', 'profile'],
  
  // Authorization endpoint - where users authenticate
  authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  
  // Token endpoint - where we exchange code for tokens
  tokenUrl: 'https://oauth2.googleapis.com/token',
  
  // User info endpoint - where we get user profile data
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  
  // Redirect URI - where Google sends user after authentication
  // For desktop apps, we use localhost with a random port
  redirectUri: 'http://localhost:3001/oauth/callback',
  
  // Port for local OAuth callback server
  callbackPort: 3001,
};

/**
 * ============================================================================
 * PKCE (PROOF KEY FOR CODE EXCHANGE) IMPLEMENTATION
 * ============================================================================
 * 
 * WHAT IS PKCE?
 * -------------
 * PKCE is a security extension for OAuth 2.0 designed to make the
 * authorization code flow more secure for public clients (like desktop apps).
 * 
 * HOW IT WORKS:
 * 1. Generate a random "code verifier" (43-128 characters)
 * 2. Create a "code challenge" by hashing the verifier
 * 3. Send code challenge to authorization server
 * 4. When exchanging code for token, send the original code verifier
 * 5. Server verifies that hash(verifier) == challenge
 * 
 * WHY USE PKCE?
 * - Prevents authorization code interception attacks
 * - Required for public clients (desktop/mobile apps)
 * - Google recommends PKCE for all OAuth flows
 */

/**
 * Generates a random code verifier for PKCE
 * 
 * @returns {string} A URL-safe random string (43-128 characters)
 * 
 * USE CASE: Called at the start of OAuth flow to create a secure
 * random string that will be used to verify the authorization code.
 */
function generateCodeVerifier(): string {
  // Generate 32 random bytes (256 bits)
  // Convert to base64url encoding (URL-safe base64)
  // This creates a 43-character string (minimum required length)
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Creates a code challenge from a code verifier using SHA256
 * 
 * @param {string} verifier - The code verifier
 * @returns {string} The base64url-encoded SHA256 hash
 * 
 * USE CASE: Creates a challenge that proves we have the verifier
 * without revealing it. This is sent to Google during authorization.
 */
function generateCodeChallenge(verifier: string): string {
  // Hash the verifier using SHA256
  const hash = crypto.createHash('sha256').update(verifier).digest();
  
  // Convert to base64url encoding (URL-safe)
  return hash.toString('base64url');
}

/**
 * ============================================================================
 * AUTHORIZATION URL GENERATION
 * ============================================================================
 * 
 * This function creates the URL that users will visit to authenticate
 * with Google. It includes all necessary parameters for OAuth flow.
 * 
 * @param {string} codeChallenge - The PKCE code challenge
 * @param {string} state - A random state parameter for CSRF protection
 * @returns {string} The complete authorization URL
 * 
 * USE CASE: Called when user clicks "Login with Google" button.
 * Opens this URL in the user's default browser.
 */
function buildAuthorizationUrl(codeChallenge: string, state: string): string {
  const params = new URLSearchParams({
    // OAuth 2.0 standard parameters
    client_id: OAUTH_CONFIG.clientId,
    redirect_uri: OAUTH_CONFIG.redirectUri,
    response_type: 'code', // We want an authorization code
    scope: OAUTH_CONFIG.scopes.join(' '), // Space-separated scopes
    state: state, // CSRF protection token
    
    // PKCE parameters
    code_challenge: codeChallenge,
    code_challenge_method: 'S256', // SHA256 hashing method
    
    // Optional: Forces account selection (useful for testing)
    // prompt: 'select_account',
    
    // Optional: Controls access type (offline = get refresh token)
    access_type: 'offline',
  });
  
  return `${OAUTH_CONFIG.authorizationUrl}?${params.toString()}`;
}

/**
 * ============================================================================
 * TOKEN EXCHANGE
 * ============================================================================
 * 
 * After user authenticates, Google redirects to our callback URL with
 * an authorization code. This function exchanges that code for access
 * and refresh tokens.
 * 
 * @param {string} authorizationCode - The code from Google's redirect
 * @param {string} codeVerifier - The original PKCE code verifier
 * @returns {Promise<Object>} Token response with access_token, refresh_token, etc.
 * 
 * USE CASE: Called in the OAuth callback handler after receiving
 * the authorization code from Google.
 */
async function exchangeCodeForTokens(
  authorizationCode: string,
  codeVerifier: string
): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}> {
  // Prepare the token exchange request
  const tokenRequestBody = {
    client_id: OAUTH_CONFIG.clientId,
    client_secret: OAUTH_CONFIG.clientSecret,
    code: authorizationCode,
    redirect_uri: OAUTH_CONFIG.redirectUri,
    grant_type: 'authorization_code',
    code_verifier: codeVerifier, // PKCE: prove we have the verifier
  };
  
  // Make POST request to Google's token endpoint
  const response = await fetch(OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(tokenRequestBody),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }
  
  const tokens = await response.json();
  
  // Response contains:
  // - access_token: Use this to access Google APIs
  // - refresh_token: Use this to get new access tokens (if offline access)
  // - expires_in: Seconds until access_token expires (usually 3600 = 1 hour)
  // - token_type: Usually "Bearer"
  // - scope: The scopes granted
  
  return tokens;
}

/**
 * ============================================================================
 * USER PROFILE FETCHING
 * ============================================================================
 * 
 * Once we have an access token, we can fetch the user's profile information
 * (email, name, profile photo) from Google's UserInfo API.
 * 
 * @param {string} accessToken - The access token from token exchange
 * @returns {Promise<Object>} User profile data
 * 
 * USE CASE: Called after successful token exchange to get user details
 * that we'll store in our database.
 */
async function fetchUserProfile(accessToken: string): Promise<{
  id: string;           // Google's unique user ID
  email: string;        // User's email address
  verified_email: boolean; // Whether email is verified
  name: string;         // User's display name
  given_name: string;   // First name
  family_name: string;  // Last name
  picture: string;      // URL to profile photo
  locale: string;       // User's locale (e.g., "en")
}> {
  // Make GET request to Google's UserInfo endpoint
  const response = await fetch(OAUTH_CONFIG.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch user profile: ${error}`);
  }
  
  const userProfile = await response.json();
  
  // Return the profile data
  // This is what we'll store in our database:
  // - userProfile.id → google_id
  // - userProfile.email → email
  // - userProfile.name → name
  // - userProfile.picture → profile_photo_url
  
  return userProfile;
}

/**
 * ============================================================================
 * TOKEN REFRESH
 * ============================================================================
 * 
 * Access tokens expire after 1 hour. Instead of making users login again,
 * we use the refresh token to get a new access token.
 * 
 * @param {string} refreshToken - The refresh token from initial auth
 * @returns {Promise<Object>} New token response
 * 
 * USE CASE: Called automatically before making API calls if the
 * access token is expired or about to expire.
 */
async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}> {
  const refreshRequestBody = {
    client_id: OAUTH_CONFIG.clientId,
    client_secret: OAUTH_CONFIG.clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  };
  
  const response = await fetch(OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(refreshRequestBody),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }
  
  const tokens = await response.json();
  
  // Note: Refresh token is usually not returned again
  // Keep using the original refresh token
  
  return tokens;
}

/**
 * ============================================================================
 * DATABASE OPERATIONS (PSEUDO-CODE)
 * ============================================================================
 * 
 * These functions represent how you would interact with your database.
 * Replace these with actual database calls using your preferred ORM/library.
 * 
 * RECOMMENDED LIBRARIES:
 * - SQLite: better-sqlite3, sql.js, or node-sqlite3
 * - PostgreSQL: pg, postgres
 * - MySQL: mysql2
 * - ORM: Prisma, TypeORM, Sequelize, Drizzle
 */

/**
 * Saves or updates user information in the database
 * 
 * @param {Object} userData - User profile and token data
 * 
 * USE CASE: Called after successful OAuth flow to persist user data
 */
async function saveUserToDatabase(userData: {
  googleId: string;
  email: string;
  name: string;
  profilePhotoUrl: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
}): Promise<void> {
  // PSEUDO-CODE - Replace with actual database implementation
  /*
  Example with SQLite (better-sqlite3):
  
  const db = require('better-sqlite3')('users.db');
  
  // Create table if not exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      google_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      profile_photo_url TEXT,
      access_token TEXT,
      refresh_token TEXT,
      token_expires_at INTEGER,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `);
  
  // Insert or update user
  const stmt = db.prepare(`
    INSERT INTO users (google_id, email, name, profile_photo_url, access_token, refresh_token, token_expires_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'))
    ON CONFLICT(google_id) DO UPDATE SET
      email = excluded.email,
      name = excluded.name,
      profile_photo_url = excluded.profile_photo_url,
      access_token = excluded.access_token,
      refresh_token = excluded.refresh_token,
      token_expires_at = excluded.token_expires_at,
      updated_at = strftime('%s', 'now')
  `);
  
  stmt.run(
    userData.googleId,
    userData.email,
    userData.name,
    userData.profilePhotoUrl,
    userData.accessToken,  // In production, encrypt this!
    userData.refreshToken, // In production, encrypt this!
    userData.expiresAt
  );
  */
  
  console.log('User saved to database:', {
    googleId: userData.googleId,
    email: userData.email,
    name: userData.name,
  });
}

/**
 * Retrieves user from database by Google ID
 * 
 * @param {string} googleId - Google's unique user ID
 * @returns {Promise<Object|null>} User data or null if not found
 * 
 * USE CASE: Called when app starts to check if user is already logged in
 */
async function getUserFromDatabase(googleId: string): Promise<{
  id: number;
  googleId: string;
  email: string;
  name: string;
  profilePhotoUrl: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: number;
} | null> {
  // PSEUDO-CODE - Replace with actual database implementation
  /*
  Example with SQLite:
  
  const db = require('better-sqlite3')('users.db');
  const user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId);
  return user || null;
  */
  
  return null; // Placeholder
}

/**
 * ============================================================================
 * OAUTH FLOW IMPLEMENTATION
 * ============================================================================
 * 
 * This is the main OAuth flow handler that orchestrates the entire process.
 */

/**
 * Initiates the OAuth login flow
 * 
 * FLOW:
 * 1. Generate PKCE verifier and challenge
 * 2. Generate state for CSRF protection
 * 3. Build authorization URL
 * 4. Open browser for user authentication
 * 5. Return verifier and state (to be used in callback)
 * 
 * @returns {Promise<{verifier: string, state: string}>}
 * 
 * USE CASE: Called when user clicks "Login with Google" button
 */
async function initiateOAuthFlow(): Promise<{
  verifier: string;
  state: string;
}> {
  // Step 1: Generate PKCE code verifier
  const codeVerifier = generateCodeVerifier();
  
  // Step 2: Generate code challenge from verifier
  const codeChallenge = generateCodeChallenge(codeVerifier);
  
  // Step 3: Generate random state for CSRF protection
  // State is a random string that we'll verify in the callback
  // to ensure the response came from our authorization request
  const state = crypto.randomBytes(16).toString('base64url');
  
  // Step 4: Build the authorization URL
  const authUrl = buildAuthorizationUrl(codeChallenge, state);
  
  // Step 5: Open browser for user authentication
  // User will see Google's login page
  console.log('Opening browser for Google authentication...');
  await open(authUrl);
  
  // Return verifier and state - these must be stored temporarily
  // and matched in the callback handler
  return {
    verifier: codeVerifier,
    state: state,
  };
}

/**
 * Handles the OAuth callback after user authenticates
 * 
 * FLOW:
 * 1. Verify state parameter (CSRF protection)
 * 2. Extract authorization code from query params
 * 3. Exchange code for tokens
 * 4. Fetch user profile
 * 5. Save user to database
 * 6. Return user data
 * 
 * @param {string} code - Authorization code from Google
 * @param {string} state - State parameter from callback
 * @param {string} verifier - PKCE code verifier
 * @param {string} expectedState - The state we sent in authorization request
 * @returns {Promise<Object>} User data
 * 
 * USE CASE: Called when Google redirects to our callback URL
 */
async function handleOAuthCallback(
  code: string,
  state: string,
  verifier: string,
  expectedState: string
): Promise<{
  googleId: string;
  email: string;
  name: string;
  profilePhotoUrl: string;
}> {
  // Step 1: Verify state parameter (CSRF protection)
  // This ensures the callback came from our authorization request
  if (state !== expectedState) {
    throw new Error('Invalid state parameter - possible CSRF attack');
  }
  
  // Step 2: Exchange authorization code for tokens
  console.log('Exchanging authorization code for tokens...');
  const tokens = await exchangeCodeForTokens(code, verifier);
  
  // Step 3: Fetch user profile using access token
  console.log('Fetching user profile...');
  const userProfile = await fetchUserProfile(tokens.access_token);
  
  // Step 4: Calculate token expiration time
  const expiresAt = Math.floor(Date.now() / 1000) + tokens.expires_in;
  
  // Step 5: Prepare user data for database
  const userData = {
    googleId: userProfile.id,
    email: userProfile.email,
    name: userProfile.name,
    profilePhotoUrl: userProfile.picture,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || '', // May not be present if user already authorized
    expiresAt: expiresAt,
  };
  
  // Step 6: Save user to database
  console.log('Saving user to database...');
  await saveUserToDatabase(userData);
  
  // Step 7: Return user data (without sensitive tokens)
  return {
    googleId: userProfile.id,
    email: userProfile.email,
    name: userProfile.name,
    profilePhotoUrl: userProfile.picture,
  };
}

/**
 * ============================================================================
 * HONO SERVER SETUP FOR OAUTH CALLBACK
 * ============================================================================
 * 
 * We need a local HTTP server to receive the OAuth callback from Google.
 * This server runs on localhost and handles the redirect after authentication.
 */

// Create a new Hono app for OAuth callback handling
const oauthApp = new Hono();

// Store pending OAuth requests temporarily
// In production, use Redis or a proper session store
const pendingOAuthRequests = new Map<string, {
  verifier: string;
  state: string;
  resolve: (value: any) => void;
  reject: (error: Error) => void;
}>();

/**
 * OAuth callback endpoint
 * 
 * This endpoint receives the redirect from Google after user authentication.
 * Google sends:
 * - code: Authorization code
 * - state: The state we sent (for CSRF protection)
 * - error: If authentication failed
 * 
 * USE CASE: Google redirects here after user authenticates
 */
oauthApp.get('/oauth/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const error = c.req.query('error');
  
  // Handle authentication errors
  if (error) {
    // Try to find and reject pending request if state exists
    const stateForError = c.req.query('state');
    if (stateForError) {
      const pendingRequest = pendingOAuthRequests.get(stateForError);
      if (pendingRequest) {
        pendingRequest.reject(new Error(`Authentication failed: ${error}`));
        pendingOAuthRequests.delete(stateForError);
      }
    }
    
    return c.html(`
      <html>
        <body>
          <h1>Authentication Failed</h1>
          <p>Error: ${error}</p>
          <p>You can close this window.</p>
        </body>
      </html>
    `);
  }
  
  // Validate required parameters
  if (!code || !state) {
    // Try to find and reject pending request if state exists
    if (state) {
      const pendingRequest = pendingOAuthRequests.get(state);
      if (pendingRequest) {
        pendingRequest.reject(new Error('Missing required parameters'));
        pendingOAuthRequests.delete(state);
      }
    }
    
    return c.html(`
      <html>
        <body>
          <h1>Invalid Request</h1>
          <p>Missing required parameters.</p>
          <p>You can close this window.</p>
        </body>
      </html>
    `);
  }
  
  // Find the pending OAuth request
  const pendingRequest = pendingOAuthRequests.get(state);
  
  if (!pendingRequest) {
    return c.html(`
      <html>
        <body>
          <h1>Invalid State</h1>
          <p>The authentication request has expired or is invalid.</p>
          <p>You can close this window.</p>
        </body>
      </html>
    `);
  }
  
  // Handle the callback asynchronously
  try {
    const userData = await handleOAuthCallback(code, state, pendingRequest.verifier, pendingRequest.state);
    
    // Resolve the promise with user data
    pendingRequest.resolve(userData);
    
    // Clean up pending request
    pendingOAuthRequests.delete(state);
    
    // Show success page
    return c.html(`
      <html>
        <body>
          <h1>Authentication Successful!</h1>
          <p>Welcome, ${userData.name}!</p>
          <p>Email: ${userData.email}</p>
          <p>You can close this window and return to the app.</p>
          <script>
            // Optionally close the window after 3 seconds
            setTimeout(() => window.close(), 3000);
          </script>
        </body>
      </html>
    `);
  } catch (error: any) {
    // Reject the promise with error
    pendingRequest.reject(error);
    
    // Clean up pending request
    pendingOAuthRequests.delete(state);
    
    return c.html(`
      <html>
        <body>
          <h1>Authentication Error</h1>
          <p>${error.message}</p>
          <p>You can close this window.</p>
        </body>
      </html>
    `);
  }
});

/**
 * ============================================================================
 * MAIN OAUTH FUNCTION - USAGE EXAMPLE
 * ============================================================================
 * 
 * This function demonstrates how to use the OAuth flow in your application.
 * 
 * USE CASE: Call this function when user wants to login with Google
 */
export async function loginWithGoogle(): Promise<{
  googleId: string;
  email: string;
  name: string;
  profilePhotoUrl: string;
}> {
  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Start OAuth flow
      const { verifier, state } = await initiateOAuthFlow();
      
      // Step 2: Store pending request (so callback can resolve it)
      pendingOAuthRequests.set(state, {
        verifier,
        state,
        resolve,
        reject,
      });
      
      // Step 3: Set timeout (optional - prevent hanging forever)
      setTimeout(() => {
        if (pendingOAuthRequests.has(state)) {
          pendingOAuthRequests.delete(state);
          reject(new Error('OAuth flow timed out'));
        }
      }, 5 * 60 * 1000); // 5 minutes timeout
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * ============================================================================
 * SERVER INITIALIZATION
 * ============================================================================
 * 
 * Start the OAuth callback server
 * This server listens for Google's redirect after authentication
 */
export function startOAuthCallbackServer(): void {
  serve({
    fetch: oauthApp.fetch,
    port: OAUTH_CONFIG.callbackPort,
  }, (info) => {
    console.log(`OAuth callback server running on http://localhost:${info.port}`);
  });
}

/**
 * ============================================================================
 * USAGE EXAMPLE
 * ============================================================================
 * 
 * HOW TO USE THIS IN YOUR APPLICATION:
 * 
 * 1. Start the OAuth callback server:
 *    startOAuthCallbackServer();
 * 
 * 2. When user clicks "Login with Google":
 *    try {
 *      const user = await loginWithGoogle();
 *      console.log('Logged in user:', user);
 *      // Update UI with user data
 *    } catch (error) {
 *      console.error('Login failed:', error);
 *      // Show error to user
 *    }
 * 
 * 3. Check if user is already logged in (on app startup):
 *    const user = await getUserFromDatabase(googleId);
 *    if (user && user.tokenExpiresAt > Date.now() / 1000) {
 *      // User is logged in and token is valid
 *      // Use user.accessToken for API calls
 *    } else if (user && user.refreshToken) {
 *      // Token expired, refresh it
 *      const newTokens = await refreshAccessToken(user.refreshToken);
 *      // Update database with new tokens
 *    } else {
 *      // User needs to login
 *    }
 * 
 * ============================================================================
 */

/**
 * ============================================================================
 * ADDITIONAL CONSIDERATIONS
 * ============================================================================
 * 
 * 1. ERROR HANDLING:
 *    - Handle network errors
 *    - Handle invalid tokens
 *    - Handle revoked tokens
 *    - Handle expired refresh tokens
 * 
 * 2. SECURITY:
 *    - Encrypt tokens in database
 *    - Use HTTPS in production
 *    - Validate all inputs
 *    - Implement rate limiting
 *    - Use secure storage for secrets
 * 
 * 3. USER EXPERIENCE:
 *    - Show loading states
 *    - Handle browser popup blockers
 *    - Provide clear error messages
 *    - Remember user sessions
 *    - Implement logout functionality
 * 
 * 4. TOKEN MANAGEMENT:
 *    - Refresh tokens before expiration
 *    - Handle token revocation
 *    - Implement token cleanup
 *    - Monitor token usage
 * 
 * 5. TESTING:
 *    - Test with multiple Google accounts
 *    - Test token expiration scenarios
 *    - Test error cases
 *    - Test network failures
 * 
 * ============================================================================
 */

