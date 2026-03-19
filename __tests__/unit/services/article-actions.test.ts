import { createArticle, updateArticle, deleteArticle, toggleArticleStatus } from '@/services/article-actions';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    article: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// We don't need to mock withSafeAction specifically if it just executes the function,
// but let's check lib/safe-action.ts to be sure.
// If it adds complex logic, we might need a mock.

describe('Article Actions Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createArticle', () => {
    it('should create an article if slug is unique', async () => {
      const formData = {
        slug: 'new-article',
        domain: 'RESEARCH',
        translations: [{ title: 'Title', content: 'Content', language: 'fr' }]
      };
      
      (db.article.findUnique as jest.Mock).mockResolvedValue(null);
      (db.article.create as jest.Mock).mockResolvedValue({ id: 'a1' });
      
      const result = await createArticle(formData);
      
      expect(db.article.create).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should fail if slug already exists', async () => {
      (db.article.findUnique as jest.Mock).mockResolvedValue({ id: 'existing' });
      
      const result = await createArticle({ slug: 'existing' });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe("Erreur lors de la création de l'article");
    });
  });

  describe('updateArticle', () => {
    it('should update and revalidate', async () => {
      const data = { id: 'a1', slug: 'updated-slug', translations: [] };
      (db.article.update as jest.Mock).mockResolvedValue({ id: 'a1' });
      
      const result = await updateArticle(data);
      
      expect(db.article.update).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('toggleArticleStatus', () => {
    it('should flip published status', async () => {
      (db.article.update as jest.Mock).mockResolvedValue({ id: 'a1', published: false });
      
      const result = await toggleArticleStatus('a1', true);
      
      expect(db.article.update).toHaveBeenCalledWith({
        where: { id: 'a1' },
        data: { published: false }
      });
      expect(result.success).toBe(true);
    });
  });

  describe('deleteArticle', () => {
    it('should delete and revalidate', async () => {
      (db.article.delete as jest.Mock).mockResolvedValue({ id: 'a1' });
      
      const result = await deleteArticle('a1');
      
      expect(db.article.delete).toHaveBeenCalledWith({ where: { id: 'a1' } });
      expect(result.success).toBe(true);
    });
  });
});
