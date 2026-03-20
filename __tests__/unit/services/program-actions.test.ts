import { createProgram, deleteProgram, updateProgram, toggleProgramPublished, toggleProgramFeatured } from '@/services/program-actions';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    program: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Program Actions Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProgram', () => {
    it('should create a program and revalidate', async () => {
      const data = {
        slug: 'test-prog',
        published: true,
        translations: [{ title: 'Title', language: 'fr' }]
      };
      (db.program.create as jest.Mock).mockResolvedValue({ id: 'p1' });
      
      const result = await createProgram(data);
      
      expect(db.program.create).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('updateProgram', () => {
    it('should update and revalidate', async () => {
      const data = { id: 'p1', slug: 'updated-prog' };
      (db.program.update as jest.Mock).mockResolvedValue({ id: 'p1' });
      
      const result = await updateProgram(data);
      
      expect(db.program.update).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('toggleProgramPublished', () => {
    it('should update published status', async () => {
      (db.program.update as jest.Mock).mockResolvedValue({ id: 'p1', published: true });
      await toggleProgramPublished('p1', true);
      expect(db.program.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { published: true }
      });
    });
  });

  describe('toggleProgramFeatured', () => {
    it('should update featured status', async () => {
      (db.program.update as jest.Mock).mockResolvedValue({ id: 'p1', featured: true });
      await toggleProgramFeatured('p1', true);
      expect(db.program.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { featured: true }
      });
    });
  });

  describe('deleteProgram', () => {
    it('should delete and revalidate', async () => {
      (db.program.delete as jest.Mock).mockResolvedValue({ id: 'p1' });
      const result = await deleteProgram('p1');
      expect(db.program.delete).toHaveBeenCalledWith({ where: { id: 'p1' } });
      expect(result.success).toBe(true);
    });
  });
});
