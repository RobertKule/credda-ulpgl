import { supabaseAdmin } from './supabase'

const BUCKET = 'credda-media'

// Create bucket if it doesn't exist (run once)
export async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets()
  const exists = buckets?.some(b => b.name === BUCKET)
  
  if (!exists) {
    const { error } = await supabaseAdmin.storage.createBucket(BUCKET, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
      fileSizeLimit: 20971520, // 20MB
    })
    
    if (error) {
       console.error(`❌ Failed to create bucket: ${error.message}`)
       return
    }
    console.log(`✅ Supabase Storage bucket '${BUCKET}' created`)
  }
}

// Upload a file — returns public URL
export async function uploadFile(
  file: Buffer | Blob,
  fileName: string,
  mimeType: string,
  folder: 'gallery' | 'team' | 'events' | 'articles' | 'publications' = 'gallery'
): Promise<string> {
  const path = `${folder}/${Date.now()}-${fileName.replace(/\s+/g, '-')}`

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: mimeType,
      upsert: false,
    })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// Delete a file by URL
export async function deleteFile(publicUrl: string): Promise<void> {
  const path = publicUrl.split(`/${BUCKET}/`)[1]
  if (!path) return

  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path])
  if (error) console.error('Delete failed:', error.message)
}
