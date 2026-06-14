export type MessageStatus = 'UNREAD' | 'READ' | 'ARCHIVED';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}
