import { getFeaturedGalleryImages, getAllGalleryImages, getGalleryImageById, incrementImageView } from '@/services/gallery-actions';
import { db } from '@/lib/db';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    galleryImage: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('Gallery Actions Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFeaturedGalleryImages', () => {
    it('should fetch featured images ordered by order', async () => {
      const mockImages = [{ id: 'i1', featured: true }];
      (db.galleryImage.findMany as jest.Mock).mockResolvedValue(mockImages);
      
      const result = await getFeaturedGalleryImages(10);
      
      expect(db.galleryImage.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { featured: true },
          take: 10,
          include: { translations: { where: { language: "fr" } } }
        })
      );
      expect(result).toEqual(mockImages);
    });

    it('should return empty array on error', async () => {
      (db.galleryImage.findMany as jest.Mock).mockRejectedValue(new Error('DB Error'));
      const result = await getFeaturedGalleryImages();
      expect(result).toEqual([]);
    });
  });

  describe('getAllGalleryImages', () => {
    it('should fetch all images with specific ordering', async () => {
      (db.galleryImage.findMany as jest.Mock).mockResolvedValue([]);
      await getAllGalleryImages();
      expect(db.galleryImage.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: expect.any(Array),
          include: { translations: true }
        })
      );
    });
  });

  describe('getGalleryImageById', () => {
    it('should fetch a single image by id', async () => {
      const mockImg = { id: 'im1' };
      (db.galleryImage.findUnique as jest.Mock).mockResolvedValue(mockImg);
      const result = await getGalleryImageById('im1');
      expect(db.galleryImage.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "im1" },
          include: { translations: true }
        })
      );
      expect(result).toEqual(mockImg);
    });
  });

  describe('incrementImageView', () => {
    it('should return true (current implementation is placeholder)', async () => {
      const result = await incrementImageView('im1');
      expect(result).toBe(true);
    });
  });
});
