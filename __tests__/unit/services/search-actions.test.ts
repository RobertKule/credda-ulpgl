import { searchEverything } from '@/services/search-actions';
import { db } from '@/lib/db';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    article: { findMany: jest.fn() },
    publication: { findMany: jest.fn() },
    member: { findMany: jest.fn() },
  },
}));

describe('Search Actions Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty results for short queries', async () => {
    const result = await searchEverything('a', 'fr');
    expect(result).toEqual({ articles: [], publications: [], members: [] });
    expect(db.article.findMany).not.toHaveBeenCalled();
  });

  it('should perform search across multiple models', async () => {
    (db.article.findMany as jest.Mock).mockResolvedValue([{ id: 'a1' }]);
    (db.publication.findMany as jest.Mock).mockResolvedValue([{ id: 'p1' }]);
    (db.member.findMany as jest.Mock).mockResolvedValue([{ id: 'm1' }]);
    
    const result = await searchEverything('health', 'fr');
    
    expect(db.article.findMany).toHaveBeenCalled();
    expect(db.publication.findMany).toHaveBeenCalled();
    expect(db.member.findMany).toHaveBeenCalled();
    expect(result.articles).toHaveLength(1);
    expect(result.publications).toHaveLength(1);
    expect(result.members).toHaveLength(1);
  });

  it('should handle errors gracefully and return empty arrays', async () => {
    (db.article.findMany as jest.Mock).mockRejectedValue(new Error('DB Error'));
    
    const result = await searchEverything('error', 'fr');
    
    expect(result).toEqual({ articles: [], publications: [], members: [] });
  });
});
