import { ContactMessage, ContactStatus } from "@prisma/client";

export { ContactStatus };
export type { ContactMessage };

export type ContactStats = {
  total: number;
  unread: number;
  read: number;
  archived: number;
  replied: number;
  responseRate: number;
};
