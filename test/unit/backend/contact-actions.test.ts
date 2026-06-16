import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendContactMessage, markMessageAsRead } from '@/services/contact-actions';
import { db } from '@/lib/db';
import { ContactStatus } from '@/types/contact';

const mockDb = db as unknown as Record<string, { create: ReturnType<typeof vi.fn> }>;

// Mock the email notification to avoid sending actual emails locally
vi.mock('@/services/mail-service', () => ({
  sendContactNotification: vi.fn().mockResolvedValue(true),
  sendReplyNotification: vi.fn(),
}));

describe('Contact Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fails safely if zod parsing rejects contact payload', async () => {
    const res = await sendContactMessage({ email: 'invalid' });
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Erreur/i);
  });

  it('creates a new message successfully', async () => {
    mockDb.contactMessage.create.mockResolvedValueOnce({ id: 'msg1' });
    
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello World, I need help.',
      subject: 'Question'
    };

    const res = await sendContactMessage(validData);
    
    expect(res.success).toBe(true);
    expect((res as unknown as { data: { id: string } }).data.id).toBe('msg1');
    expect(mockDb.contactMessage.create).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello World, I need help.',
        subject: 'Question',
        status: ContactStatus.UNREAD
      }
    });
  });

  it('marks a message as read', async () => {
    mockDb.contactMessage.update.mockResolvedValueOnce({ id: 'msg1', status: ContactStatus.READ });
    
    const res = await markMessageAsRead('msg1');
    
    expect(res.success).toBe(true);
    expect(mockDb.contactMessage.update).toHaveBeenCalledWith({
      where: { id: 'msg1' },
      data: { status: ContactStatus.READ }
    });
  });
});
