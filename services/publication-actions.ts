"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import slugify from 'slugify'; // ✅ À installer

// Fonction utilitaire pour générer un slug unique
async function generateUniqueSlug(title: string): Promise<string> {
  let slug = slugify(title, { lower: true, strict: true });
  let uniqueSlug = slug;
  let counter = 1;
  
  // Vérifier si le slug existe déjà
  while (await db.publication.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
}

export async function createPublication(formData: any) {
  try {
    // ✅ Générer un slug à partir du titre (première traduction)
    const title = formData.translations?.[0]?.title || 'publication';
    const slug = await generateUniqueSlug(title);
    
    await db.publication.create({
      data: {
        slug, // ✅ Champ requis AJOUTÉ
        year: parseInt(formData.year),
        doi: formData.doi,
        pdfUrl: formData.pdfUrl,
        domain: formData.domain,
        translations: { create: formData.translations }
      }
    });
    revalidatePath("/[locale]/admin/publications", "layout");
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur création publication:", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}

export async function deletePublication(id: string) {
  try {
    await db.publication.delete({ where: { id } });
    revalidatePath("/[locale]/admin/publications", "layout");
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur suppression:", error);
    return { success: false };
  }
}

export async function updatePublication(id: string, formData: any) {
  try {
    // ✅ Pour la mise à jour, le slug peut rester inchangé
    // Mais si le titre change, on peut vouloir le mettre à jour
    const updateData: any = {
      year: parseInt(formData.year),
      doi: formData.doi,
      pdfUrl: formData.pdfUrl,
      domain: formData.domain,
      translations: {
        deleteMany: {},
        create: formData.translations
      }
    };
    
    // Optionnel: mettre à jour le slug si le titre change
    if (formData.updateSlug) {
      const title = formData.translations?.[0]?.title;
      if (title) {
        updateData.slug = await generateUniqueSlug(title);
      }
    }
    
    await db.publication.update({
      where: { id },
      data: updateData
    });
    revalidatePath("/[locale]/admin/publications", "layout");
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur mise à jour:", error);
    return { success: false };
  }
}