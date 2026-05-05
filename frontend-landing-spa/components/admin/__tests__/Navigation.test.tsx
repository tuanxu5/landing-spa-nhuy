/**
 * Unit tests for Navigation component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Navigation from '../Navigation';
import { useAuth } from '@/contexts/AuthContext';

// Mock dependencies
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, onClick }: any) => {
    return (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    );
  };
});

describe('Navigation', () => {
  const mockLogout = jest.fn();
  const mockAdministrator = {
    _id: '123',
    username: 'testadmin',
    email: 'test@example.com',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue('/admin');
    (useAuth as jest.Mock).mockReturnValue({
      administrator: mockAdministrator,
      logout: mockLogout,
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('should render navigation links', () => {
    render(<Navigation />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should display administrator username', () => {
    render(<Navigation />);

    expect(screen.getByText('testadmin')).toBeInTheDocument();
  });

  it('should display administrator email', () => {
    render(<Navigation />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should display first letter of username in avatar', () => {
    render(<Navigation />);

    const avatar = screen.getByText('T');
    expect(avatar).toBeInTheDocument();
  });

  it('should render navigation with correct structure for active link', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/bookings');
    render(<Navigation />);

    // Verify the bookings link exists and is rendered
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render navigation with correct structure for dashboard', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin');
    render(<Navigation />);

    // Verify the dashboard link exists
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render all navigation links regardless of active path', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/bookings');
    render(<Navigation />);

    // Verify all navigation links are present
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render logout button', () => {
    render(<Navigation />);

    const logoutButtons = screen.getAllByText('Logout');
    expect(logoutButtons.length).toBeGreaterThan(0);
  });

  it('should call logout when logout button is clicked', () => {
    render(<Navigation />);

    const logoutButtons = screen.getAllByText('Logout');
    fireEvent.click(logoutButtons[0]);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should toggle mobile menu when hamburger button is clicked', () => {
    render(<Navigation />);

    // Mobile menu should be hidden initially (has -translate-x-full class)
    const sidebar = document.querySelector('aside');
    expect(sidebar).toHaveClass('-translate-x-full');

    // Click hamburger button to open menu
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);

    // Mobile menu should now be visible (has translate-x-0 class)
    expect(sidebar).toHaveClass('translate-x-0');
  });

  it('should close mobile menu when close button is clicked', () => {
    render(<Navigation />);

    // Open mobile menu
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);

    const sidebar = document.querySelector('aside');
    expect(sidebar).toHaveClass('translate-x-0');

    // Close mobile menu
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);

    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('should close mobile menu when overlay is clicked', () => {
    render(<Navigation />);

    // Open mobile menu
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);

    const sidebar = document.querySelector('aside');
    expect(sidebar).toHaveClass('translate-x-0');

    // Click overlay to close
    const overlay = document.querySelector('.bg-gray-600');
    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('should render brand name', () => {
    render(<Navigation />);

    expect(screen.getByText('Spa Admin')).toBeInTheDocument();
  });
});
