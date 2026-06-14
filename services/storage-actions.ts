"use server";

import { uploadFile as uploadToSupabase } from "@/lib/storage";

export async function uploadFileAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) return { error: "Aucun fichier sélectionné" };

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadToSupabase(buffer, file.name, file.type, "gallery");
    return { url };
  } catch (error: any) {
    return { error: error.message };
  }
}
