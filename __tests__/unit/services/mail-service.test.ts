import { sendNewRequestAlert, sendApprovalNotification, sendRejectionNotification, sendContactNotification, sendReplyNotification } from '@/services/mail-service';
import { resend } from '@/lib/resend';

// Mock resend
jest.mock('@/lib/resend', () => ({
  resend: {
    emails: {
      send: jest.fn(),
    },
  },
}));

describe('Mail Service', () => {
  const mockFromEmail = "contact@credda-ulpgl.org";
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RESEND_FROM_EMAIL = mockFromEmail;
    process.env.NEXTAUTH_URL = "http://localhost:3000";
  });

  describe('sendNewRequestAlert', () => {
    it('should send an alert email to admin', async () => {
      (resend.emails.send as jest.Mock).mockResolvedValue({ data: { id: 'msg_123' }, error: null });
      
      const result = await sendNewRequestAlert('John Doe', 'john@example.com');
      
      expect(resend.emails.send).toHaveBeenCalledWith(expect.objectContaining({
        from: `CREDDA-ULPGL <${mockFromEmail}>`,
        to: [mockFromEmail],
        subject: expect.stringContaining("Nouvelle demande d'inscription"),
      }));
      expect(result).toEqual({ success: true });
    });

    it('should handle errors gracefully', async () => {
      (resend.emails.send as jest.Mock).mockRejectedValue(new Error('Resend error'));
      
      const result = await sendNewRequestAlert('John Doe', 'john@example.com');
      
      expect(result.success).toBe(false);
    });
  });

  describe('sendApprovalNotification', () => {
    it('should send an approval email to the user', async () => {
      (resend.emails.send as jest.Mock).mockResolvedValue({ data: { id: 'msg_456' }, error: null });
      
      const result = await sendApprovalNotification('john@example.com', 'John Doe');
      
      expect(resend.emails.send).toHaveBeenCalledWith(expect.objectContaining({
        to: ['john@example.com'],
        subject: expect.stringContaining("approuvé"),
      }));
      expect(result).toEqual({ success: true });
    });
  });

  describe('sendRejectionNotification', () => {
    it('should send a rejection email to the user', async () => {
      (resend.emails.send as jest.Mock).mockResolvedValue({ data: { id: 'msg_789' }, error: null });
      
      const result = await sendRejectionNotification('john@example.com', 'John Doe');
      
      expect(resend.emails.send).toHaveBeenCalledWith(expect.objectContaining({
        to: ['john@example.com'],
        subject: expect.stringContaining("demande d'inscription"),
      }));
      expect(result).toEqual({ success: true });
    });
  });

  describe('sendContactNotification', () => {
    it('should send a contact notification to admin', async () => {
      (resend.emails.send as jest.Mock).mockResolvedValue({ data: { id: 'msg_abc' }, error: null });
      
      const result = await sendContactNotification('John Doe', 'john@example.com', 'Hello!');
      
      expect(resend.emails.send).toHaveBeenCalledWith(expect.objectContaining({
        to: [mockFromEmail],
        subject: expect.stringContaining("Nouveau message"),
      }));
      expect(result).toEqual({ success: true });
    });
  });

  describe('sendReplyNotification', () => {
    it('should send a reply notification to the user', async () => {
      (resend.emails.send as jest.Mock).mockResolvedValue({ data: { id: 'msg_def' }, error: null });
      
      const result = await sendReplyNotification(
        'john@example.com', 
        'John Doe', 
        'Testing', 
        'This is a reply', 
        'Original message'
      );
      
      expect(resend.emails.send).toHaveBeenCalledWith(expect.objectContaining({
        to: ['john@example.com'],
        subject: "RE: Testing",
      }));
      expect(result).toEqual({ success: true });
    });
  });
});
