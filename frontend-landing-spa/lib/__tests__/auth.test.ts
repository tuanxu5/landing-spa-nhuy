/**
 * Unit tests for authentication utilities
 */

import {
  setSessionToken,
  getSessionToken,
  clearSessionToken,
  setAdministrator,
  getAdministrator,
  clearAdministrator,
  clearSession,
  isAuthenticated,
  setSession,
} from '../auth';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Authentication Utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('Session Token Management', () => {
    it('should store session token in localStorage', () => {
      const token = 'test-token-123';
      setSessionToken(token);
      expect(localStorage.getItem('spa_session_token')).toBe(token);
    });

    it('should retrieve session token from localStorage', () => {
      const token = 'test-token-456';
      localStorage.setItem('spa_session_token', token);
      expect(getSessionToken()).toBe(token);
    });

    it('should return null when no session token exists', () => {
      expect(getSessionToken()).toBeNull();
    });

    it('should remove session token from localStorage', () => {
      localStorage.setItem('spa_session_token', 'test-token');
      clearSessionToken();
      expect(localStorage.getItem('spa_session_token')).toBeNull();
    });
  });

  describe('Administrator Data Management', () => {
    const mockAdmin = {
      _id: '123',
      username: 'testuser',
      email: 'test@example.com',
    };

    it('should store administrator data in localStorage', () => {
      setAdministrator(mockAdmin);
      const stored = localStorage.getItem('spa_session_admin');
      expect(stored).toBe(JSON.stringify(mockAdmin));
    });

    it('should retrieve administrator data from localStorage', () => {
      localStorage.setItem('spa_session_admin', JSON.stringify(mockAdmin));
      const retrieved = getAdministrator();
      expect(retrieved).toEqual(mockAdmin);
    });

    it('should return null when no administrator data exists', () => {
      expect(getAdministrator()).toBeNull();
    });

    it('should return null when administrator data is invalid JSON', () => {
      localStorage.setItem('spa_session_admin', 'invalid-json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      expect(getAdministrator()).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should remove administrator data from localStorage', () => {
      localStorage.setItem('spa_session_admin', JSON.stringify(mockAdmin));
      clearAdministrator();
      expect(localStorage.getItem('spa_session_admin')).toBeNull();
    });
  });

  describe('Complete Session Management', () => {
    const mockToken = 'session-token-789';
    const mockAdmin = {
      _id: '456',
      username: 'admin',
      email: 'admin@example.com',
    };

    it('should store complete session (token + administrator)', () => {
      setSession(mockToken, mockAdmin);
      expect(getSessionToken()).toBe(mockToken);
      expect(getAdministrator()).toEqual(mockAdmin);
    });

    it('should clear all session data', () => {
      setSession(mockToken, mockAdmin);
      clearSession();
      expect(getSessionToken()).toBeNull();
      expect(getAdministrator()).toBeNull();
    });

    it('should return true when user is authenticated', () => {
      setSessionToken(mockToken);
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      expect(isAuthenticated()).toBe(false);
    });
  });
});
