// lib/storage.ts
import { supabaseAdmin } from './supabase'

const BUCKET = 'credda-media'

/**
 * Nettoie le nom de fichier pour éviter les erreurs "Invalid Key" de Supabase
 * Gère les accents, espaces et caractères spéciaux.
 */
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .normalize("NFD")                  // Décompose les caractères accentués (ex: 'à' -> 'a' + '`')
    .replace(/[\u0300-\u036f]/g, "")   // Supprime les accents restants
    .replace(/[^a-zA-Z0-9.-]/g, "-")   // Remplace tout sauf lettres, chiffres, points et tirets par "-"
    .replace(/-+/g, "-")               // Remplace les doubles tirets "--" par un seul "-"
    .replace(/^-+|-+$/g, "")           // Supprime les tirets au début ou à la fin
    .toLowerCase();                    // Force la minuscule pour éviter les soucis de casse
}

/**
 * Upload un fichier et retourne son URL publique.
 * Note : Le bucket 'credda-media' doit avoir été créé manuellement sur Supabase.
 */
export async function uploadFile(
  file: Buffer | Blob,
  fileName: string,
  mimeType: string,
  folder: 'gallery' | 'team' | 'events' | 'articles' | 'publications' = 'gallery'
): Promise<string> {
  
  // Nettoyage du nom pour éviter l'erreur "Invalid Key"
  const cleanName = sanitizeFileName(fileName);
  
  // Construction du chemin : dossier/timestamp-nom-nettoye.extension
  const path = `${folder}/${Date.now()}-${cleanName}`;

  // Upload via le client Admin (Service Role)
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: mimeType,
      upsert: false, // Empêche l'écrasement accidentel
    });

  if (error) {
    console.error(`[STORAGE_UPLOAD_ERROR]: ${error.message}`);
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Récupération de l'URL publique
  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  
  return data.publicUrl;
}

/**
 * Supprime un fichier à partir de son URL publique
 */
export async function deleteFile(publicUrl: string): Promise<void> {
  try {
    // Extrait le chemin après le nom du bucket dans l'URL
    // Exemple : https://.../credda-media/gallery/image.jpg -> gallery/image.jpg
    const parts = publicUrl.split(`/${BUCKET}/`);
    if (parts.length < 2) return;
    
    const path = parts[1];

    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);
    
    if (error) throw error;
    
    console.log(`✅ File deleted from storage: ${path}`);
  } catch (error: any) {
    console.error('❌ Delete from storage failed:', error.message);
  }
}