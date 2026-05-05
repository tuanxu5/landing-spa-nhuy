import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import PostsPage from '../page';
import { postsApi } from '@/lib/api';
import type { Post } from '@/types';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  postsApi: {
    getAll: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('PostsPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockPosts: Post[] = [
    {
      _id: '1',
      title: 'Swedish Massage',
      content: 'Relaxing massage service',
      category: 'service',
      status: 'published',
      publishedAt: '2024-01-15T00:00:00.000Z',
      createdAt: '2024-01-10T00:00:00.000Z',
      updatedAt: '2024-01-10T00:00:00.000Z',
    },
    {
      _id: '2',
      title: 'Spring Promotion',
      content: '20% off all services',
      category: 'promotion',
      status: 'draft',
      createdAt: '2024-01-12T00:00:00.000Z',
      updatedAt: '2024-01-12T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders loading state initially', () => {
    (postsApi.getAll as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<PostsPage />);

    // Check for the loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders posts list after successful fetch', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue(mockPosts);

    render(<PostsPage />);

    await waitFor(() => {
      expect(screen.getByText('Swedish Massage')).toBeInTheDocument();
      expect(screen.getByText('Spring Promotion')).toBeInTheDocument();
    });

    // Check that categories and statuses are displayed
    expect(screen.getByText('service')).toBeInTheDocument();
    expect(screen.getByText('promotion')).toBeInTheDocument();
    expect(screen.getByText('published')).toBeInTheDocument();
    expect(screen.getByText('draft')).toBeInTheDocument();
  });

  it('renders empty state when no posts exist', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue([]);

    render(<PostsPage />);

    await waitFor(() => {
      expect(screen.getByText('No posts found')).toBeInTheDocument();
      expect(
        screen.getByText('Get started by creating a new post.')
      ).toBeInTheDocument();
    });
  });

  it('renders error state when fetch fails', async () => {
    const errorMessage = 'Failed to fetch posts';
    (postsApi.getAll as jest.Mock).mockRejectedValue({
      message: errorMessage,
    });

    render(<PostsPage />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('navigates to create page when Create New Post button is clicked', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue(mockPosts);

    render(<PostsPage />);

    await waitFor(() => {
      expect(screen.getByText('Swedish Massage')).toBeInTheDocument();
    });

    const createButton = screen.getAllByText('Create New Post')[0];
    fireEvent.click(createButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/admin/posts/new');
  });

  it('navigates to edit page when Edit button is clicked', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue(mockPosts);

    render(<PostsPage />);

    await waitFor(() => {
      expect(screen.getByText('Swedish Massage')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(mockRouter.push).toHaveBeenCalledWith('/admin/posts/1/edit');
  });

  it('shows confirmation dialog when Delete button is clicked', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue(mockPosts);

    render(<PostsPage />);

    await waitFor(() => {
      expect(screen.getByText('Swedish Massage')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Confirmation dialog should appear
    expect(screen.getByText('Confirm?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('deletes post when confirmed', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue(mockPosts);
    (postsApi.delete as jest.Mock).mockResolvedValue(undefined);

    render(<PostsPage />);

    await waitFor(() => {
      expect(screen.getByText('Swedish Massage')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Confirm deletion
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(postsApi.delete).toHaveBeenCalledWith('1');
      expect(postsApi.getAll).toHaveBeenCalledTimes(2); // Initial fetch + refresh after delete
    });
  });

  it('cancels deletion when No is clicked', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue(mockPosts);

    render(<PostsPage />);

    await waitFor(() => {
      expect(screen.getByText('Swedish Massage')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Cancel deletion
    const noButton = screen.getByText('No');
    fireEvent.click(noButton);

    // Confirmation dialog should disappear
    await waitFor(() => {
      expect(screen.queryByText('Confirm?')).not.toBeInTheDocument();
    });

    // Delete should not have been called
    expect(postsApi.delete).not.toHaveBeenCalled();
  });

  it('displays error message when delete fails', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue(mockPosts);
    (postsApi.delete as jest.Mock).mockRejectedValue({
      message: 'Failed to delete post',
    });

    render(<PostsPage />);

    await waitFor(() => {
      expect(screen.getByText('Swedish Massage')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Confirm deletion
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to delete post')).toBeInTheDocument();
    });
  });

  it('formats publication date correctly', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue(mockPosts);

    render(<PostsPage />);

    await waitFor(() => {
      expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
      expect(screen.getByText('Not published')).toBeInTheDocument();
    });
  });

  it('displays featured image indicator', async () => {
    const postsWithImage: Post[] = [
      {
        ...mockPosts[0],
        featuredImage: 'https://example.com/image.jpg',
      },
    ];

    (postsApi.getAll as jest.Mock).mockResolvedValue(postsWithImage);

    render(<PostsPage />);

    await waitFor(() => {
      expect(screen.getByText('Has featured image')).toBeInTheDocument();
    });
  });

  it('retries fetch when Try again button is clicked', async () => {
    (postsApi.getAll as jest.Mock).mockRejectedValueOnce({
      message: 'Network error',
    });

    render(<PostsPage />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    // Mock successful response for retry
    (postsApi.getAll as jest.Mock).mockResolvedValue(mockPosts);

    const tryAgainButton = screen.getByText('Try again');
    fireEvent.click(tryAgainButton);

    await waitFor(() => {
      expect(screen.getByText('Swedish Massage')).toBeInTheDocument();
    });
  });
});
