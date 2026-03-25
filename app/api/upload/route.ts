import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";

// --- Configuration de la Route ---
// Sur Vercel Free, la limite de taille du corps de la requête est de 4.5MB.
export const maxDuration = 60; 

// --- Constantes de Validation ---
const IMAGE_MAX_BYTES = 4.5 * 1024 * 1024; // Bridé à 4.5MB pour Vercel Free
const PDF_MAX_BYTES = 4.5 * 1024 * 1024;   

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ACCEPTED_PDF_TYPES = ["application/pdf"];

// Définition du type attendu par uploadFile pour éviter l'erreur TS
type AllowedFolders = "articles" | "events" | "gallery" | "team" | "publications";

// --- Zod schemas ---
const imageSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, { message: "Fichier invalide." })
    .refine((f) => f.size > 0, "Le fichier est vide.")
    .refine(
      (f) => f.size <= IMAGE_MAX_BYTES,
      "L'image est trop lourde (Max 4.5 MB sur Vercel Free)."
    )
    .refine(
      (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
      "Format non supporté (Uniquement JPEG, PNG, WebP ou GIF)."
    ),
});

const pdfSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, { message: "Document invalide." })
    .refine((f) => f.size > 0, "Le document est vide.")
    .refine(
      (f) => f.size <= PDF_MAX_BYTES,
      "Le PDF est trop lourd (Max 4.5 MB sur Vercel Free)."
    )
    .refine(
      (f) => ACCEPTED_PDF_TYPES.includes(f.type),
      "Seuls les documents PDF sont acceptés."
    ),
});

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé. Veuillez vous connecter." }, { status: 401 });
  }

  // 1. Vérification Header (Anticiper l'erreur 413)
  const contentLength = parseInt(request.headers.get("content-length") || "0");
  if (contentLength > 4.5 * 1024 * 1024) {
     return NextResponse.json(
      { error: "Le fichier dépasse la limite autorisée par Vercel (4.5 MB)." },
      { status: 413 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur lors de la lecture du formulaire." },
      { status: 400 }
    );
  }

  const rawFile = formData.get("file");
  const uploadType = formData.get("uploadType") || "image";
  const folder = (formData.get("folder") as string) || "gallery";

  // 2. Validation avec Zod
  const isPdf = uploadType === "pdf";
  const schema = isPdf ? pdfSchema : imageSchema;
  const validation = schema.safeParse({ file: rawFile });

  if (!validation.success) {
    const firstError = Object.values(validation.error.flatten().fieldErrors)[0]?.[0];
    return NextResponse.json(
      { error: firstError || "Échec de la validation." },
      { status: 400 }
    );
  }

  try {
    const file = validation.data.file;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Correction de l'erreur TS2345 (Le Type Casting)
    const targetFolder = (isPdf ? "publications" : folder) as AllowedFolders;

    const url = await uploadFile(
      buffer,
      file.name,
      file.type,
      targetFolder
    );

    return NextResponse.json({ 
      url, 
      success: true,
      message: "Fichier téléchargé avec succès." 
    }, { status: 200 });

  } catch (error: any) {
    console.error("[UPLOAD_ERROR]:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi vers le stockage." },
      { status: 500 }
    );
  }
}