import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

// Mock Next.js NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, init })),
  },
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('errorResponse utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a standard 500 error response and logs as error', () => {
    const error = new Error('Database connection failed');
    const res: any = errorResponse('Custom server error', error, 500);

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        success: false,
        error: 'Custom server error',
        details: 'Database connection failed',
      },
      { status: 500 }
    );
    expect(logger.error).toHaveBeenCalled();
  });

  it('returns a 400 client error and logs as warn', () => {
    const res: any = errorResponse('Bad Request Details', null, 400, { customFields: true });

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        customFields: true,
        success: false,
        error: 'Bad Request Details',
        details: undefined,
      },
      { status: 400 }
    );
    expect(logger.warn).toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });
});
