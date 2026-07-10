import { describe, it, expect, vi } from 'vitest';
import {
  cn,
  formatDate,
  formatCurrency,
  formatNumber,
  slugify,
  truncate,
  debounce,
  getInitials,
  capitalize,
} from '@/lib/utils';

describe('cn (className merger)', () => {
  it('merges class names', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'extra');
    expect(result).toBe('base extra');
  });

  it('handles undefined and null', () => {
    const result = cn('base', undefined, null);
    expect(result).toBe('base');
  });
});

describe('formatDate', () => {
  it('formats a Date object', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toBe('Jan 15, 2024');
  });

  it('formats a date string', () => {
    const result = formatDate('2024-12-25');
    expect(result).toBe('Dec 25, 2024');
  });
});

describe('formatCurrency', () => {
  it('formats USD currency', () => {
    const result = formatCurrency(1234.56);
    expect(result).toBe('$1,234.56');
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toBe('$0.00');
  });

  it('formats negative amounts', () => {
    const result = formatCurrency(-50.25);
    expect(result).toBe('-$50.25');
  });
});

describe('formatNumber', () => {
  it('formats large numbers', () => {
    const result = formatNumber(1234567);
    expect(result).toBe('1,234,567');
  });

  it('formats zero', () => {
    const result = formatNumber(0);
    expect(result).toBe('0');
  });
});

describe('slugify', () => {
  it('converts text to slug', () => {
    const result = slugify('Hello World');
    expect(result).toBe('hello-world');
  });

  it('removes special characters', () => {
    const result = slugify('Hello! @World#');
    expect(result).toBe('hello-world');
  });

  it('handles multiple spaces', () => {
    const result = slugify('Hello   World');
    expect(result).toBe('hello-world');
  });
});

describe('truncate', () => {
  it('truncates long strings', () => {
    const result = truncate('Hello World, this is a long string', 10);
    expect(result).toBe('Hello Worl...');
  });

  it('returns original string if shorter', () => {
    const result = truncate('Hello', 10);
    expect(result).toBe('Hello');
  });

  it('returns original string if exact length', () => {
    const result = truncate('Hello', 5);
    expect(result).toBe('Hello');
  });
});

describe('debounce', () => {
  it('delays function execution', async () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('cancels previous calls', async () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

describe('getInitials', () => {
  it('gets initials from full name', () => {
    const result = getInitials('John Smith');
    expect(result).toBe('JS');
  });

  it('gets single initial', () => {
    const result = getInitials('John');
    expect(result).toBe('J');
  });

  it('limits to 2 characters', () => {
    const result = getInitials('John Michael Smith');
    expect(result).toBe('JM');
  });

  it('handles lowercase names', () => {
    const result = getInitials('john smith');
    expect(result).toBe('JS');
  });
});

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    const result = capitalize('hello');
    expect(result).toBe('Hello');
  });

  it('lowercases rest of string', () => {
    const result = capitalize('hELLO');
    expect(result).toBe('Hello');
  });

  it('handles single character', () => {
    const result = capitalize('a');
    expect(result).toBe('A');
  });
});
