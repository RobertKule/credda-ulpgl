import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import { db } from '@/lib/db'

jest.mock('@/lib/db', () => ({
  __esModule: true,
  db: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>
