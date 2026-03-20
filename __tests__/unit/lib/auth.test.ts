// Mock everything that auth.ts imports to prevent network calls
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('next-auth/providers/credentials', () => ({
  __esModule: true,
  default: jest.fn((config: any) => ({
    id: 'credentials',
    name: config.name,
    credentials: config.credentials,
    authorize: config.authorize,
    type: 'credentials',
  })),
}));

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('@prisma/client', () => ({ PrismaClient: jest.fn() }));
jest.mock('@neondatabase/serverless', () => ({ Pool: jest.fn(), neonConfig: {} }));
jest.mock('@prisma/adapter-neon', () => ({ PrismaNeon: jest.fn() }));
jest.mock('ws', () => jest.fn());

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

describe('Auth Configuration (auth.ts)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authorize callback', () => {
    const getAuthorize = () => (authOptions.providers[0] as any).authorize;

    it('should allow master admin with correct email and password', async () => {
      const originalPassword = process.env.MASTER_ADMIN_PASSWORD;
      process.env.MASTER_ADMIN_PASSWORD = 'master_password';
      
      const user = await getAuthorize()({ email: 'masteradmin@credda.org', password: 'master_password' });
      
      expect(user).toBeDefined();
      expect(user?.role).toBe('SUPER_ADMIN');
      
      process.env.MASTER_ADMIN_PASSWORD = originalPassword;
    });

    it('should authorize valid user from database', async () => {
      const mockUser = {
        id: 'u1',
        email: 'user@example.com',
        password: 'hashed_password',
        name: 'User',
        role: 'USER',
        status: 'APPROVED',
      };
      
      (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      const user = await getAuthorize()({ email: 'user@example.com', password: 'password123' });
      
      expect(user).toEqual(expect.objectContaining({ id: 'u1', role: 'USER' }));
    });

    it('should throw for user not found', async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      await expect(getAuthorize()({ email: 'x@x.com', password: 'p' }))
        .rejects.toThrow('Email ou mot de passe incorrect');
    });

    it('should throw for PENDING status', async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1', status: 'PENDING', password: 'hash' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      await expect(getAuthorize()({ email: 'p@p.com', password: 'p' }))
        .rejects.toThrow("Votre compte est en attente d'approbation");
    });
  });

  describe('callbacks', () => {
    it('jwt callback should add custom fields to token', async () => {
      const token: any = { name: 'Test' };
      const user: any = { id: 'u1', role: 'ADMIN', image: 'avatar.png' };
      
      const result = await authOptions.callbacks!.jwt!({ token, user } as any);
      
      expect(result.id).toBe('u1');
      expect(result.role).toBe('ADMIN');
      expect(result.image).toBe('avatar.png');
    });

    it('session callback should propagate token data', async () => {
      const session: any = { user: {} };
      const token: any = { id: 'u1', role: 'ADMIN', image: 'avatar.png' };
      
      const result = await (authOptions.callbacks as any).session({ session, token });
      
      expect(result.user.id).toBe('u1');
      expect(result.user.role).toBe('ADMIN');
      expect(result.user.image).toBe('avatar.png');
    });
  });
});
