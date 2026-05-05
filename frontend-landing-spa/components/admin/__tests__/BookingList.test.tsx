import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import BookingList from '../BookingList';
import { bookingsApi } from '@/lib/api';
import type { Booking } from '@/types';

// Mock the API
jest.mock('@/lib/api', () => ({
  bookingsApi: {
    getAll: jest.fn(),
    updateStatus: jest.fn(),
  },
}));

const mockBookings: Booking[] = [
  {
    _id: '1',
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '555-0123',
    service: 'Swedish Massage',
    preferredDate: '2024-12-25T00:00:00.000Z',
    preferredTime: '14:00',
    status: 'pending',
    createdAt: '2024-12-01T00:00:00.000Z',
    updatedAt: '2024-12-01T00:00:00.000Z',
  },
  {
    _id: '2',
    customerName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-0456',
    service: 'Deep Tissue Massage',
    preferredDate: '2024-12-26T00:00:00.000Z',
    preferredTime: '10:00',
    status: 'confirmed',
    createdAt: '2024-12-02T00:00:00.000Z',
    updatedAt: '2024-12-02T00:00:00.000Z',
  },
];

describe('BookingList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state while fetching bookings', () => {
    (bookingsApi.getAll as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<BookingList />);

    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('renders bookings in table format', async () => {
    (bookingsApi.getAll as jest.Mock).mockResolvedValue(mockBookings);

    render(<BookingList />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('555-0123')).toBeInTheDocument();
      expect(screen.getByText('Swedish Massage')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Deep Tissue Massage')).toBeInTheDocument();
      expect(screen.getByText('confirmed')).toBeInTheDocument();
    });
  });

  it('displays empty state when no bookings exist', async () => {
    (bookingsApi.getAll as jest.Mock).mockResolvedValue([]);

    render(<BookingList />);

    await waitFor(() => {
      expect(screen.getByText('No bookings found')).toBeInTheDocument();
      expect(
        screen.getByText('Bookings will appear here once customers make reservations.')
      ).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch bookings';
    (bookingsApi.getAll as jest.Mock).mockRejectedValue({
      message: errorMessage,
      statusCode: 500,
    });

    render(<BookingList />);

    await waitFor(() => {
      expect(screen.getByText('Error loading bookings')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('allows retrying after error', async () => {
    (bookingsApi.getAll as jest.Mock)
      .mockRejectedValueOnce({
        message: 'Network error',
        statusCode: 500,
      })
      .mockResolvedValueOnce(mockBookings);

    render(<BookingList />);

    await waitFor(() => {
      expect(screen.getByText('Error loading bookings')).toBeInTheDocument();
    });

    const retryButton = screen.getByText('Try again');
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('updates booking status when action button is clicked', async () => {
    (bookingsApi.getAll as jest.Mock).mockResolvedValue(mockBookings);
    (bookingsApi.updateStatus as jest.Mock).mockResolvedValue({
      ...mockBookings[0],
      status: 'confirmed',
    });

    render(<BookingList />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(bookingsApi.updateStatus).toHaveBeenCalledWith('1', { status: 'confirmed' });
    });
  });

  it('displays loading state during status update', async () => {
    (bookingsApi.getAll as jest.Mock).mockResolvedValue(mockBookings);
    (bookingsApi.updateStatus as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<BookingList />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    expect(screen.getByText('Updating...')).toBeInTheDocument();
  });

  it('applies filters when provided', async () => {
    const filters = { status: 'pending' as const };
    (bookingsApi.getAll as jest.Mock).mockResolvedValue([mockBookings[0]]);

    render(<BookingList filters={filters} />);

    await waitFor(() => {
      expect(bookingsApi.getAll).toHaveBeenCalledWith(filters);
    });
  });

  it('calls onStatusUpdate callback after successful update', async () => {
    const onStatusUpdate = jest.fn();
    (bookingsApi.getAll as jest.Mock).mockResolvedValue(mockBookings);
    (bookingsApi.updateStatus as jest.Mock).mockResolvedValue({
      ...mockBookings[0],
      status: 'confirmed',
    });

    render(<BookingList onStatusUpdate={onStatusUpdate} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(onStatusUpdate).toHaveBeenCalled();
    });
  });

  it('displays appropriate action buttons based on booking status', async () => {
    (bookingsApi.getAll as jest.Mock).mockResolvedValue(mockBookings);

    render(<BookingList />);

    await waitFor(() => {
      // Pending booking should have Confirm and Cancel buttons
      const pendingRow = screen.getByText('John Doe').closest('tr');
      expect(pendingRow).toHaveTextContent('Confirm');
      expect(pendingRow).toHaveTextContent('Cancel');

      // Confirmed booking should have Complete and Cancel buttons
      const confirmedRow = screen.getByText('Jane Smith').closest('tr');
      expect(confirmedRow).toHaveTextContent('Complete');
      expect(confirmedRow).toHaveTextContent('Cancel');
    });
  });
});
