/**
 * Unit tests for Admin Dashboard page
 */

import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboard from '../page';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardApi } from '@/lib/api';

// Mock dependencies
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  dashboardApi: {
    getStats: jest.fn(),
  },
}));

jest.mock('@/components/admin/ProtectedRoute', () => {
  return ({ children }: any) => <div>{children}</div>;
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

describe('AdminDashboard', () => {
  const mockAdministrator = {
    _id: '123',
    username: 'testadmin',
    email: 'test@example.com',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockStats = {
    totalBookings: 42,
    pendingBookings: 7,
    publishedPosts: 15,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      administrator: mockAdministrator,
      isAuthenticated: true,
      isLoading: false,
      logout: jest.fn(),
    });
  });

  it('should display loading state while fetching statistics', () => {
    (dashboardApi.getStats as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<AdminDashboard />);

    // Should show loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should display statistics after successful fetch', async () => {
    (dashboardApi.getStats as jest.Mock).mockResolvedValue(mockStats);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });

  it('should display total bookings card', async () => {
    (dashboardApi.getStats as jest.Mock).mockResolvedValue(mockStats);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total Bookings')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  it('should display pending bookings card', async () => {
    (dashboardApi.getStats as jest.Mock).mockResolvedValue(mockStats);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Pending Bookings')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
    });
  });

  it('should display published posts card', async () => {
    (dashboardApi.getStats as jest.Mock).mockResolvedValue(mockStats);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Published Posts')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });

  it('should display welcome message with username', async () => {
    (dashboardApi.getStats as jest.Mock).mockResolvedValue(mockStats);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome back, testadmin/)).toBeInTheDocument();
    });
  });

  it('should display error message when fetch fails', async () => {
    const errorMessage = 'Failed to load statistics';
    (dashboardApi.getStats as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Error loading statistics')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should display quick action links', async () => {
    (dashboardApi.getStats as jest.Mock).mockResolvedValue(mockStats);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Manage Bookings')).toBeInTheDocument();
      expect(screen.getByText('Manage Posts')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('View Landing Page')).toBeInTheDocument();
    });
  });

  it('should have correct links in statistics cards', async () => {
    (dashboardApi.getStats as jest.Mock).mockResolvedValue(mockStats);

    render(<AdminDashboard />);

    await waitFor(() => {
      const viewAllLink = screen.getByText('View all bookings →').closest('a');
      expect(viewAllLink).toHaveAttribute('href', '/admin/bookings');

      const reviewPendingLink = screen.getByText('Review pending →').closest('a');
      expect(reviewPendingLink).toHaveAttribute('href', '/admin/bookings?status=pending');

      const managePostsLink = screen.getByText('Manage posts →').closest('a');
      expect(managePostsLink).toHaveAttribute('href', '/admin/posts');
    });
  });

  it('should display zero values when no data exists', async () => {
    (dashboardApi.getStats as jest.Mock).mockResolvedValue({
      totalBookings: 0,
      pendingBookings: 0,
      publishedPosts: 0,
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBe(3);
    });
  });

  it('should render dashboard title', async () => {
    (dashboardApi.getStats as jest.Mock).mockResolvedValue(mockStats);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
