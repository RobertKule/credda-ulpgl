import { sendContactMessage, replyToContactMessage, markMessageAsRead, archiveMessage, getAllMessages, getMessageStats } from '@/services/contact-actions';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sendContactNotification, sendReplyNotification } from '@/services/mail-service';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    contactMessage: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/services/mail-service', () => ({
  sendContactNotification: jest.fn(),
  sendReplyNotification: jest.fn(),
}));

describe('Contact Actions Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendContactMessage', () => {
    it('should create a message and send notification', async () => {
      const mockData = { name: 'Alice', email: 'alice@example.com', subject: 'Hi', message: 'Hello' };
      (db.contactMessage.create as jest.Mock).mockResolvedValue({ id: 'm1' });
      (sendContactNotification as jest.Mock).mockResolvedValue({ success: true });

      const result = await sendContactMessage(mockData);

      expect(db.contactMessage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Alice',
          status: 'UNREAD',
        })
      });
      expect(sendContactNotification).toHaveBeenCalledWith('Alice', 'alice@example.com', 'Hello');
      expect(revalidatePath).toHaveBeenCalledWith("/admin/messages");
      expect(result.success).toBe(true);
    });
  });

  describe('replyToContactMessage', () => {
    it('should send a reply and update message status', async () => {
      const mockMsg = { id: 'm1', email: 'alice@example.com', name: 'Alice', subject: 'Hi', message: 'Hello' };
      (db.contactMessage.findUnique as jest.Mock).mockResolvedValue(mockMsg);
      (sendReplyNotification as jest.Mock).mockResolvedValue({ success: true });
      (db.contactMessage.update as jest.Mock).mockResolvedValue({ id: 'm1', status: 'READ' });

      const result = await replyToContactMessage('m1', 'Response text');

      expect(sendReplyNotification).toHaveBeenCalledWith('alice@example.com', 'Alice', 'Hi', 'Response text', 'Hello');
      expect(db.contactMessage.update).toHaveBeenCalledWith({
        where: { id: 'm1' },
        data: expect.objectContaining({
          status: 'READ',
          replyContent: 'Response text',
        })
      });
      expect(result.success).toBe(true);
    });

    it('should fail if message not found', async () => {
      (db.contactMessage.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await replyToContactMessage('invalid', 'text');
      expect(result.success).toBe(false);
      expect(result.error).toBe("Message non trouvé");
    });
  });

  describe('markMessageAsRead', () => {
    it('should update status to READ', async () => {
      (db.contactMessage.update as jest.Mock).mockResolvedValue({ id: '1' });
      await markMessageAsRead('1');
      expect(db.contactMessage.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'READ' }
      });
    });
  });

  describe('archiveMessage', () => {
    it('should update status to ARCHIVED', async () => {
      (db.contactMessage.update as jest.Mock).mockResolvedValue({ id: '1' });
      await archiveMessage('1');
      expect(db.contactMessage.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'ARCHIVED' }
      });
    });
  });

  describe('getMessageStats', () => {
    it('should return counts and response rate', async () => {
      (db.contactMessage.count as jest.Mock)
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(2)  // unread
        .mockResolvedValueOnce(5)  // read
        .mockResolvedValueOnce(3)  // archived
        .mockResolvedValueOnce(4); // replied

      const result = await getMessageStats();

      expect(result.data).toEqual({
        total: 10,
        unread: 2,
        read: 5,
        archived: 3,
        replied: 4,
        responseRate: 40
      });
    });
  });
});
