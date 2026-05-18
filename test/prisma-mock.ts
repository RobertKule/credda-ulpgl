import { vi } from 'vitest';

// Basic Prisma Mock Configuration
// This is automatically injected via module aliases or manually imported in specific tests
export const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  contactMessage: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  // Add other models as they become necessary for unit testing
};

vi.mock('@/lib/db', () => ({
  db: mockPrisma,
  sql: vi.fn(),
}));
