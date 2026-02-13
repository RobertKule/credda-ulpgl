// app/[locale]/admin/gallery/new/page.tsx
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function NewGalleryImagePage() {
  async function createImage(formData: FormData) {
    'use server';
    
    const src = formData.get('src') as string;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    
    await db.galleryImage.create({
      data: {
        src,
        title,
        category,
        description,
        order: 0
      }
    });
    
    redirect('/admin/gallery');
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ajouter une image</h1>
      <form action={createImage} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">URL de l'image</label>
          <input name="src" type="text" required className="w-full border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input name="title" type="text" required className="w-full border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <input name="category" type="text" required className="w-full border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" rows={3} className="w-full border p-2" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Créer
        </button>
      </form>
    </div>
  );
}