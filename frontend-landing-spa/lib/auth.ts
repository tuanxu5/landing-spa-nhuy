/**
 * Authentication utilities for session token management
 */

const SESSION_TOKEN_KEY = 'spa_session_token';
const SESSION_ADMIN_KEY = 'spa_session_admin';

/**
 * Check if we're running in the browser
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Store session token in localStorage
 */
export const setSessionToken = (token: string): void => {
  if (isBrowser) {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  }
};

/**
 * Retrieve session token from localStorage
 */
export const getSessionToken = (): string | null => {
  if (isBrowser) {
    return localStorage.getItem(SESSION_TOKEN_KEY);
  }
  return null;
};

/**
 * Remove session token from localStorage
 */
export const clearSessionToken = (): void => {
  if (isBrowser) {
    localStorage.removeItem(SESSION_TOKEN_KEY);
  }
};

/**
 * Store administrator data in localStorage
 */
export const setAdministrator = (admin: { _id: string; username: string; email: string }): void => {
  if (isBrowser) {
    localStorage.setItem(SESSION_ADMIN_KEY, JSON.stringify(admin));
  }
};

/**
 * Retrieve administrator data from localStorage
 */
export const getAdministrator = (): { _id: string; username: string; email: string } | null => {
  if (isBrowser) {
    const adminData = localStorage.getItem(SESSION_ADMIN_KEY);
    if (adminData) {
      try {
        return JSON.parse(adminData);
      } catch (error) {
        console.error('Failed to parse administrator data:', error);
        return null;
      }
    }
  }
  return null;
};

/**
 * Remove administrator data from localStorage
 */
export const clearAdministrator = (): void => {
  if (isBrowser) {
    localStorage.removeItem(SESSION_ADMIN_KEY);
  }
};

/**
 * Clear all session data (token and administrator)
 */
export const clearSession = (): void => {
  clearSessionToken();
  clearAdministrator();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getSessionToken() !== null;
};

/**
 * Store complete session (token + administrator data)
 */
export const setSession = (token: string, admin: { _id: string; username: string; email: string }): void => {
  setSessionToken(token);
  setAdministrator(admin);
};
