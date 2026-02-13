import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient, Role, Domain, MediaType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("🧹 Nettoyage de la base...")

  await prisma.media.deleteMany()
  await prisma.articleTranslation.deleteMany()
  await prisma.article.deleteMany()
  await prisma.categoryTranslation.deleteMany()
  await prisma.category.deleteMany()
  await prisma.publicationTranslation.deleteMany()
  await prisma.publication.deleteMany()
  await prisma.memberTranslation.deleteMany()
  await prisma.member.deleteMany()
  await prisma.user.deleteMany()

  console.log("🌱 Début du seeding...")

  // ================================
  // 👤 ADMIN
  // ================================

  const hashedPassword = await bcrypt.hash("Admin@Credda2024", 10)

  await prisma.user.create({
    data: {
      email: "admin@credda-ulpgl.org",
      name: "Direction CREDDA",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  // ================================
  // 📂 CATÉGORIES
  // ================================

  const governance = await prisma.category.create({
    data: {
      slug: "gouvernance",
      translations: {
        create: [
          { language: "fr", name: "Gouvernance" },
          { language: "en", name: "Governance" },
          { language: "sw", name: "Utawala" },
        ],
      },
    },
  })

  const environment = await prisma.category.create({
    data: {
      slug: "environnement",
      translations: {
        create: [
          { language: "fr", name: "Environnement" },
          { language: "en", name: "Environment" },
          { language: "sw", name: "Mazingira" },
        ],
      },
    },
  })

  // ================================
  // 📰 ARTICLES RESEARCH
  // ================================

  for (let i = 1; i <= 3; i++) {
    const article = await prisma.article.create({
      data: {
        slug: `rapport-recherche-${i}`,
        domain: Domain.RESEARCH,
        published: true,
        featured: i === 1,
        categoryId: governance.id,
        mainImage: "/images/director3.webp",
        translations: {
          create: [
            {
              language: "fr",
              title: `Rapport Scientifique Vol.${i}`,
              excerpt: `Résumé analytique du rapport ${i}.`,
              content: `Contenu scientifique détaillé du rapport ${i} concernant la gouvernance et la démocratie en RDC.`,
            },
            {
              language: "en",
              title: `Scientific Report Vol.${i}`,
              excerpt: `Analytical summary of report ${i}.`,
              content: `Detailed scientific content of report ${i} related to governance and democracy.`,
            },
          ],
        },
      },
    })

    // Médias annexes
    await prisma.media.create({
      data: {
        type: MediaType.DOCUMENT,
        url: "/docs/annexe.pdf",
        title: "Annexe PDF",
        articleId: article.id,
      },
    })
  }

  // ================================
  // 🏥 ARTICLE CLINICAL
  // ================================

  await prisma.article.create({
    data: {
      slug: "assistance-juridique-goma",
      domain: Domain.CLINICAL,
      published: true,
      categoryId: environment.id,
      mainImage: "/images/director3.webp",
      videoUrl: "https://youtube.com/watch?v=example",
      translations: {
        create: {
          language: "fr",
          title: "Accompagnement des communautés de Goma",
          excerpt: "Assistance juridique à 50 familles pour conflits fonciers.",
          content:
            "Intervention clinique menée par l’équipe CREDDA pour soutenir les populations vulnérables à Goma.",
        },
      },
    },
  })

  // ================================
  // 📚 PUBLICATIONS
  // ================================

  await prisma.publication.create({
    data: {
      year: 2024,
      doi: "10.1234/credda.2024.001",
      pdfUrl: "/docs/rapport-annuel.pdf",
      domain: Domain.RESEARCH,
      translations: {
        create: [
          {
            language: "fr",
            title: "Rapport Annuel 2024",
            authors: "Pr. Kennedy Kihangi, Dr. Luc Smith",
            description:
              "Analyse approfondie de la situation politique et juridique en RDC.",
          },
          {
            language: "en",
            title: "Annual Report 2024",
            authors: "Pr. Kennedy Kihangi, Dr. Luc Smith",
            description:
              "Comprehensive analysis of political and legal situation in DRC.",
          },
        ],
      },
    },
  })

  // ================================
  // 👥 MEMBRES
  // ================================

  await prisma.member.create({
    data: {
      image: "/images/director3.webp",
      email: "director@credda-ulpgl.org",
      order: 1,
      translations: {
        create: [
          {
            language: "fr",
            name: "Pr. Dr. Kennedy Kihangi Bindu",
            role: "Directeur de Recherche",
            bio: "Expert en droit international, gouvernance démocratique et droits humains.",
          },
          {
            language: "en",
            name: "Prof. Dr. Kennedy Kihangi Bindu",
            role: "Research Director",
            bio: "Expert in international law and democratic governance.",
          },
        ],
      },
    },
  })

  console.log("✅ Seeding terminé avec succès !")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
