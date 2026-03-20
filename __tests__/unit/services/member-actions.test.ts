import { createMember, deleteMember, updateMember } from '@/services/member-actions';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    member: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Member Actions Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMember', () => {
    it('should create a member and revalidate', async () => {
      const formData = {
        image: 'img.png',
        email: 'member@example.com',
        order: '1',
        translations: [{ name: 'Name', role: 'Role', language: 'fr' }]
      };
      
      (db.member.create as jest.Mock).mockResolvedValue({ id: 'm1' });
      
      const result = await createMember(formData);
      
      expect(db.member.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'member@example.com',
          order: 1,
        })
      });
      expect(revalidatePath).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should handle errors', async () => {
      (db.member.create as jest.Mock).mockRejectedValue(new Error('DB Error'));
      const result = await createMember({});
      expect(result.success).toBe(false);
    });
  });

  describe('deleteMember', () => {
    it('should delete and revalidate', async () => {
      (db.member.delete as jest.Mock).mockResolvedValue({ id: 'm1' });
      const result = await deleteMember('m1');
      expect(db.member.delete).toHaveBeenCalledWith({ where: { id: 'm1' } });
      expect(result.success).toBe(true);
    });
  });

  describe('updateMember', () => {
    it('should update and revalidate', async () => {
      const formData = {
        image: 'new.png',
        order: '2',
        translations: []
      };
      (db.member.update as jest.Mock).mockResolvedValue({ id: 'm1' });
      
      const result = await updateMember('m1', formData);
      
      expect(db.member.update).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });
});
