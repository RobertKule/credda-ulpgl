// schemas/contact.ts
import { z } from "zod";
import { ContactStatus } from "@prisma/client";

export const contactStatusSchema = z.nativeEnum(ContactStatus);

export const sendContactMessageSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  subject: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Message trop court"),
});

export const replyToContactMessageSchema = z.object({
  id: z.string(),
  replyText: z.string().min(5, "La réponse est trop courte"),
});
