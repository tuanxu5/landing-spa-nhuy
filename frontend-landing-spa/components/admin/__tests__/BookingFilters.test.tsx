import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import BookingFilters from '../BookingFilters';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('BookingFilters', () => {
  const mockPush = jest.fn();
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(() => null),
    });
  });

  it('renders all filter controls', () => {
    render(<BookingFilters onFilterChange={mockOnFilterChange} />);

    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Service')).toBeInTheDocument();
  });

  it('initializes filters from URL query parameters', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        const params: Record<string, string> = {
          status: 'pending',
          startDate: '2024-12-01',
          endDate: '2024-12-31',
          service: 'Massage',
        };
        return params[key] || null;
      },
    });

    render(<BookingFilters onFilterChange={mockOnFilterChange} />);

    expect(screen.getByLabelText('Status')).toHaveValue('pending');
    expect(screen.getByLabelText('Start Date')).toHaveValue('2024-12-01');
    expect(screen.getByLabelText('End Date')).toHaveValue('2024-12-31');
    expect(screen.getByLabelText('Service')).toHaveValue('Massage');
  });

  it('calls onFilterChange when status filter changes', async () => {
    render(<BookingFilters onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'confirmed' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        status: 'confirmed',
      });
    });
  });

  it('calls onFilterChange when date filters change', async () => {
    render(<BookingFilters onFilterChange={mockOnFilterChange} />);

    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '2024-12-01' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        startDate: '2024-12-01',
      });
    });

    const endDateInput = screen.getByLabelText('End Date');
    fireEvent.change(endDateInput, { target: { value: '2024-12-31' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        startDate: '2024-12-01',
        endDate: '2024-12-31',
      });
    });
  });

  it('calls onFilterChange when service filter changes', async () => {
    render(<BookingFilters onFilterChange={mockOnFilterChange} />);

    const serviceInput = screen.getByLabelText('Service');
    fireEvent.change(serviceInput, { target: { value: 'Swedish Massage' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        service: 'Swedish Massage',
      });
    });
  });

  it('updates URL when filters change', async () => {
    render(<BookingFilters onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'pending' } });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('?status=pending', { scroll: false });
    });
  });

  it('displays active filters summary', async () => {
    render(<BookingFilters onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'pending' } });

    await waitFor(() => {
      expect(screen.getByText('Status: pending')).toBeInTheDocument();
    });

    const serviceInput = screen.getByLabelText('Service');
    fireEvent.change(serviceInput, { target: { value: 'Massage' } });

    await waitFor(() => {
      expect(screen.getByText('Service: Massage')).toBeInTheDocument();
    });
  });

  it('clears all filters when Clear all button is clicked', async () => {
    render(<BookingFilters onFilterChange={mockOnFilterChange} />);

    // Set some filters
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'pending' } });

    await waitFor(() => {
      expect(screen.getByText('Clear all')).toBeInTheDocument();
    });

    const clearButton = screen.getByText('Clear all');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({});
      expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
    });
  });

  it('removes individual filter when × button is clicked', async () => {
    render(<BookingFilters onFilterChange={mockOnFilterChange} />);

    // Set status filter
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'pending' } });

    await waitFor(() => {
      expect(screen.getByText('Status: pending')).toBeInTheDocument();
    });

    // Find and click the × button in the status filter badge
    const statusBadge = screen.getByText('Status: pending').closest('span');
    const removeButton = statusBadge?.querySelector('button');
    
    if (removeButton) {
      fireEvent.click(removeButton);
    }

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({});
    });
  });

  it('combines multiple filters correctly', async () => {
    render(<BookingFilters onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'confirmed' } });

    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '2024-12-01' } });

    const serviceInput = screen.getByLabelText('Service');
    fireEvent.change(serviceInput, { target: { value: 'Massage' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        status: 'confirmed',
        startDate: '2024-12-01',
        service: 'Massage',
      });
    });
  });

  it('does not show Clear all button when no filters are active', () => {
    render(<BookingFilters onFilterChange={mockOnFilterChange} />);

    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
  });
});
