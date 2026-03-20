import { getPublicationsByDomain, createPublication, deletePublication, updatePublication } from '@/services/publication-actions';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    publication: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Publication Actions Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPublicationsByDomain', () => {
    it('should fetch publications with translations for a specific domain', async () => {
      const mockPubs = [{ id: '1', slug: 'test' }];
      (db.publication.findMany as jest.Mock).mockResolvedValue(mockPubs);
      
      const result = await getPublicationsByDomain('RESEARCH', 'fr');
      
      expect(db.publication.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { domain: 'RESEARCH' },
        include: {
          translations: { where: { language: 'fr' } }
        }
      }));
      expect(result.data).toEqual(mockPubs);
    });
  });

  describe('createPublication', () => {
    it('should create a publication and revalidate', async () => {
      const data = {
        slug: 'new-pub',
        year: '2026',
        pdfUrl: 'url',
        translations: [{ title: 'Title', language: 'fr' }]
      };
      (db.publication.create as jest.Mock).mockResolvedValue({ id: 'p1' });
      
      const result = await createPublication(data);
      
      expect(db.publication.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: 'new-pub',
          year: 2026,
        })
      });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/publications");
      expect(result.success).toBe(true);
    });
  });

  describe('updatePublication', () => {
    it('should update and revalidate', async () => {
      const data = {
        slug: 'updated',
        year: '2025',
        translations: []
      };
      (db.publication.update as jest.Mock).mockResolvedValue({ id: '1' });
      
      const result = await updatePublication('1', data);
      
      expect(db.publication.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining({
          slug: 'updated',
          year: 2025,
        })
      });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/publications");
      expect(result.success).toBe(true);
    });
  });

  describe('deletePublication', () => {
    it('should delete and revalidate', async () => {
      (db.publication.delete as jest.Mock).mockResolvedValue({ id: '1' });
      const result = await deletePublication('1');
      expect(db.publication.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/publications");
      expect(result.success).toBe(true);
    });
  });
});
