/**
 * Unit tests for Services component
 * 
 * Tests data fetching, display, loading states, and error handling.
 * Requirements: 10.3, 10.4
 */

import { render, screen, waitFor } from '@testing-library/react';
import Services from '../Services';
import { postsApi } from '@/lib/api';

// Mock the API module
jest.mock('@/lib/api', () => ({
  postsApi: {
    getAll: jest.fn(),
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const mockServices = [
  {
    _id: '1',
    title: 'Swedish Massage',
    content: 'A relaxing full-body massage using gentle pressure to promote relaxation and ease muscle tension.',
    featuredImage: 'https://example.com/swedish-massage.jpg',
    category: 'service' as const,
    status: 'published' as const,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '2',
    title: 'Deep Tissue Massage',
    content: 'A therapeutic massage targeting deeper layers of muscle and connective tissue.',
    featuredImage: 'https://example.com/deep-tissue.jpg',
    category: 'service' as const,
    status: 'published' as const,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '3',
    title: 'Hot Stone Therapy',
    content: 'Heated stones are placed on specific points on the body to warm and loosen tight muscles.',
    category: 'service' as const,
    status: 'published' as const,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state while fetching services', () => {
    (postsApi.getAll as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolves

    render(<Services />);

    expect(screen.getByText(/our services/i)).toBeInTheDocument();
    expect(screen.getByText(/discover our range of premium spa treatments/i)).toBeInTheDocument();
    
    // Check for loading skeleton
    const skeletons = screen.getAllByRole('generic').filter(el => 
      el.className.includes('animate-pulse')
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays services in grid layout after successful fetch', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue(mockServices);

    render(<Services />);

    // Wait for services to load
    await waitFor(() => {
      expect(screen.getByText('Swedish Massage')).toBeInTheDocument();
    });

    expect(screen.getByText('Deep Tissue Massage')).toBeInTheDocument();
    expect(screen.getByText('Hot Stone Therapy')).toBeInTheDocument();

    // Verify content is displayed
    expect(screen.getByText(/relaxing full-body massage/i)).toBeInTheDocument();
    expect(screen.getByText(/therapeutic massage targeting deeper layers/i)).toBeInTheDocument();
  });

  it('displays service images when available', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue(mockServices);

    render(<Services />);

    await waitFor(() => {
      expect(screen.getByText('Swedish Massage')).toBeInTheDocument();
    });

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    
    const swedishMassageImage = images.find(img => 
      img.getAttribute('alt') === 'Swedish Massage'
    );
    expect(swedishMassageImage).toBeInTheDocument();
    expect(swedishMassageImage).toHaveAttribute('src', 'https://example.com/swedish-massage.jpg');
  });

  it('displays placeholder icon when service has no image', async () => {
    const servicesWithoutImage = [
      {
        ...mockServices[2],
        featuredImage: undefined,
      },
    ];
    (postsApi.getAll as jest.Mock).mockResolvedValue(servicesWithoutImage);

    render(<Services />);

    await waitFor(() => {
      expect(screen.getByText('Hot Stone Therapy')).toBeInTheDocument();
    });

    // Check for SVG placeholder icon
    const svgElements = screen.getAllByRole('generic').filter(el => 
      el.tagName.toLowerCase() === 'svg' || el.querySelector('svg')
    );
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('displays error message on fetch failure', async () => {
    (postsApi.getAll as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<Services />);

    await waitFor(() => {
      expect(screen.getByText(/unable to load services/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('displays empty state when no services are available', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue([]);

    render(<Services />);

    await waitFor(() => {
      expect(screen.getByText(/no services available at the moment/i)).toBeInTheDocument();
    });
  });

  it('fetches services with correct filters', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue(mockServices);

    render(<Services />);

    await waitFor(() => {
      expect(screen.getByText('Swedish Massage')).toBeInTheDocument();
    });

    // Verify API was called with correct filters
    expect(postsApi.getAll).toHaveBeenCalledWith({
      category: 'service',
      status: 'published',
    });
  });

  it('displays services in responsive grid', async () => {
    (postsApi.getAll as jest.Mock).mockResolvedValue(mockServices);

    render(<Services />);

    await waitFor(() => {
      expect(screen.getByText('Swedish Massage')).toBeInTheDocument();
    });

    // Find the grid container
    const gridContainer = screen.getByText('Swedish Massage').closest('div')?.parentElement?.parentElement;
    expect(gridContainer).toHaveClass('grid');
    expect(gridContainer?.className).toMatch(/grid-cols-1|md:grid-cols-2|lg:grid-cols-3/);
  });
});
