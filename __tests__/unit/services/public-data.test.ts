import { getArticlesByDomain } from '@/services/public-data';
import { db } from '@/lib/db';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    article: { findMany: jest.fn() },
  },
}));

describe('Public Data Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getArticlesByDomain', () => {
    it('should fetch published articles for a domain with pagination', async () => {
      const mockArticles = [
        { id: 'a1', slug: 's1' },
        { id: 'a2', slug: 's2' }
      ];
      (db.article.findMany as jest.Mock).mockResolvedValue(mockArticles);
      
      const result = await getArticlesByDomain('RESEARCH', 'fr', 1);
      
      expect(db.article.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { domain: 'RESEARCH', published: true },
        take: 2 // limit + 1
      }));
      expect(result.data).toHaveLength(1);
      expect(result.nextCursor).toBe('a2');
    });

    it('should return empty data on error', async () => {
      (db.article.findMany as jest.Mock).mockRejectedValue(new Error('DB Error'));
      const result = await getArticlesByDomain('RESEARCH', 'fr');
      expect(result.data).toEqual([]);
      expect(result.nextCursor).toBeUndefined();
    });
  });
});
