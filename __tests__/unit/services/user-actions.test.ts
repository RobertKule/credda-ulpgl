import { createUser, deleteUser, bulkDeleteUsers, updateUserStatus, updateUserRole } from '@/services/user-actions';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sendApprovalNotification, sendRejectionNotification } from '@/services/mail-service';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/services/mail-service', () => ({
  sendApprovalNotification: jest.fn(),
  sendRejectionNotification: jest.fn(),
}));

describe('User Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user and revalidate path', async () => {
      const formData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'ADMIN'
      };
      
      (db.user.create as jest.Mock).mockResolvedValue({ id: '1' });
      
      const result = await createUser(formData);
      
      expect(db.user.create).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith("/admin/users", "layout");
      expect(result).toEqual({ success: true });
    });

    it('should handle errors if email already exists', async () => {
      (db.user.create as jest.Mock).mockRejectedValue(new Error('Unique constraint failed'));
      
      const result = await createUser({ email: 'duplicate@example.com', password: '123' });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe("Cet email est déjà utilisé");
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and revalidate path', async () => {
      (db.user.delete as jest.Mock).mockResolvedValue({ id: '1' });
      
      const result = await deleteUser('1');
      
      expect(db.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/users", "layout");
      expect(result).toEqual({ success: true });
    });
  });

  describe('bulkDeleteUsers', () => {
    it('should delete multiple users and revalidate path', async () => {
      (db.user.deleteMany as jest.Mock).mockResolvedValue({ count: 2 });
      
      const result = await bulkDeleteUsers(['1', '2']);
      
      expect(db.user.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: ['1', '2'] } }
      });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/users", "layout");
      expect(result).toEqual({ success: true });
    });
  });

  describe('updateUserStatus', () => {
    it('should update status to APPROVED and send notification', async () => {
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test' };
      (db.user.update as jest.Mock).mockResolvedValue(mockUser);
      
      const result = await updateUserStatus('1', 'APPROVED');
      
      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'APPROVED' }
      });
      expect(sendApprovalNotification).toHaveBeenCalledWith('test@example.com', 'Test');
      expect(result).toEqual({ success: true });
    });

    it('should update status to REJECTED and send notification', async () => {
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test' };
      (db.user.update as jest.Mock).mockResolvedValue(mockUser);
      
      const result = await updateUserStatus('1', 'REJECTED');
      
      expect(sendRejectionNotification).toHaveBeenCalledWith('test@example.com', 'Test');
      expect(result).toEqual({ success: true });
    });
  });

  describe('updateUserRole', () => {
    it('should update user role and revalidate path', async () => {
      (db.user.update as jest.Mock).mockResolvedValue({ id: '1', role: 'SUPER_ADMIN' });
      
      const result = await updateUserRole('1', 'SUPER_ADMIN');
      
      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { role: 'SUPER_ADMIN' }
      });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/users", "layout");
      expect(result).toEqual({ success: true });
    });
  });
});
