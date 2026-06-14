"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getMessages() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: messages };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, error: "Failed to fetch messages" };
  }
}

export async function getMessage(id: string) {
  try {
    const message = await db.contactMessage.findUnique({
      where: { id },
    });
    if (!message) {
      return { success: false, error: "Message not found" };
    }
    return { success: true, data: message };
  } catch (error) {
    console.error("Error fetching message:", error);
    return { success: false, error: "Failed to fetch message" };
  }
}

export async function updateMessageStatus(id: string, status: string) {
  try {
    await db.contactMessage.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Error updating message status:", error);
    return { success: false, error: "Failed to update message status" };
  }
}

export async function archiveMessage(id: string) {
  try {
    await db.contactMessage.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Error archiving message:", error);
    return { success: false, error: "Failed to archive message" };
  }
}

export async function getUnreadCount() {
  try {
    const count = await db.contactMessage.count({
      where: { status: "UNREAD" },
    });
    return { success: true, data: count };
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return { success: false, error: "Failed to fetch unread count" };
  }
}
