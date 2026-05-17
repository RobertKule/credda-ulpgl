import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db'; // Will be mocked by global setup
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rate-limit';

// Global mocks
vi.mock('bcryptjs');

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(),
  resetRateLimit: vi.fn()
}));

const mockDb = db as any;

describe('Authentication Credentials Provider', () => {
  const credentialsProvider: any = authOptions.providers[0];
  
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('rejects login if rate limit throws', async () => {
    (rateLimit as any).mockResolvedValue({ success: false });
    const res = await credentialsProvider.authorize({ email: 'test@mail.com', password: 'pas' });
    expect(res).toBeNull();
  });

  it('rejects if user does not exist', async () => {
    (rateLimit as any).mockResolvedValue({ success: true });
    mockDb.user.findUnique.mockResolvedValue(null);
    const res = await credentialsProvider.authorize({ email: 'test@mail.com', password: 'pas' });
    expect(res).toBeNull();
  });

  it('rejects if password does not match', async () => {
    (rateLimit as any).mockResolvedValue({ success: true });
    mockDb.user.findUnique.mockResolvedValue({ status: 'APPROVED', password: 'hash' });
    (bcrypt.compare as any).mockResolvedValue(false);
    const res = await credentialsProvider.authorize({ email: 'test@mail.com', password: 'pas' });
    expect(res).toBeNull();
  });

  it('rejects if account is PENDING', async () => {
    (rateLimit as any).mockResolvedValue({ success: true });
    mockDb.user.findUnique.mockResolvedValue({ status: 'PENDING', password: 'hash' });
    const res = await credentialsProvider.authorize({ email: 'test@mail.com', password: 'pas' });
    expect(res).toBeNull();
  });

});
