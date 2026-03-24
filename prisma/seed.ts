import dotenv from 'dotenv'
import path from 'path'

// Explicitly load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  })
  console.log('🚀 Starting CREDDA-ULPGL seed (Standard Prisma)...');

  // ── 0. ADMIN USERS ──────────────────────────────────────────────────────
  try {
    console.log('⏳ Hashing passwords...');
    const hashedSuperAdmin = await bcrypt.hash('Rkule@02', 10);
    const hashedAdmin = await bcrypt.hash(
      process.env.MASTER_ADMIN_PASSWORD || 'credda2026admin', 10
    );

    await prisma.user.upsert({
      where: { email: 'rkule880@gmail.com' },
      update: { password: hashedSuperAdmin, role: 'SUPER_ADMIN', status: 'APPROVED' },
      create: { email: 'rkule880@gmail.com', name: 'Super Admin', password: hashedSuperAdmin, role: 'SUPER_ADMIN', status: 'APPROVED' }
    });
    console.log('✅ Super admin: rkule880@gmail.com');

    await prisma.user.upsert({
      where: { email: 'admin@credda-ulpgl.org' },
      update: { password: hashedAdmin, role: 'ADMIN', status: 'APPROVED' },
      create: { email: 'admin@credda-ulpgl.org', name: 'Admin CREDDA', password: hashedAdmin, role: 'ADMIN', status: 'APPROVED' }
    });
    console.log('✅ Admin: admin@credda-ulpgl.org');
  } catch (e) {
    console.error('❌ Failed to upsert admin users:', e);
  }

  // ── 1. CATEGORIES ────────────────────────────────────────────────────────
  let catResearch: any;
  let catClinical: any;

  try {
    catResearch = await prisma.category.upsert({
      where: { slug: 'recherche-fondamentale' },
      update: {},
      create: {
        slug: 'recherche-fondamentale',
        translations: {
          create: [
            { language: 'fr', name: 'Recherche Fondamentale' },
            { language: 'en', name: 'Fundamental Research' },
            { language: 'sw', name: 'Utafiti wa Msingi' }
          ]
        }
      }
    });
    console.log('✅ Category: recherche-fondamentale');
  } catch (e) {
    catResearch = await prisma.category.findUnique({ where: { slug: 'recherche-fondamentale' } });
    console.log('ℹ️ Category recherche-fondamentale already exists');
  }

  try {
    catClinical = await prisma.category.upsert({
      where: { slug: 'clinique-juridique' },
      update: {},
      create: {
        slug: 'clinique-juridique',
        translations: {
          create: [
            { language: 'fr', name: 'Clinique Juridique' },
            { language: 'en', name: 'Legal Clinic' },
            { language: 'sw', name: 'Kliniki ya Kisheria' }
          ]
        }
      }
    });
    console.log('✅ Category: clinique-juridique');
  } catch (e) {
    catClinical = await prisma.category.findUnique({ where: { slug: 'clinique-juridique' } });
    console.log('ℹ️ Category clinique-juridique already exists');
  }

  // ── 2. ARTICLES ──────────────────────────────────────────────────────────
  const articlesData = [
    {
      slug: 'impact-juridique-pollution-lac-kivu',
      domain: 'RESEARCH' as const,
      published: true,
      featured: true,
      categoryId: catResearch?.id as string,
      translations: [
        { language: 'fr', title: 'Impact Juridique de la Pollution du Lac Kivu', excerpt: 'Analyse des cadres réglementaires sur la gestion des eaux transfrontalières du Lac Kivu.', content: '<p>L\'analyse approfondie du cadre juridique régissant la protection du Lac Kivu révèle des lacunes critiques dans l\'application des normes environnementales nationales et régionales.</p>' },
        { language: 'en', title: 'Legal Impact of Lake Kivu Pollution', excerpt: 'Analysis of regulatory frameworks on transboundary water management of Lake Kivu.', content: '<p>An in-depth analysis of the legal framework governing Lake Kivu protection reveals critical gaps in the application of national and regional environmental standards.</p>' },
        { language: 'sw', title: 'Athari za Kisheria za Uchafuzi wa Ziwa Kivu', excerpt: 'Uchambuzi wa mifumo ya kisheria ya usimamizi wa maji ya mpaka wa Ziwa Kivu.', content: '<p>Uchambuzi wa kina wa mfumo wa kisheria unaosimamia ulinzi wa Ziwa Kivu unaonyesha mapungufu makubwa.</p>' }
      ]
    },
    {
      slug: 'justice-climatique-est-rdc',
      domain: 'RESEARCH' as const,
      published: true,
      featured: true,
      categoryId: catResearch?.id as string,
      translations: [
        { language: 'fr', title: 'Justice Climatique dans l\'Est de la RDC', excerpt: 'Étude sur la résilience des communautés locales face aux déplacements climatiques dans le Nord-Kivu.', content: '<p>Ce rapport explore les mécanismes de réparation pour les populations victimes de catastrophes naturelles liées au climat dans les zones de conflit.</p>' },
        { language: 'en', title: 'Climate Justice in Eastern DRC', excerpt: 'Study on the resilience of local communities facing climate displacements in North Kivu.', content: '<p>This report explores redress mechanisms for populations affected by climate-related disasters in conflict zones.</p>' },
        { language: 'sw', title: 'Haki za Hali ya Hewa Mashariki mwa DRC', excerpt: 'Utafiti kuhusu ustahimilivu wa jamii za wenyeji dhidi ya uhamishaji wa hali ya hewa.', content: '<p>Ripoti hii inachunguza njia za fidia kwa watu wanaoathiriwa na majanga ya hali ya hewa.</p>' }
      ]
    },
    {
      slug: 'justice-climatique-peuples-autochtones-rdc',
      domain: 'RESEARCH' as const,
      published: true,
      featured: true,
      categoryId: catResearch?.id as string,
      translations: [
        { language: 'fr', title: 'Justice climatique et droits des peuples autochtones pygmées en RDC', excerpt: 'Analyse des enjeux de justice climatique pour les peuples autochtones pygmées à la lumière de la Loi no 22/030.', content: '<p>La Loi no 22/030 du 15 juillet 2022 portant protection et promotion des droits des peuples autochtones pygmées constitue une avancée majeure en droit environnemental congolais.</p>' },
        { language: 'en', title: 'Climate Justice and Rights of Indigenous Pygmy Peoples in DRC', excerpt: 'Analysis of climate justice issues for indigenous Pygmy peoples in light of Law No. 22/030.', content: '<p>Law No. 22/030 of July 15, 2022 on the protection and promotion of the rights of indigenous Pygmy peoples represents a major step forward.</p>' },
        { language: 'sw', title: 'Haki za Hali ya Hewa na Haki za Watu wa Asili wa Pygmy katika DRC', excerpt: 'Uchambuzi wa masuala ya haki za hali ya hewa kwa watu wa asili wa Pygmy.', content: '<p>Sheria nambari 22/030 ya tarehe 15 Julai 2022 inwakilisha hatua kubwa mbele katika kutambua haki za mazingira.</p>' }
      ]
    },
    {
      slug: 'reforme-lois-environnementales-congo',
      domain: 'RESEARCH' as const,
      published: true,
      featured: false,
      categoryId: catResearch?.id as string,
      translations: [
        { language: 'fr', title: 'Plaidoyer pour la réforme des lois environnementales au Congo', excerpt: 'Comment renforcer le cadre légal environnemental congolais pour mieux protéger les communautés locales.', content: '<p>Le cadre juridique environnemental de la RDC nécessite des réformes profondes pour répondre aux défis contemporains de la pollution industrielle.</p>' },
        { language: 'en', title: 'Advocacy for Environmental Law Reform in Congo', excerpt: 'How to strengthen the Congolese environmental legal framework to better protect local communities.', content: '<p>The environmental legal framework of the DRC requires deep reforms to address contemporary challenges of industrial pollution.</p>' },
        { language: 'sw', title: 'Utetezi wa Marekebisho ya Sheria za Mazingira nchini Kongo', excerpt: 'Jinsi ya kuimarisha mfumo wa kisheria wa mazingira wa Kongo kulinda vyema jamii za wenyeji.', content: '<p>Mfumo wa kisheria wa mazingira wa DRC unahitaji marekebisho ya kina kukabiliana na changamoto za kisasa.</p>' }
      ]
    },
    {
      slug: 'cliniques-juridiques-outil-acces-justice',
      domain: 'CLINICAL' as const,
      published: true,
      featured: false,
      categoryId: catClinical?.id as string,
      translations: [
        { language: 'fr', title: 'Les cliniques juridiques environnementales comme outil d\'accès à la justice', excerpt: 'Retour sur la conférence internationale CTEA-University of Nairobi (décembre 2025).', content: '<p>La conférence internationale organisée par le CTEA en partenariat avec l\'University of Nairobi a mis en lumière le rôle crucial des cliniques juridiques.</p>' },
        { language: 'en', title: 'Environmental Legal Clinics as a Tool for Access to Justice', excerpt: 'Lessons from the CTEA-University of Nairobi international conference (December 2025).', content: '<p>The CTEA conference highlighted the crucial role of environmental legal clinics as a tool for access to justice for vulnerable communities.</p>' },
        { language: 'sw', title: 'Kliniki za Kisheria za Mazingira kama Chombo cha Upatikanaji wa Haki', excerpt: 'Masomo kutoka mkutano wa kimataifa wa CTEA-Chuo Kikuu cha Nairobi.', content: '<p>Mkutano wa CTEA uliangazia jukumu muhimu la kliniki za kisheria za mazingira.</p>' }
      ]
    }
  ];

  for (const a of articlesData) {
    try {
      await prisma.article.create({
        data: {
          slug: a.slug,
          domain: a.domain,
          published: a.published,
          featured: a.featured,
          categoryId: a.categoryId,
          translations: { create: a.translations }
        }
      });
      console.log(`✅ Article: ${a.slug}`);
      await sleep(200);
    } catch (e) {
      console.log(`ℹ️ Article ${a.slug} already exists.`);
    }
  }

  // ── 3. EVENTS ────────────────────────────────────────────────────────────
  const eventsData = [
    {
      slug: 'symposium-droit-environnement-2026',
      date: new Date('2026-05-15T09:00:00Z'),
      location: 'Goma, Grand Karavia',
      type: 'CONFERENCE',
      isPublished: true,
      translations: [
        { language: 'fr', title: 'Symposium International sur le Droit de l\'Environnement', description: 'Une rencontre entre experts, magistrats et défenseurs des droits humains pour discuter des avancées du droit de l\'environnement en RDC.' },
        { language: 'en', title: 'International Symposium on Environmental Law', description: 'A meeting between experts, magistrates, and human rights defenders to discuss advances in environmental law in DRC.' },
        { language: 'sw', title: 'Simposio ya Kimataifa ya Sheria ya Mazingira', description: 'Mkutano kati ya wataalamu, mahakimu na watetezi wa haki za binadamu kujadili maendeleo ya sheria ya mazingira.' }
      ]
    },
    {
      slug: 'clinique-mobile-rutshuru-mars-2026',
      date: new Date('2026-03-24T08:00:00Z'),
      location: 'Rutshuru, Nord-Kivu, RDC',
      type: 'CLINIC',
      isPublished: true,
      translations: [
        { language: 'fr', title: 'Clinique mobile — Rutshuru', description: 'La Clinique CDE organise une session de consultations juridiques gratuites à Rutshuru pour les communautés locales.' },
        { language: 'en', title: 'Mobile Clinic — Rutshuru', description: 'The CDE Clinic organizes a free legal consultation session in Rutshuru for local communities affected by environmental issues.' },
        { language: 'sw', title: 'Kliniki ya Simu — Rutshuru', description: 'Kliniki ya CDE inapanga kikao cha mashauriano ya kisheria bila malipo Rutshuru.' }
      ]
    },
    {
      slug: 'formation-etudiants-cde-avril-2026',
      date: new Date('2026-04-10T08:00:00Z'),
      location: 'ULPGL, Goma, RDC',
      type: 'TRAINING',
      isPublished: true,
      translations: [
        { language: 'fr', title: 'Formation initiale — Étudiants cliniciens CDE', description: 'Session de formation intensive pour les nouveaux étudiants-cliniciens de la Clinique de Droit de l\'Environnement.' },
        { language: 'en', title: 'Initial Training — CDE Clinical Students', description: 'Intensive training session for new clinical students of the Environmental Law Clinic.' },
        { language: 'sw', title: 'Mafunzo ya Awali — Wanafunzi wa Kliniki ya CDE', description: 'Kikao cha mafunzo makali kwa wanafunzi wapya wa kliniki ya Sheria ya Mazingira.' }
      ]
    },
    {
      slug: 'seminaire-droit-climatique-mai-2026',
      date: new Date('2026-05-22T09:00:00Z'),
      location: 'Goma, RDC',
      type: 'SEMINAR',
      isPublished: true,
      translations: [
        { language: 'fr', title: 'Séminaire — Droit climatique & justice environnementale', description: 'Séminaire international réunissant chercheurs, praticiens du droit et défenseurs des droits environnementaux.' },
        { language: 'en', title: 'Seminar — Climate Law & Environmental Justice', description: 'International seminar bringing together researchers, legal practitioners and environmental rights defenders.' },
        { language: 'sw', title: 'Semina — Sheria ya Hali ya Hewa na Haki za Mazingira', description: 'Semina ya kimataifa inayokusanya watafiti, wataalamu wa kisheria na watetezi wa haki za mazingira.' }
      ]
    }
  ];

  for (const ev of eventsData) {
    try {
      await prisma.event.create({
        data: {
          slug: ev.slug,
          date: ev.date,
          location: ev.location,
          type: ev.type,
          isPublished: ev.isPublished,
          translations: { create: ev.translations }
        }
      });
      console.log(`✅ Event: ${ev.slug}`);
      await sleep(200);
    } catch (e) {
      console.log(`ℹ️ Event ${ev.slug} already exists.`);
    }
  }

  // ── 4. TEAM MEMBERS ──────────────────────────────────────────────────────
  const membersData = [
    {
      email: 'dir@credda-ulpgl.org',
      image: null,
      order: 1,
      translations: [
        { language: 'fr', name: 'Prof. Jean-Baptiste Mukanire', role: 'Directeur du CREDDA', bio: 'Professeur de droit de l\'environnement à l\'ULPGL de Goma. Fondateur du CREDDA et pionnier de la justice environnementale en RDC.' },
        { language: 'en', name: 'Prof. Jean-Baptiste Mukanire', role: 'Director of CREDDA', bio: 'Professor of environmental law at ULPGL Goma. Founder of CREDDA and pioneer of environmental justice in DRC.' },
        { language: 'sw', name: 'Prof. Jean-Baptiste Mukanire', role: 'Mkurugenzi wa CREDDA', bio: 'Profesa wa sheria ya mazingira katika ULPGL Goma. Mwanzilishi wa CREDDA.' }
      ]
    },
    {
      email: 'kahindo@credda-ulpgl.org',
      image: null,
      order: 2,
      translations: [
        { language: 'fr', name: 'Dr. Marie-Claire Kahindo', role: 'Coordinatrice de la Clinique CDE', bio: 'Docteure en droit international de l\'environnement. Responsable des programmes de formation clinique et de l\'assistance juridique aux communautés vulnérables.' },
        { language: 'en', name: 'Dr. Marie-Claire Kahindo', role: 'CDE Clinic Coordinator', bio: 'PhD in international environmental law. Responsible for clinical training and legal assistance programs.' },
        { language: 'sw', name: 'Dk. Marie-Claire Kahindo', role: 'Mratibu wa Kliniki ya CDE', bio: 'Daktari wa sheria ya kimataifa ya mazingira. Anayehusika na mipango ya mafunzo ya kliniki.' }
      ]
    },
    {
      email: 'lwaboshi@credda-ulpgl.org',
      image: null,
      order: 3,
      translations: [
        { language: 'fr', name: 'Me. Patrick Lwaboshi', role: 'Avocat d\'intérêt public', bio: 'Avocat au Barreau de Goma. Spécialiste des litiges environnementaux et des droits des peuples autochtones pygmées en RDC.' },
        { language: 'en', name: 'Me. Patrick Lwaboshi', role: 'Public Interest Lawyer', bio: 'Lawyer at Goma Bar. Specialist in environmental litigation and indigenous peoples rights in DRC.' },
        { language: 'sw', name: 'Me. Patrick Lwaboshi', role: 'Wakili wa Maslahi ya Umma', bio: 'Wakili katika Baa ya Goma. Mtaalamu wa ugomvi wa mazingira na haki za watu wa asili.' }
      ]
    },
    {
      email: 'zawadi@credda-ulpgl.org',
      image: null,
      order: 4,
      translations: [
        { language: 'fr', name: 'Mme. Esperance Zawadi', role: 'Chercheuse — Droits climatiques', bio: 'Chercheuse spécialisée en droits climatiques et justice environnementale au Nord-Kivu.' },
        { language: 'en', name: 'Mme. Esperance Zawadi', role: 'Researcher — Climate Rights', bio: 'Researcher specializing in climate rights and environmental justice in North Kivu.' },
        { language: 'sw', name: 'Bi. Esperance Zawadi', role: 'Mtafiti — Haki za Hali ya Hewa', bio: 'Mtafiti anayebobea katika haki za hali ya hewa na haki za mazingira.' }
      ]
    }
  ];

  for (const m of membersData) {
    try {
      await prisma.member.create({
        data: {
          email: m.email,
          image: m.image,
          order: m.order,
          translations: { create: m.translations }
        }
      });
      console.log(`✅ Member: ${m.email}`);
      await sleep(200);
    } catch (e) {
      console.log(`ℹ️ Member ${m.email} already exists.`);
    }
  }

  // ── 5. TESTIMONIALS ──────────────────────────────────────────────────────
  // Schema: Testimonial { authorName, authorRole, avatarInitials, photoUrl, isPublished }
  // TestimonialTranslation: { language, quote, testimonialId }
  const testimonialsData = [
    {
      authorName: 'David MICHAEL PEYTON',
      authorRole: 'PhD Candidate, Northwestern University',
      avatarInitials: 'DP',
      photoUrl: '/images/testimonials/Peyton.webp',
      isPublished: true,
      translations: [
        { language: 'fr', quote: 'Je n\'aurais pas pu rêver de meilleurs partenaires de recherche que le corps professoral et le personnel du CREDDA-ULPGL. Ils ont soutenu plusieurs types de collecte de données et offert des opportunités de rétroaction d\'universitaires congolais.' },
        { language: 'en', quote: 'I could not have asked for more ideal research partners than the faculty and staff at CREDDA-ULPGL. They were not only able to support multiple types of data collection but also provided opportunities for feedback from Congolese academics.' },
        { language: 'sw', quote: 'Sikuweza kupata washirika bora wa utafiti kuliko kitivo na wafanyakazi wa CREDDA-ULPGL. Waliweza kusaidia aina nyingi za kukusanya data na kutoa fursa za maoni kutoka kwa wasomi wa Kongo.' }
      ]
    },
    {
      authorName: 'Heather LYNNE ZIMMERMAN',
      authorRole: 'Masters student, London School of Economics (LSE)',
      avatarInitials: 'HZ',
      photoUrl: '/images/testimonials/heather.webp',
      isPublished: true,
      translations: [
        { language: 'fr', quote: 'Cher Professeur Kennedy Kihangi, merci beaucoup de m\'avoir accueillie si généreusement dans la communauté ! Je suis reconnaissante pour les idées et commentaires offerts sur mes recherches. J\'ai hâte de revenir à Goma.' },
        { language: 'en', quote: 'Dear Professor Kennedy Kihangi, thank you very much for generously welcoming me into the community! I am grateful for the ideas and feedback offered on my research. I am eager to return to Goma.' },
        { language: 'sw', quote: 'Profesa Kennedy Kihangi mpendwa, asante sana kwa kunikaribishia kwa ukarimu katika jamii! Ninashukuru mawazo na maoni ya utafiti wangu. Ninatamani kurudi Goma.' }
      ]
    },
    {
      authorName: 'Britta Sjöstedt',
      authorRole: 'PhD candidate, Lund University',
      avatarInitials: 'BS',
      photoUrl: '/images/testimonials/britta.webp',
      isPublished: true,
      translations: [
        { language: 'fr', quote: 'J\'ai visité l\'ULPGL en 2015 pour mener des recherches pour mon doctorat. Le professeur Kennedy KIHANGI BINDU a été un excellent hôte qui a aidé à entrer en contact avec d\'autres chercheurs et organisations.' },
        { language: 'en', quote: 'I visited ULPGL in 2015 to conduct research for my PhD. Professor Kennedy KIHANGI BINDU was an excellent host that helped to get in contact with other researchers and organisations.' },
        { language: 'sw', quote: 'Nilitembelea ULPGL mwaka 2015 kufanya utafiti kwa PhD yangu. Profesa Kennedy KIHANGI BINDU alikuwa mwenyeji bora aliyenisaidia kuwasiliana na watafiti na mashirika mengine.' }
      ]
    }
  ];

  for (const t of testimonialsData) {
    try {
      await prisma.testimonial.create({
        data: {
          authorName: t.authorName,
          authorRole: t.authorRole,
          avatarInitials: t.avatarInitials,
          photoUrl: t.photoUrl,
          isPublished: t.isPublished,
          translations: { create: t.translations }
        }
      });
      console.log(`✅ Testimonial: ${t.authorName}`);
      await sleep(200);
    } catch (e) {
      console.log(`ℹ️ Testimonial ${t.authorName} already exists.`);
    }
  }

  // ── 6. GALLERY IMAGES ────────────────────────────────────────────────────
  // Schema: GalleryImage { src, category, order, featured }
  // GalleryImageTranslation: { language, title, description, galleryImageId (auto via nested create) }
  const galleryData = [
    {
      src: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      category: 'CLINIC',
      featured: true,
      order: 1,
      translations: [
        { language: 'fr', title: 'Clinique mobile — Goma 2026', description: 'Session de consultations juridiques gratuites organisée par la CDE pour les communautés locales de Goma.' },
        { language: 'en', title: 'Mobile Clinic — Goma 2026', description: 'Free legal consultation session organized by CDE for local communities in Goma.' },
        { language: 'sw', title: 'Kliniki ya Simu — Goma 2026', description: 'Kikao cha mashauriano ya kisheria bila malipo kilichoandaliwa na CDE kwa jamii za wenyeji.' }
      ]
    },
    {
      src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
      category: 'TRAINING',
      featured: true,
      order: 2,
      translations: [
        { language: 'fr', title: 'Formation des étudiants-cliniciens', description: 'Session de formation des nouveaux étudiants-cliniciens de la Clinique de Droit de l\'Environnement à l\'ULPGL.' },
        { language: 'en', title: 'Training of Clinical Students', description: 'Training session for new clinical students of the Environmental Law Clinic at ULPGL.' },
        { language: 'sw', title: 'Mafunzo ya Wanafunzi wa Kliniki', description: 'Kikao cha mafunzo kwa wanafunzi wapya wa kliniki ya Sheria ya Mazingira.' }
      ]
    },
    {
      src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      category: 'CONFERENCE',
      featured: true,
      order: 3,
      translations: [
        { language: 'fr', title: 'Conférence CTEA — Nairobi 2025', description: 'Participation du CREDDA à la conférence internationale sur les cliniques de droit de l\'environnement, Nairobi, décembre 2025.' },
        { language: 'en', title: 'CTEA Conference — Nairobi 2025', description: 'CREDDA participation in the international conference on environmental law clinics, Nairobi, December 2025.' },
        { language: 'sw', title: 'Mkutano wa CTEA — Nairobi 2025', description: 'Ushiriki wa CREDDA katika mkutano wa kimataifa wa kliniki za sheria za mazingira, Nairobi Desemba 2025.' }
      ]
    },
    {
      src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
      category: 'COMMUNITY',
      featured: true,
      order: 4,
      translations: [
        { language: 'fr', title: 'Sensibilisation communautaire — Nord-Kivu', description: 'Campagne de vulgarisation du droit environnemental auprès des communautés locales du Nord-Kivu.' },
        { language: 'en', title: 'Community Awareness — North Kivu', description: 'Environmental law awareness campaign among local communities in North Kivu.' },
        { language: 'sw', title: 'Uhamasishaji wa Jamii — Kivu Kaskazini', description: 'Kampeni ya uhamasishaji wa sheria ya mazingira kwa jamii za wenyeji za Kivu Kaskazini.' }
      ]
    }
  ];

  for (const g of galleryData) {
    try {
      await prisma.galleryImage.create({
        data: {
          src: g.src,
          category: g.category,
          featured: g.featured,
          order: g.order,
          translations: { create: g.translations }
        }
      });
      console.log(`✅ Gallery: ${g.translations[0].title}`);
      await sleep(200);
    } catch (e) {
      console.log(`ℹ️ Gallery image order ${g.order} already exists.`);
    }
  }

  console.log('');
  console.log('🎉 CREDDA-ULPGL database seeded successfully!');
  console.log('─────────────────────────────────────────────');
  console.log('Super Admin:  rkule880@gmail.com / Rkule@02');
  console.log('Admin:        admin@credda-ulpgl.org / credda2026admin');
  console.log('─────────────────────────────────────────────');
  console.log('Members: 4  Articles: 5  Events: 4  Testimonials: 3  Gallery: 4');

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1)
  })
  .finally(() => {
    process.exit(0);
  });
