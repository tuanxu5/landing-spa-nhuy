import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PostEditor from '../PostEditor';
import { postsApi } from '@/lib/api';
import type { Post } from '@/types';

// Mock the API
jest.mock('@/lib/api', () => ({
  postsApi: {
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

const mockPost: Post = {
  _id: '1',
  title: 'Swedish Massage',
  content: 'Experience ultimate relaxation with our Swedish massage service.',
  featuredImage: 'https://example.com/image.jpg',
  category: 'service',
  status: 'published',
  publishedAt: '2024-12-01T00:00:00.000Z',
  createdAt: '2024-12-01T00:00:00.000Z',
  updatedAt: '2024-12-01T00:00:00.000Z',
};

describe('PostEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('renders empty form in create mode', () => {
      render(<PostEditor />);

      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/content/i)).toHaveValue('');
      expect(screen.getByLabelText(/featured image url/i)).toHaveValue('');
      expect(screen.getByLabelText(/category/i)).toHaveValue('service');
      expect(screen.getByLabelText(/status/i)).toHaveValue('draft');
      expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument();
    });

    it('validates required fields before submission', async () => {
      render(<PostEditor />);

      const submitButton = screen.getByRole('button', { name: /create post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
        expect(screen.getByText('Content is required')).toBeInTheDocument();
      });

      expect(postsApi.create).not.toHaveBeenCalled();
    });

    it('validates title length', async () => {
      render(<PostEditor />);

      const titleInput = screen.getByLabelText(/title/i);
      const longTitle = 'a'.repeat(201);
      fireEvent.change(titleInput, { target: { value: longTitle } });

      const submitButton = screen.getByRole('button', { name: /create post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title must be less than 200 characters')).toBeInTheDocument();
      });
    });

    it('validates featured image URL format', async () => {
      render(<PostEditor />);

      const titleInput = screen.getByLabelText(/title/i);
      const contentInput = screen.getByLabelText(/content/i);
      const imageInput = screen.getByLabelText(/featured image url/i);

      fireEvent.change(titleInput, { target: { value: 'Test Post' } });
      fireEvent.change(contentInput, { target: { value: 'Test content' } });
      fireEvent.change(imageInput, { target: { value: 'not-a-valid-url' } });

      const submitButton = screen.getByRole('button', { name: /create post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid URL format')).toBeInTheDocument();
      });
    });

    it('creates post with valid data', async () => {
      const createdPost = { ...mockPost, _id: '2' };
      (postsApi.create as jest.Mock).mockResolvedValue(createdPost);

      render(<PostEditor />);

      const titleInput = screen.getByLabelText(/title/i);
      const contentInput = screen.getByLabelText(/content/i);
      const imageInput = screen.getByLabelText(/featured image url/i);
      const categorySelect = screen.getByLabelText(/category/i);
      const statusSelect = screen.getByLabelText(/status/i);

      fireEvent.change(titleInput, { target: { value: 'Swedish Massage' } });
      fireEvent.change(contentInput, { target: { value: 'Experience ultimate relaxation' } });
      fireEvent.change(imageInput, { target: { value: 'https://example.com/image.jpg' } });
      fireEvent.change(categorySelect, { target: { value: 'service' } });
      fireEvent.change(statusSelect, { target: { value: 'published' } });

      const submitButton = screen.getByRole('button', { name: /create post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(postsApi.create).toHaveBeenCalledWith({
          title: 'Swedish Massage',
          content: 'Experience ultimate relaxation',
          featuredImage: 'https://example.com/image.jpg',
          category: 'service',
          status: 'published',
          publishedAt: undefined,
        });
      });

      expect(screen.getByText('Post created successfully!')).toBeInTheDocument();
    });

    it('displays loading state during submission', async () => {
      (postsApi.create as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<PostEditor />);

      const titleInput = screen.getByLabelText(/title/i);
      const contentInput = screen.getByLabelText(/content/i);

      fireEvent.change(titleInput, { target: { value: 'Test Post' } });
      fireEvent.change(contentInput, { target: { value: 'Test content' } });

      const submitButton = screen.getByRole('button', { name: /create post/i });
      fireEvent.click(submitButton);

      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('displays error message when creation fails', async () => {
      const errorMessage = 'Failed to create post';
      (postsApi.create as jest.Mock).mockRejectedValue({
        message: errorMessage,
        statusCode: 500,
      });

      render(<PostEditor />);

      const titleInput = screen.getByLabelText(/title/i);
      const contentInput = screen.getByLabelText(/content/i);

      fireEvent.change(titleInput, { target: { value: 'Test Post' } });
      fireEvent.change(contentInput, { target: { value: 'Test content' } });

      const submitButton = screen.getByRole('button', { name: /create post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('displays field-specific errors from API', async () => {
      (postsApi.create as jest.Mock).mockRejectedValue({
        message: 'Validation failed',
        statusCode: 400,
        errors: [
          { field: 'title', message: 'Title already exists' },
          { field: 'content', message: 'Content is too short' },
        ],
      });

      render(<PostEditor />);

      const titleInput = screen.getByLabelText(/title/i);
      const contentInput = screen.getByLabelText(/content/i);

      fireEvent.change(titleInput, { target: { value: 'Test Post' } });
      fireEvent.change(contentInput, { target: { value: 'Test' } });

      const submitButton = screen.getByRole('button', { name: /create post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title already exists')).toBeInTheDocument();
        expect(screen.getByText('Content is too short')).toBeInTheDocument();
      });
    });

    it('resets form after successful creation', async () => {
      const createdPost = { ...mockPost, _id: '2' };
      (postsApi.create as jest.Mock).mockResolvedValue(createdPost);

      render(<PostEditor />);

      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
      const contentInput = screen.getByLabelText(/content/i) as HTMLTextAreaElement;

      fireEvent.change(titleInput, { target: { value: 'Test Post' } });
      fireEvent.change(contentInput, { target: { value: 'Test content' } });

      const submitButton = screen.getByRole('button', { name: /create post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Post created successfully!')).toBeInTheDocument();
      });

      // Form should be reset
      expect(titleInput.value).toBe('');
      expect(contentInput.value).toBe('');
    });

    it('calls onSave callback after successful creation', async () => {
      const onSave = jest.fn();
      const createdPost = { ...mockPost, _id: '2' };
      (postsApi.create as jest.Mock).mockResolvedValue(createdPost);

      render(<PostEditor onSave={onSave} />);

      const titleInput = screen.getByLabelText(/title/i);
      const contentInput = screen.getByLabelText(/content/i);

      fireEvent.change(titleInput, { target: { value: 'Test Post' } });
      fireEvent.change(contentInput, { target: { value: 'Test content' } });

      const submitButton = screen.getByRole('button', { name: /create post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(createdPost);
      });
    });

    it('clears field error when user starts typing', async () => {
      render(<PostEditor />);

      const submitButton = screen.getByRole('button', { name: /create post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: 'T' } });

      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });

    it('allows empty featured image URL', async () => {
      const createdPost = { ...mockPost, _id: '2', featuredImage: undefined };
      (postsApi.create as jest.Mock).mockResolvedValue(createdPost);

      render(<PostEditor />);

      const titleInput = screen.getByLabelText(/title/i);
      const contentInput = screen.getByLabelText(/content/i);

      fireEvent.change(titleInput, { target: { value: 'Test Post' } });
      fireEvent.change(contentInput, { target: { value: 'Test content' } });

      const submitButton = screen.getByRole('button', { name: /create post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(postsApi.create).toHaveBeenCalledWith(
          expect.objectContaining({
            featuredImage: undefined,
          })
        );
      });
    });
  });

  describe('Edit Mode', () => {
    it('displays loading state while fetching post', () => {
      (postsApi.getById as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<PostEditor postId="1" />);

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('fetches and displays existing post data', async () => {
      (postsApi.getById as jest.Mock).mockResolvedValue(mockPost);

      render(<PostEditor postId="1" />);

      await waitFor(() => {
        expect(postsApi.getById).toHaveBeenCalledWith('1');
      });

      expect(screen.getByLabelText(/title/i)).toHaveValue('Swedish Massage');
      expect(screen.getByLabelText(/content/i)).toHaveValue(
        'Experience ultimate relaxation with our Swedish massage service.'
      );
      expect(screen.getByLabelText(/featured image url/i)).toHaveValue(
        'https://example.com/image.jpg'
      );
      expect(screen.getByLabelText(/category/i)).toHaveValue('service');
      expect(screen.getByLabelText(/status/i)).toHaveValue('published');
      expect(screen.getByRole('button', { name: /update post/i })).toBeInTheDocument();
    });

    it('displays error when post fetch fails', async () => {
      const errorMessage = 'Post not found';
      (postsApi.getById as jest.Mock).mockRejectedValue({
        message: errorMessage,
        statusCode: 404,
      });

      render(<PostEditor postId="1" />);

      await waitFor(() => {
        expect(screen.getByText('Error loading post')).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('allows retrying after fetch error', async () => {
      (postsApi.getById as jest.Mock)
        .mockRejectedValueOnce({
          message: 'Network error',
          statusCode: 500,
        })
        .mockResolvedValueOnce(mockPost);

      render(<PostEditor postId="1" />);

      await waitFor(() => {
        expect(screen.getByText('Error loading post')).toBeInTheDocument();
      });

      const retryButton = screen.getByText('Try again');
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/title/i)).toHaveValue('Swedish Massage');
      });
    });

    it('updates post with modified data', async () => {
      (postsApi.getById as jest.Mock).mockResolvedValue(mockPost);
      const updatedPost = { ...mockPost, title: 'Updated Title' };
      (postsApi.update as jest.Mock).mockResolvedValue(updatedPost);

      render(<PostEditor postId="1" />);

      await waitFor(() => {
        expect(screen.getByLabelText(/title/i)).toHaveValue('Swedish Massage');
      });

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

      const submitButton = screen.getByRole('button', { name: /update post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(postsApi.update).toHaveBeenCalledWith('1', {
          title: 'Updated Title',
          content: 'Experience ultimate relaxation with our Swedish massage service.',
          featuredImage: 'https://example.com/image.jpg',
          category: 'service',
          status: 'published',
          publishedAt: '2024-12-01T00:00:00.000Z',
        });
      });

      expect(screen.getByText('Post updated successfully!')).toBeInTheDocument();
    });

    it('does not reset form after successful update', async () => {
      (postsApi.getById as jest.Mock).mockResolvedValue(mockPost);
      const updatedPost = { ...mockPost, title: 'Updated Title' };
      (postsApi.update as jest.Mock).mockResolvedValue(updatedPost);

      render(<PostEditor postId="1" />);

      await waitFor(() => {
        expect(screen.getByLabelText(/title/i)).toHaveValue('Swedish Massage');
      });

      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

      const submitButton = screen.getByRole('button', { name: /update post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Post updated successfully!')).toBeInTheDocument();
      });

      // Form should NOT be reset in edit mode
      expect(titleInput.value).toBe('Updated Title');
    });

    it('displays error message when update fails', async () => {
      (postsApi.getById as jest.Mock).mockResolvedValue(mockPost);
      const errorMessage = 'Failed to update post';
      (postsApi.update as jest.Mock).mockRejectedValue({
        message: errorMessage,
        statusCode: 500,
      });

      render(<PostEditor postId="1" />);

      await waitFor(() => {
        expect(screen.getByLabelText(/title/i)).toHaveValue('Swedish Massage');
      });

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

      const submitButton = screen.getByRole('button', { name: /update post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('calls onSave callback after successful update', async () => {
      const onSave = jest.fn();
      (postsApi.getById as jest.Mock).mockResolvedValue(mockPost);
      const updatedPost = { ...mockPost, title: 'Updated Title' };
      (postsApi.update as jest.Mock).mockResolvedValue(updatedPost);

      render(<PostEditor postId="1" onSave={onSave} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/title/i)).toHaveValue('Swedish Massage');
      });

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

      const submitButton = screen.getByRole('button', { name: /update post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(updatedPost);
      });
    });
  });

  describe('Form Interactions', () => {
    it('supports all category options', () => {
      render(<PostEditor />);

      const categorySelect = screen.getByLabelText(/category/i);
      const options = Array.from(categorySelect.querySelectorAll('option'));

      expect(options).toHaveLength(3);
      expect(options[0]).toHaveValue('service');
      expect(options[1]).toHaveValue('promotion');
      expect(options[2]).toHaveValue('information');
    });

    it('supports all status options', () => {
      render(<PostEditor />);

      const statusSelect = screen.getByLabelText(/status/i);
      const options = Array.from(statusSelect.querySelectorAll('option'));

      expect(options).toHaveLength(2);
      expect(options[0]).toHaveValue('draft');
      expect(options[1]).toHaveValue('published');
    });

    it('clears success message when user makes changes', async () => {
      const createdPost = { ...mockPost, _id: '2' };
      (postsApi.create as jest.Mock).mockResolvedValue(createdPost);

      render(<PostEditor />);

      const titleInput = screen.getByLabelText(/title/i);
      const contentInput = screen.getByLabelText(/content/i);

      fireEvent.change(titleInput, { target: { value: 'Test Post' } });
      fireEvent.change(contentInput, { target: { value: 'Test content' } });

      const submitButton = screen.getByRole('button', { name: /create post/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Post created successfully!')).toBeInTheDocument();
      });

      // Make a change
      fireEvent.change(titleInput, { target: { value: 'Test Post 2' } });

      // Success message should be cleared
      expect(screen.queryByText('Post created successfully!')).not.toBeInTheDocument();
    });
  });
});
