// app/[locale]/admin/gallery/[id]/edit/page.tsx
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditGalleryImagePage({ params }: Props) {
  const { id } = await params;
  
  const image = await db.galleryImage.findUnique({
    where: { id },
    include: { translations: true }
  });

  if (!image) {
    notFound();
  }

  async function updateImage(formData: FormData) {
    'use server';
    
    const src = formData.get('src') as string;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    
    await db.galleryImage.update({
      where: { id },
      data: { 
        src, 
        category,
        translations: {
          upsert: [
            {
              where: { galleryImageId_language: { galleryImageId: id, language: 'fr' } },
              update: { title, description: description || null },
              create: { language: 'fr', title, description: description || null }
            },
            {
              where: { galleryImageId_language: { galleryImageId: id, language: 'en' } },
              update: { title, description: description || null },
              create: { language: 'en', title, description: description || null }
            },
            {
              where: { galleryImageId_language: { galleryImageId: id, language: 'sw' } },
              update: { title, description: description || null },
              create: { language: 'sw', title, description: description || null }
            }
          ]
        }
      }
    });
    
    redirect('/admin/gallery');
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modifier l'image</h1>
      <form action={updateImage} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">URL de l'image</label>
          <input 
            name="src" 
            type="text" 
            defaultValue={image.src}
            required 
            className="w-full border p-2" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input 
            name="title" 
            type="text" 
            defaultValue={(image as any).translations?.[0]?.title || ''}
            required 
            className="w-full border p-2" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <input 
            name="category" 
            type="text" 
            defaultValue={image.category}
            required 
            className="w-full border p-2" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            name="description" 
            rows={3} 
            defaultValue={(image as any).translations?.[0]?.description || ''}
            className="w-full border p-2" 
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}