import { getAllLegalResources, getLegalResourceBySlug, createLegalResource, updateLegalResource } from '@/services/resource-actions';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    legalResource: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    legalResourceTranslation: {
      upsert: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Resource Actions Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLegalResources', () => {
    it('should fetch published resources with translations', async () => {
      const mockResources = [{ id: 'r1', slug: 's1' }];
      (db.legalResource.findMany as jest.Mock).mockResolvedValue(mockResources);
      
      const result = await getAllLegalResources('fr');
      
      expect(db.legalResource.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { published: true },
        include: { translations: { where: { language: 'fr' } } }
      }));
      expect(result.data).toEqual(mockResources);
    });
  });

  describe('getLegalResourceBySlug', () => {
    it('should fetch a single resource by slug', async () => {
      const mockResource = { id: 'r1', slug: 's1' };
      (db.legalResource.findUnique as jest.Mock).mockResolvedValue(mockResource);
      
      const result = await getLegalResourceBySlug('s1', 'fr');
      
      expect(db.legalResource.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { slug: 's1' }
      }));
      expect(result.data).toEqual(mockResource);
    });
  });

  describe('createLegalResource', () => {
    it('should create a resource and revalidate', async () => {
      const data = { slug: 'new-res', category: 'LAW', translations: [] };
      (db.legalResource.create as jest.Mock).mockResolvedValue({ id: 'r1' });
      
      const result = await createLegalResource(data);
      
      expect(db.legalResource.create).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith("/admin/resources");
      expect(result.success).toBe(true);
    });
  });

  describe('updateLegalResource', () => {
    it('should update resource and upsert translations', async () => {
      const data = {
        slug: 'updated',
        category: 'LAW',
        published: true,
        translations: [{ id: 't1', title: 'New', language: 'fr' }]
      };
      (db.legalResource.update as jest.Mock).mockResolvedValue({ id: 'r1' });
      (db.legalResourceTranslation.upsert as jest.Mock).mockResolvedValue({ id: 't1' });
      
      const result = await updateLegalResource('r1', data);
      
      expect(db.legalResource.update).toHaveBeenCalled();
      expect(db.legalResourceTranslation.upsert).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith("/admin/resources");
      expect(result.success).toBe(true);
    });
  });
});
