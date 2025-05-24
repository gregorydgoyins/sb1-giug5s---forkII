import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/utils';
import { NewsTicker } from './NewsTicker';
import { useNewsData } from '@/hooks/useNewsData';

// Mock the useNewsData hook
vi.mock('@/hooks/useNewsData');

describe('NewsTicker', () => {
  const mockNews = [
    {
      id: '1',
      title: 'Test News 1',
      impact: 'positive' as const,
      timestamp: new Date(),
      relatedSecurity: {
        type: 'comic' as const,
        symbol: 'TEST1',
        name: 'Test Comic #1'
      }
    },
    {
      id: '2',
      title: 'Test News 2',
      impact: 'negative' as const,
      timestamp: new Date(),
      relatedSecurity: {
        type: 'publisher' as const,
        symbol: 'TEST2',
        name: 'Test Publisher'
      }
    }
  ];

  it('renders loading state correctly', () => {
    (useNewsData as any).mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });

    render(<NewsTicker />);
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    (useNewsData as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load news')
    });

    render(<NewsTicker />);
    expect(screen.getByText(/Failed to load news/i)).toBeInTheDocument();
  });

  it('renders news items correctly', () => {
    (useNewsData as any).mockReturnValue({
      data: mockNews,
      isLoading: false,
      error: null
    });

    render(<NewsTicker />);
    expect(screen.getByText('Test News 1')).toBeInTheDocument();
    expect(screen.getByText('Test News 2')).toBeInTheDocument();
  });

  it('handles pause/play functionality', () => {
    (useNewsData as any).mockReturnValue({
      data: mockNews,
      isLoading: false,
      error: null
    });

    render(<NewsTicker />);
    
    const pauseButton = screen.getByLabelText('Pause news ticker');
    fireEvent.click(pauseButton);
    
    const playButton = screen.getByLabelText('Resume news ticker');
    expect(playButton).toBeInTheDocument();
  });

  it('handles speed changes', () => {
    (useNewsData as any).mockReturnValue({
      data: mockNews,
      isLoading: false,
      error: null
    });

    render(<NewsTicker />);
    
    const speedButton = screen.getByText('1x');
    fireEvent.click(speedButton);
    expect(screen.getByText('0.5x')).toBeInTheDocument();
  });
});