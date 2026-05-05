/**
 * Unit tests for Login Page
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginPage from '../page';
import { authApi } from '@/lib/api';
import { setSession } from '@/lib/auth';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  authApi: {
    login: jest.fn(),
  },
}));

jest.mock('@/lib/auth', () => ({
  setSession: jest.fn(),
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render login form with username and password fields', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should update form data when user types', () => {
    render(<LoginPage />);
    
    const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpass');
  });

  it('should call login API and redirect on successful login', async () => {
    const mockResponse = {
      token: 'test-token',
      administrator: {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    };

    (authApi.login as jest.Mock).mockResolvedValue(mockResponse);

    render(<LoginPage />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
      });
      expect(setSession).toHaveBeenCalledWith(
        mockResponse.token,
        mockResponse.administrator
      );
      expect(mockPush).toHaveBeenCalledWith('/admin');
    });
  });

  it('should display error message for invalid credentials', async () => {
    const mockError = {
      statusCode: 401,
      message: 'Invalid username or password',
    };

    (authApi.login as jest.Mock).mockRejectedValue(mockError);

    render(<LoginPage />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });

  it('should disable form during submission', async () => {
    (authApi.login as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<LoginPage />);
    
    const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign in/i }) as HTMLButtonElement;
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);
    
    // Check that form is disabled during submission
    expect(submitButton).toBeDisabled();
    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  it('should prevent submission with empty fields', () => {
    render(<LoginPage />);
    
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // HTML5 validation should prevent submission
    fireEvent.click(submitButton);
    
    // Login API should not be called
    expect(authApi.login).not.toHaveBeenCalled();
  });
});
