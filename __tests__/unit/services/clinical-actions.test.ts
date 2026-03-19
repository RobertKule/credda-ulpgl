import { submitClinicalCase, getCasesByPhone, getAllClinicalCases, getClinicalCaseById, updateClinicalCaseStatus, deleteClinicalCase, updateClinicalCase, addCaseNote } from '@/services/clinical-actions';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    beneficiary: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    clinicalCase: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    caseNote: {
      create: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Clinical Actions Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitClinicalCase', () => {
    const mockFormData = {
      name: 'Patient X',
      phone: '123456789',
      location: 'Goma',
      problemType: 'MALARIA',
      description: 'Severe fever',
      urgency: 'HIGH',
      incidentDate: '2026-03-10',
    };

    it('should create a new beneficiary and clinical case if beneficiary does not exist', async () => {
      (db.beneficiary.findFirst as jest.Mock).mockResolvedValue(null);
      (db.beneficiary.create as jest.Mock).mockResolvedValue({ id: 'ben_1' });
      (db.clinicalCase.create as jest.Mock).mockResolvedValue({ id: 'case_1', title: 'Cas: MALARIA - Goma' });
      
      const result = await submitClinicalCase(mockFormData);
      
      expect(db.beneficiary.create).toHaveBeenCalled();
      expect(db.clinicalCase.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          beneficiaryId: 'ben_1',
          urgency: 'HIGH',
        })
      }));
      expect(revalidatePath).toHaveBeenCalledWith("/admin/clinical");
      expect(result.success).toBe(true);
    });

    it('should use existing beneficiary if found by phone', async () => {
      (db.beneficiary.findFirst as jest.Mock).mockResolvedValue({ id: 'ben_existing' });
      (db.clinicalCase.create as jest.Mock).mockResolvedValue({ id: 'case_2' });
      
      await submitClinicalCase(mockFormData);
      
      expect(db.beneficiary.create).not.toHaveBeenCalled();
      expect(db.clinicalCase.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          beneficiaryId: 'ben_existing'
        })
      }));
    });

    it('should handle errors gracefully', async () => {
      (db.beneficiary.findFirst as jest.Mock).mockRejectedValue(new Error('DB Error'));
      
      const result = await submitClinicalCase(mockFormData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe("Erreur lors de la soumission du cas");
    });
  });

  describe('getCasesByPhone', () => {
    it('should return cases for a specific phone number', async () => {
      const mockCases = [{ id: 'c1' }, { id: 'c2' }];
      (db.clinicalCase.findMany as jest.Mock).mockResolvedValue(mockCases);
      
      const result = await getCasesByPhone('123456789');
      
      expect(db.clinicalCase.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { beneficiary: { phone: '123456789' } }
      }));
      expect(result.data).toEqual(mockCases);
    });
  });

  describe('getAllClinicalCases', () => {
    it('should return all cases with beneficiaries', async () => {
      (db.clinicalCase.findMany as jest.Mock).mockResolvedValue([{ id: '1' }]);
      const result = await getAllClinicalCases();
      expect(result.success).toBe(true);
      expect(db.clinicalCase.findMany).toHaveBeenCalledWith(expect.objectContaining({
        include: { beneficiary: true }
      }));
    });
  });

  describe('updateClinicalCaseStatus', () => {
    it('should update status and revalidate', async () => {
      (db.clinicalCase.update as jest.Mock).mockResolvedValue({ id: '1', status: 'IN_PROGRESS' });
      const result = await updateClinicalCaseStatus('1', 'IN_PROGRESS');
      expect(db.clinicalCase.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'IN_PROGRESS' }
      });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/clinical");
      expect(result.success).toBe(true);
    });
  });

  describe('deleteClinicalCase', () => {
    it('should delete case and revalidate', async () => {
      (db.clinicalCase.delete as jest.Mock).mockResolvedValue({ id: '1' });
      const result = await deleteClinicalCase('1');
      expect(db.clinicalCase.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result.success).toBe(true);
    });
  });

  describe('addCaseNote', () => {
    it('should add a note and revalidate case detail path', async () => {
      (db.caseNote.create as jest.Mock).mockResolvedValue({ id: 'n1' });
      const result = await addCaseNote('case_123', 'Important note', 'user_456');
      expect(db.caseNote.create).toHaveBeenCalledWith({
        data: {
          content: 'Important note',
          caseId: 'case_123',
          authorId: 'user_456'
        }
      });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/clinical/case_123");
      expect(result.success).toBe(true);
    });
  });
});
