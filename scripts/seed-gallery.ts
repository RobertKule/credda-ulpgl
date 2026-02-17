// scripts/seed-gallery.ts
import 'dotenv/config'; // ✅ Charge automatiquement .env
import { db } from "../lib/db";

async function seedGallery() {
  console.log("🌱 Seeding gallery images...");
  console.log("📦 DATABASE_URL:", process.env.DATABASE_URL ? "✅ Trouvée" : "❌ Non trouvée");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL manquante. Vérifiez votre fichier .env");
    process.exit(1);
  }

  const images = [
    {
      src: "/images/gallery/conference.webp",
      title: "Conférence Internationale 2024",
      category: "Événement",
      description: "Chercheurs et partenaires réunis pour la conférence annuelle du CREDDA.",
      order: 1,
      featured: true
    },
    {
      src: "/images/gallery/clinic.webp",
      title: "Clinique Juridique Mobile",
      category: "Terrain",
      description: "Accompagnement des communautés à Rutshuru pour la sécurisation foncière.",
      order: 2,
      featured: true
    },
    {
      src: "/images/gallery/research.webp",
      title: "Atelier de Recherche",
      category: "Académique",
      description: "Séminaire méthodologique avec les doctorants sur les approches qualitatives.",
      order: 3,
      featured: false
    },
    {
      src: "/images/gallery/partners.webp",
      title: "Rencontre Partenaires",
      category: "Collaboration",
      description: "Signature de partenariat avec Northwestern University pour un programme de recherche conjoint.",
      order: 4,
      featured: true
    },
    {
      src: "/images/gallery/field.webp",
      title: "Mission Terrain",
      category: "Clinique",
      description: "Observation participante dans les communautés locales du Nord-Kivu.",
      order: 5,
      featured: false
    },
    {
      src: "/images/gallery/library.webp",
      title: "Bibliothèque",
      category: "Ressources",
      description: "Centre de documentation du CREDDA accessible aux chercheurs.",
      order: 6,
      featured: false
    },
    {
      src: "/images/gallery/workshop.webp",
      title: "Formation des Cliniciens",
      category: "Formation",
      description: "Atelier sur les droits fonciers et la médiation communautaire.",
      order: 7,
      featured: true
    },
    {
      src: "/images/gallery/signing.webp",
      title: "Signature de Convention",
      category: "Partenariat",
      description: "Avec le PNUD et la MONUSCO pour un projet de justice environnementale.",
      order: 8,
      featured: false
    }
  ];

  try {
    for (const image of images) {
      await db.galleryImage.create({
        data: image
      });
      console.log(`✅ Added: ${image.title}`);
    }
    console.log("🎉 Gallery seeding complete!");
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await db.$disconnect();
  }
}

seedGallery();