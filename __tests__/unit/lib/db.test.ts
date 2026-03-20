import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';

// Mock BEFORE importing db
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock('@neondatabase/serverless', () => {
  const mPool = {
    on: jest.fn(),
    end: jest.fn(),
  };
  return { 
    Pool: jest.fn(() => mPool),
    neonConfig: { webSocketConstructor: null }
  };
});

jest.mock('@prisma/adapter-neon', () => ({
  PrismaNeon: jest.fn(),
}));

jest.mock('ws', () => jest.fn());

// Now import db
import { db } from '@/lib/db';

describe('Database Singleton (db.ts)', () => {
  it('should initialize PrismaClient', () => {
    expect(PrismaClient).toHaveBeenCalled();
    expect(db).toBeDefined();
  });

  it('should have configured neonConfig', () => {
    expect(neonConfig.webSocketConstructor).toBeDefined();
  });

  it('should use connection pooling', () => {
    expect(Pool).toHaveBeenCalled();
  });
});
