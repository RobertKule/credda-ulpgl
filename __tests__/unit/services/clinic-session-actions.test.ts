import { getAllClinicSessions, getUpcomingMobileClinics, createClinicSession, updateClinicSession, deleteClinicSession } from '@/services/clinic-session-actions';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    clinicSession: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Clinic Session Actions Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllClinicSessions', () => {
    it('should fetch all sessions ordered by date', async () => {
      const mockSessions = [{ id: 's1', date: new Date() }];
      (db.clinicSession.findMany as jest.Mock).mockResolvedValue(mockSessions);
      
      const result = await getAllClinicSessions();
      
      expect(db.clinicSession.findMany).toHaveBeenCalledWith({
        orderBy: { date: 'desc' }
      });
      expect(result.data).toEqual(mockSessions);
    });
  });

  describe('getUpcomingMobileClinics', () => {
    it('should fetch upcoming mobile clinics', async () => {
      (db.clinicSession.findMany as jest.Mock).mockResolvedValue([]);
      
      await getUpcomingMobileClinics();
      
      expect(db.clinicSession.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          isMobile: true,
          date: expect.any(Object)
        })
      }));
    });
  });

  describe('createClinicSession', () => {
    it('should create a session and revalidate paths', async () => {
      const data = { title: 'Test', location: 'Goma', date: '2026-04-01', isMobile: true };
      (db.clinicSession.create as jest.Mock).mockResolvedValue({ id: 's1' });
      
      const result = await createClinicSession(data);
      
      expect(db.clinicSession.create).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith("/admin/sessions");
      expect(revalidatePath).toHaveBeenCalledWith("/clinical/environmental/sessions");
      expect(result.success).toBe(true);
    });
  });

  describe('updateClinicSession', () => {
    it('should update session and revalidate', async () => {
      const data = { title: 'Updated' };
      (db.clinicSession.update as jest.Mock).mockResolvedValue({ id: 's1' });
      
      const result = await updateClinicSession('s1', data);
      
      expect(db.clinicSession.update).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith("/admin/sessions");
      expect(result.success).toBe(true);
    });
  });

  describe('deleteClinicSession', () => {
    it('should delete and revalidate', async () => {
      (db.clinicSession.delete as jest.Mock).mockResolvedValue({ id: 's1' });
      const result = await deleteClinicSession('s1');
      expect(db.clinicSession.delete).toHaveBeenCalledWith({ where: { id: 's1' } });
      expect(result.success).toBe(true);
    });
  });
});
