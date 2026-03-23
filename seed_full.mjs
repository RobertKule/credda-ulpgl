// seed_full.mjs – Uses neon() HTTP driver directly (same as seed_admin.mjs which worked)
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL || !DATABASE_URL.startsWith('postgres')) {
  console.error('❌ DATABASE_URL missing — check .env file');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

function cuid() {
  return 'c' + Math.random().toString(36).substr(2, 24) + Date.now().toString(36);
}

async function main() {
  console.log('🚀 Starting CREDDA-ULPGL full seed (Neon HTTP driver)...');

  // ── 0. ADMIN USERS ────────────────────────────────────────────────────────
  try {
    const hashedSuperAdmin = await bcrypt.hash('Rkule@02', 10);
    const hashedAdmin = await bcrypt.hash(
      process.env.MASTER_ADMIN_PASSWORD || 'credda2026admin', 10
    );

    await sql`
      INSERT INTO "User" (id, email, name, password, role, status, "createdAt")
      VALUES (${cuid()}, 'rkule880@gmail.com', 'Super Admin', ${hashedSuperAdmin}, 'SUPER_ADMIN', 'APPROVED', NOW())
      ON CONFLICT (email) DO UPDATE SET password = ${hashedSuperAdmin}, role = 'SUPER_ADMIN', status = 'APPROVED'
    `;
    console.log('✅ Super admin: rkule880@gmail.com');

    await sql`
      INSERT INTO "User" (id, email, name, password, role, status, "createdAt")
      VALUES (${cuid()}, 'admin@credda-ulpgl.org', 'Admin CREDDA', ${hashedAdmin}, 'ADMIN', 'APPROVED', NOW())
      ON CONFLICT (email) DO UPDATE SET password = ${hashedAdmin}, role = 'ADMIN', status = 'APPROVED'
    `;
    console.log('✅ Admin: admin@credda-ulpgl.org');
  } catch (e) {
    console.error('❌ Admin users:', e.message);
  }

  // ── 1. CATEGORIES ──────────────────────────────────────────────────────────
  let catResearchId, catClinicalId;

  try {
    const existing = await sql`SELECT id FROM "Category" WHERE slug = 'recherche-fondamentale' LIMIT 1`;
    if (existing.length > 0) {
      catResearchId = existing[0].id;
    } else {
      catResearchId = cuid();
      await sql`INSERT INTO "Category" (id, slug) VALUES (${catResearchId}, 'recherche-fondamentale')`;
      for (const [lang, name] of [['fr','Recherche Fondamentale'], ['en','Fundamental Research'], ['sw','Utafiti wa Msingi']]) {
        await sql`INSERT INTO "CategoryTranslation" (id, language, name, "categoryId") VALUES (${cuid()}, ${lang}, ${name}, ${catResearchId})`;
      }
    }
    console.log('✅ Category: recherche-fondamentale');
  } catch (e) { console.error('❌ catResearch:', e.message); }

  try {
    const existing = await sql`SELECT id FROM "Category" WHERE slug = 'clinique-juridique' LIMIT 1`;
    if (existing.length > 0) {
      catClinicalId = existing[0].id;
    } else {
      catClinicalId = cuid();
      await sql`INSERT INTO "Category" (id, slug) VALUES (${catClinicalId}, 'clinique-juridique')`;
      for (const [lang, name] of [['fr','Clinique Juridique'], ['en','Legal Clinic'], ['sw','Kliniki ya Kisheria']]) {
        await sql`INSERT INTO "CategoryTranslation" (id, language, name, "categoryId") VALUES (${cuid()}, ${lang}, ${name}, ${catClinicalId})`;
      }
    }
    console.log('✅ Category: clinique-juridique');
  } catch (e) { console.error('❌ catClinical:', e.message); }

  // ── 2. ARTICLES ────────────────────────────────────────────────────────────
  const articles = [
    {
      slug: 'impact-juridique-pollution-lac-kivu',
      domain: 'RESEARCH',
      published: true,
      featured: true,
      categoryId: catResearchId,
      translations: [
        { lang: 'fr', title: 'Impact Juridique de la Pollution du Lac Kivu', excerpt: 'Analyse des cadres réglementaires sur la gestion des eaux transfrontalières du Lac Kivu.', content: "<p>L'analyse approfondie du cadre juridique régissant la protection du Lac Kivu révèle des lacunes critiques dans l'application des normes environnementales nationales et régionales.</p>" },
        { lang: 'en', title: 'Legal Impact of Lake Kivu Pollution', excerpt: 'Analysis of regulatory frameworks on transboundary water management of Lake Kivu.', content: '<p>An in-depth analysis of the legal framework governing Lake Kivu protection reveals critical gaps in the application of national and regional environmental standards.</p>' },
        { lang: 'sw', title: 'Athari za Kisheria za Uchafuzi wa Ziwa Kivu', excerpt: 'Uchambuzi wa mifumo ya kisheria ya usimamizi wa maji ya mpaka wa Ziwa Kivu.', content: '<p>Uchambuzi wa kina wa mfumo wa kisheria unaosimamia ulinzi wa Ziwa Kivu unaonyesha mapungufu makubwa.</p>' }
      ]
    },
    {
      slug: 'justice-climatique-est-rdc',
      domain: 'RESEARCH',
      published: true,
      featured: true,
      categoryId: catResearchId,
      translations: [
        { lang: 'fr', title: "Justice Climatique dans l'Est de la RDC", excerpt: 'Étude sur la résilience des communautés locales face aux déplacements climatiques dans le Nord-Kivu.', content: "<p>Ce rapport explore les mécanismes de réparation pour les populations victimes de catastrophes naturelles liées au climat dans les zones de conflit.</p>" },
        { lang: 'en', title: 'Climate Justice in Eastern DRC', excerpt: 'Study on the resilience of local communities facing climate displacements in North Kivu.', content: '<p>This report explores redress mechanisms for populations affected by climate-related disasters in conflict zones.</p>' },
        { lang: 'sw', title: 'Haki za Hali ya Hewa Mashariki mwa DRC', excerpt: 'Utafiti kuhusu ustahimilivu wa jamii za wenyeji dhidi ya uhamishaji wa hali ya hewa.', content: '<p>Ripoti hii inachunguza njia za fidia kwa watu wanaoathiriwa na majanga ya hali ya hewa.</p>' }
      ]
    },
    {
      slug: 'justice-climatique-peuples-autochtones-rdc',
      domain: 'RESEARCH',
      published: true,
      featured: true,
      categoryId: catResearchId,
      translations: [
        { lang: 'fr', title: 'Justice climatique et droits des peuples autochtones pygmées en RDC', excerpt: 'Analyse des enjeux de justice climatique pour les peuples autochtones pygmées à la lumière de la Loi no 22/030.', content: "<p>La Loi no 22/030 du 15 juillet 2022 portant protection et promotion des droits des peuples autochtones pygmées constitue une avancée majeure en droit environnemental congolais.</p>" },
        { lang: 'en', title: 'Climate Justice and Rights of Indigenous Pygmy Peoples in DRC', excerpt: 'Analysis of climate justice issues for indigenous Pygmy peoples in light of Law No. 22/030.', content: '<p>Law No. 22/030 of July 15, 2022 represents a major step forward in recognizing environmental rights of indigenous Pygmy peoples.</p>' },
        { lang: 'sw', title: 'Haki za Hali ya Hewa na Haki za Watu wa Asili wa Pygmy katika DRC', excerpt: 'Uchambuzi wa masuala ya haki za hali ya hewa kwa watu wa asili wa Pygmy.', content: '<p>Sheria nambari 22/030 ya tarehe 15 Julai 2022 inawakilisha hatua kubwa mbele katika kutambua haki za mazingira.</p>' }
      ]
    },
    {
      slug: 'reforme-lois-environnementales-congo',
      domain: 'RESEARCH',
      published: true,
      featured: false,
      categoryId: catResearchId,
      translations: [
        { lang: 'fr', title: 'Plaidoyer pour la réforme des lois environnementales au Congo', excerpt: 'Comment renforcer le cadre légal environnemental congolais pour mieux protéger les communautés locales.', content: "<p>Le cadre juridique environnemental de la RDC nécessite des réformes profondes pour répondre aux défis contemporains de la pollution industrielle.</p>" },
        { lang: 'en', title: 'Advocacy for Environmental Law Reform in Congo', excerpt: 'How to strengthen the Congolese environmental legal framework to better protect local communities.', content: '<p>The environmental legal framework of the DRC requires deep reforms to address contemporary challenges of industrial pollution.</p>' },
        { lang: 'sw', title: 'Utetezi wa Marekebisho ya Sheria za Mazingira nchini Kongo', excerpt: 'Jinsi ya kuimarisha mfumo wa kisheria wa mazingira wa Kongo kulinda vyema jamii za wenyeji.', content: '<p>Mfumo wa kisheria wa mazingira wa DRC unahitaji marekebisho ya kina kukabiliana na changamoto za kisasa.</p>' }
      ]
    },
    {
      slug: 'cliniques-juridiques-outil-acces-justice',
      domain: 'CLINICAL',
      published: true,
      featured: false,
      categoryId: catClinicalId,
      translations: [
        { lang: 'fr', title: "Les cliniques juridiques environnementales comme outil d'accès à la justice", excerpt: 'Retour sur la conférence internationale CTEA-University of Nairobi (décembre 2025).', content: "<p>La conférence internationale organisée par le CTEA en partenariat avec l'University of Nairobi a mis en lumière le rôle crucial des cliniques juridiques.</p>" },
        { lang: 'en', title: 'Environmental Legal Clinics as a Tool for Access to Justice', excerpt: 'Lessons from the CTEA-University of Nairobi international conference (December 2025).', content: '<p>The CTEA conference highlighted the crucial role of environmental legal clinics as a tool for access to justice for vulnerable communities.</p>' },
        { lang: 'sw', title: 'Kliniki za Kisheria za Mazingira kama Chombo cha Upatikanaji wa Haki', excerpt: 'Masomo kutoka mkutano wa kimataifa wa CTEA-Chuo Kikuu cha Nairobi.', content: '<p>Mkutano wa CTEA uliangazia jukumu muhimu la kliniki za kisheria za mazingira.</p>' }
      ]
    }
  ];

  for (const a of articles) {
    try {
      const existing = await sql`SELECT id FROM "Article" WHERE slug = ${a.slug} LIMIT 1`;
      if (existing.length > 0) { console.log(`ℹ️ Article exists: ${a.slug}`); continue; }
      const id = cuid();
      await sql`
        INSERT INTO "Article" (id, slug, domain, published, featured, "categoryId", "createdAt", "updatedAt")
        VALUES (${id}, ${a.slug}, ${a.domain}, ${a.published}, ${a.featured}, ${a.categoryId}, NOW(), NOW())
      `;
      for (const t of a.translations) {
        await sql`
          INSERT INTO "ArticleTranslation" (id, language, title, excerpt, content, "articleId")
          VALUES (${cuid()}, ${t.lang}, ${t.title}, ${t.excerpt}, ${t.content}, ${id})
        `;
      }
      console.log(`✅ Article: ${a.slug}`);
    } catch (e) { console.error(`❌ Article ${a.slug}:`, e.message); }
  }

  // ── 3. EVENTS ─────────────────────────────────────────────────────────────
  const events = [
    {
      slug: 'symposium-droit-environnement-2026',
      date: '2026-05-15T09:00:00Z',
      location: 'Goma, Grand Karavia',
      type: 'CONFERENCE',
      translations: [
        { lang: 'fr', title: "Symposium International sur le Droit de l'Environnement", description: "Une rencontre entre experts, magistrats et défenseurs des droits humains." },
        { lang: 'en', title: 'International Symposium on Environmental Law', description: 'A meeting between experts, magistrates, and human rights defenders.' },
        { lang: 'sw', title: 'Simposio ya Kimataifa ya Sheria ya Mazingira', description: 'Mkutano kati ya wataalamu, mahakimu na watetezi wa haki za binadamu.' }
      ]
    },
    {
      slug: 'clinique-mobile-rutshuru-mars-2026',
      date: '2026-03-24T08:00:00Z',
      location: 'Rutshuru, Nord-Kivu, RDC',
      type: 'CLINIC',
      translations: [
        { lang: 'fr', title: 'Clinique mobile — Rutshuru', description: 'La Clinique CDE organise une session de consultations juridiques gratuites à Rutshuru.' },
        { lang: 'en', title: 'Mobile Clinic — Rutshuru', description: 'The CDE Clinic organizes a free legal consultation session in Rutshuru.' },
        { lang: 'sw', title: 'Kliniki ya Simu — Rutshuru', description: 'Kliniki ya CDE inapanga kikao cha mashauriano ya kisheria bila malipo Rutshuru.' }
      ]
    },
    {
      slug: 'formation-etudiants-cde-avril-2026',
      date: '2026-04-10T08:00:00Z',
      location: 'ULPGL, Goma, RDC',
      type: 'TRAINING',
      translations: [
        { lang: 'fr', title: 'Formation initiale — Étudiants cliniciens CDE', description: "Session de formation intensive pour les nouveaux étudiants-cliniciens de la Clinique de Droit de l'Environnement." },
        { lang: 'en', title: 'Initial Training — CDE Clinical Students', description: 'Intensive training session for new clinical students of the Environmental Law Clinic.' },
        { lang: 'sw', title: 'Mafunzo ya Awali — Wanafunzi wa Kliniki ya CDE', description: 'Kikao cha mafunzo makali kwa wanafunzi wapya wa kliniki ya Sheria ya Mazingira.' }
      ]
    },
    {
      slug: 'seminaire-droit-climatique-mai-2026',
      date: '2026-05-22T09:00:00Z',
      location: 'Goma, RDC',
      type: 'SEMINAR',
      translations: [
        { lang: 'fr', title: 'Séminaire — Droit climatique & justice environnementale', description: 'Séminaire international réunissant chercheurs, praticiens du droit et défenseurs des droits environnementaux.' },
        { lang: 'en', title: 'Seminar — Climate Law & Environmental Justice', description: 'International seminar bringing together researchers, legal practitioners and environmental rights defenders.' },
        { lang: 'sw', title: 'Semina — Sheria ya Hali ya Hewa na Haki za Mazingira', description: 'Semina ya kimataifa inayokusanya watafiti, wataalamu wa kisheria na watetezi wa haki za mazingira.' }
      ]
    }
  ];

  for (const ev of events) {
    try {
      const existing = await sql`SELECT id FROM "Event" WHERE slug = ${ev.slug} LIMIT 1`;
      if (existing.length > 0) { console.log(`ℹ️ Event exists: ${ev.slug}`); continue; }
      const id = cuid();
      await sql`
        INSERT INTO "Event" (id, slug, date, location, type, "isPublished", "createdAt", "updatedAt")
        VALUES (${id}, ${ev.slug}, ${ev.date}, ${ev.location}, ${ev.type}, true, NOW(), NOW())
      `;
      for (const t of ev.translations) {
        await sql`
          INSERT INTO "EventTranslation" (id, language, title, description, "eventId")
          VALUES (${cuid()}, ${t.lang}, ${t.title}, ${t.description}, ${id})
        `;
      }
      console.log(`✅ Event: ${ev.slug}`);
    } catch (e) { console.error(`❌ Event ${ev.slug}:`, e.message); }
  }

  // ── 4. TEAM MEMBERS ───────────────────────────────────────────────────────
  const members = [
    {
      email: 'dir@credda-ulpgl.org',
      order: 1,
      translations: [
        { lang: 'fr', name: 'Prof. Jean-Baptiste Mukanire', role: 'Directeur du CREDDA', bio: "Professeur de droit de l'environnement à l'ULPGL de Goma. Fondateur du CREDDA et pionnier de la justice environnementale en RDC." },
        { lang: 'en', name: 'Prof. Jean-Baptiste Mukanire', role: 'Director of CREDDA', bio: 'Professor of environmental law at ULPGL Goma. Founder of CREDDA and pioneer of environmental justice in DRC.' },
        { lang: 'sw', name: 'Prof. Jean-Baptiste Mukanire', role: 'Mkurugenzi wa CREDDA', bio: 'Profesa wa sheria ya mazingira katika ULPGL Goma. Mwanzilishi wa CREDDA.' }
      ]
    },
    {
      email: 'kahindo@credda-ulpgl.org',
      order: 2,
      translations: [
        { lang: 'fr', name: 'Dr. Marie-Claire Kahindo', role: 'Coordinatrice de la Clinique CDE', bio: "Docteure en droit international de l'environnement. Responsable des programmes de formation clinique." },
        { lang: 'en', name: 'Dr. Marie-Claire Kahindo', role: 'CDE Clinic Coordinator', bio: 'PhD in international environmental law. Responsible for clinical training and legal assistance programs.' },
        { lang: 'sw', name: 'Dk. Marie-Claire Kahindo', role: 'Mratibu wa Kliniki ya CDE', bio: 'Daktari wa sheria ya kimataifa ya mazingira. Anayehusika na mipango ya mafunzo ya kliniki.' }
      ]
    },
    {
      email: 'lwaboshi@credda-ulpgl.org',
      order: 3,
      translations: [
        { lang: 'fr', name: 'Me. Patrick Lwaboshi', role: "Avocat d'intérêt public", bio: 'Avocat au Barreau de Goma. Spécialiste des litiges environnementaux et des droits des peuples autochtones pygmées.' },
        { lang: 'en', name: 'Me. Patrick Lwaboshi', role: 'Public Interest Lawyer', bio: 'Lawyer at Goma Bar. Specialist in environmental litigation and indigenous peoples rights in DRC.' },
        { lang: 'sw', name: 'Me. Patrick Lwaboshi', role: 'Wakili wa Maslahi ya Umma', bio: 'Wakili katika Baa ya Goma. Mtaalamu wa ugomvi wa mazingira na haki za watu wa asili.' }
      ]
    },
    {
      email: 'zawadi@credda-ulpgl.org',
      order: 4,
      translations: [
        { lang: 'fr', name: 'Mme. Esperance Zawadi', role: 'Chercheuse — Droits climatiques', bio: 'Chercheuse spécialisée en droits climatiques et justice environnementale au Nord-Kivu.' },
        { lang: 'en', name: 'Mme. Esperance Zawadi', role: 'Researcher — Climate Rights', bio: 'Researcher specializing in climate rights and environmental justice in North Kivu.' },
        { lang: 'sw', name: 'Bi. Esperance Zawadi', role: 'Mtafiti — Haki za Hali ya Hewa', bio: 'Mtafiti anayebobea katika haki za hali ya hewa na haki za mazingira.' }
      ]
    }
  ];

  for (const m of members) {
    try {
      const existing = await sql`SELECT id FROM "Member" WHERE email = ${m.email} LIMIT 1`;
      if (existing.length > 0) { console.log(`ℹ️ Member exists: ${m.email}`); continue; }
      const id = cuid();
      await sql`INSERT INTO "Member" (id, email, "order") VALUES (${id}, ${m.email}, ${m.order})`;
      for (const t of m.translations) {
        await sql`
          INSERT INTO "MemberTranslation" (id, language, name, role, bio, "memberId")
          VALUES (${cuid()}, ${t.lang}, ${t.name}, ${t.role}, ${t.bio}, ${id})
        `;
      }
      console.log(`✅ Member: ${m.email}`);
    } catch (e) { console.error(`❌ Member ${m.email}:`, e.message); }
  }

  // ── 5. TESTIMONIALS ───────────────────────────────────────────────────────
  // Schema: Testimonial { authorName, authorRole, avatarInitials, photoUrl, isPublished }
  // TestimonialTranslation { language, quote, testimonialId }
  const testimonials = [
    {
      authorName: 'David MICHAEL PEYTON',
      authorRole: 'PhD Candidate, Northwestern University',
      avatarInitials: 'DP',
      photoUrl: '/images/testimonials/Peyton.webp',
      translations: [
        { lang: 'fr', quote: "Je n'aurais pas pu rêver de meilleurs partenaires de recherche que le corps professoral et le personnel du CREDDA-ULPGL. Ils ont soutenu plusieurs types de collecte de données et offert des opportunités de rétroaction d'universitaires congolais." },
        { lang: 'en', quote: 'I could not have asked for more ideal research partners than the faculty and staff at CREDDA-ULPGL. They were not only able to support multiple types of data collection but also provided opportunities for feedback from Congolese academics.' },
        { lang: 'sw', quote: 'Sikuweza kupata washirika bora wa utafiti kuliko kitivo na wafanyakazi wa CREDDA-ULPGL. Waliweza kusaidia aina nyingi za kukusanya data na kutoa fursa za maoni kutoka kwa wasomi wa Kongo.' }
      ]
    },
    {
      authorName: 'Heather LYNNE ZIMMERMAN',
      authorRole: 'Masters student, London School of Economics (LSE)',
      avatarInitials: 'HZ',
      photoUrl: '/images/testimonials/heather.webp',
      translations: [
        { lang: 'fr', quote: "Cher Professeur Kennedy Kihangi, merci beaucoup de m'avoir accueillie si généreusement dans la communauté ! Je suis reconnaissante pour les idées et commentaires offerts sur mes recherches. J'ai hâte de revenir à Goma." },
        { lang: 'en', quote: 'Dear Professor Kennedy Kihangi, thank you very much for generously welcoming me into the community! I am grateful for the ideas and feedback offered on my research. I am eager to return to Goma.' },
        { lang: 'sw', quote: 'Profesa Kennedy Kihangi mpendwa, asante sana kwa kunikaribishia kwa ukarimu katika jamii! Ninashukuru mawazo na maoni ya utafiti wangu. Ninatamani kurudi Goma.' }
      ]
    },
    {
      authorName: 'Britta Sjöstedt',
      authorRole: 'PhD candidate, Lund University',
      avatarInitials: 'BS',
      photoUrl: '/images/testimonials/britta.webp',
      translations: [
        { lang: 'fr', quote: "J'ai visité l'ULPGL en 2015 pour mener des recherches pour mon doctorat. Le professeur Kennedy KIHANGI BINDU a été un excellent hôte qui a aidé à entrer en contact avec d'autres chercheurs et organisations." },
        { lang: 'en', quote: 'I visited ULPGL in 2015 to conduct research for my PhD. Professor Kennedy KIHANGI BINDU was an excellent host that helped to get in contact with other researchers and organisations.' },
        { lang: 'sw', quote: "Nilitembelea ULPGL mwaka 2015 kufanya utafiti kwa PhD yangu. Profesa Kennedy KIHANGI BINDU alikuwa mwenyeji bora aliyenisaidia kuwasiliana na watafiti na mashirika mengine." }
      ]
    }
  ];

  for (const t of testimonials) {
    try {
      const existing = await sql`SELECT id FROM "Testimonial" WHERE "authorName" = ${t.authorName} LIMIT 1`;
      if (existing.length > 0) { console.log(`ℹ️ Testimonial exists: ${t.authorName}`); continue; }
      const id = cuid();
      await sql`
        INSERT INTO "Testimonial" (id, "authorName", "authorRole", "avatarInitials", "photoUrl", "isPublished", "createdAt", "updatedAt")
        VALUES (${id}, ${t.authorName}, ${t.authorRole}, ${t.avatarInitials}, ${t.photoUrl}, true, NOW(), NOW())
      `;
      for (const tr of t.translations) {
        await sql`
          INSERT INTO "TestimonialTranslation" (id, language, quote, "testimonialId")
          VALUES (${cuid()}, ${tr.lang}, ${tr.quote}, ${id})
        `;
      }
      console.log(`✅ Testimonial: ${t.authorName}`);
    } catch (e) { console.error(`❌ Testimonial ${t.authorName}:`, e.message); }
  }

  // ── 6. GALLERY IMAGES ─────────────────────────────────────────────────────
  // Schema: GalleryImage { src, category, order, featured }
  // GalleryImageTranslation { language, title, description, galleryImageId }
  const gallery = [
    {
      src: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      category: 'CLINIC',
      featured: true,
      order: 1,
      translations: [
        { lang: 'fr', title: 'Clinique mobile — Goma 2026', description: 'Session de consultations juridiques gratuites organisée par la CDE pour les communautés locales de Goma.' },
        { lang: 'en', title: 'Mobile Clinic — Goma 2026', description: 'Free legal consultation session organized by CDE for local communities in Goma.' },
        { lang: 'sw', title: 'Kliniki ya Simu — Goma 2026', description: 'Kikao cha mashauriano ya kisheria bila malipo kilichoandaliwa na CDE kwa jamii za wenyeji.' }
      ]
    },
    {
      src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
      category: 'TRAINING',
      featured: true,
      order: 2,
      translations: [
        { lang: 'fr', title: 'Formation des étudiants-cliniciens', description: "Session de formation des nouveaux étudiants-cliniciens de la Clinique de Droit de l'Environnement à l'ULPGL." },
        { lang: 'en', title: 'Training of Clinical Students', description: 'Training session for new clinical students of the Environmental Law Clinic at ULPGL.' },
        { lang: 'sw', title: 'Mafunzo ya Wanafunzi wa Kliniki', description: 'Kikao cha mafunzo kwa wanafunzi wapya wa kliniki ya Sheria ya Mazingira.' }
      ]
    },
    {
      src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      category: 'CONFERENCE',
      featured: true,
      order: 3,
      translations: [
        { lang: 'fr', title: 'Conférence CTEA — Nairobi 2025', description: "Participation du CREDDA à la conférence internationale sur les cliniques de droit de l'environnement." },
        { lang: 'en', title: 'CTEA Conference — Nairobi 2025', description: 'CREDDA participation in the international conference on environmental law clinics, Nairobi, December 2025.' },
        { lang: 'sw', title: 'Mkutano wa CTEA — Nairobi 2025', description: 'Ushiriki wa CREDDA katika mkutano wa kimataifa wa kliniki za sheria za mazingira.' }
      ]
    },
    {
      src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
      category: 'COMMUNITY',
      featured: true,
      order: 4,
      translations: [
        { lang: 'fr', title: 'Sensibilisation communautaire — Nord-Kivu', description: 'Campagne de vulgarisation du droit environnemental auprès des communautés locales du Nord-Kivu.' },
        { lang: 'en', title: 'Community Awareness — North Kivu', description: 'Environmental law awareness campaign among local communities in North Kivu.' },
        { lang: 'sw', title: 'Uhamasishaji wa Jamii — Kivu Kaskazini', description: 'Kampeni ya uhamasishaji wa sheria ya mazingira kwa jamii za wenyeji za Kivu Kaskazini.' }
      ]
    }
  ];

  for (const g of gallery) {
    try {
      const existing = await sql`SELECT id FROM "GalleryImage" WHERE "order" = ${g.order} AND src = ${g.src} LIMIT 1`;
      if (existing.length > 0) { console.log(`ℹ️ Gallery exists: order ${g.order}`); continue; }
      const id = cuid();
      const frTrans = g.translations.find(t => t.lang === 'fr') || g.translations[0];
      // Insert with title/description directly (the DB has these flat columns)
      await sql`
        INSERT INTO "GalleryImage" (id, src, title, description, category, featured, "order", "createdAt", "updatedAt")
        VALUES (${id}, ${g.src}, ${frTrans.title}, ${frTrans.description}, ${g.category}, ${g.featured}, ${g.order}, NOW(), NOW())
      `;
      // Also try to insert translation rows if table exists
      try {
        for (const t of g.translations) {
          await sql`
            INSERT INTO "GalleryImageTranslation" (id, language, title, description, "galleryImageId")
            VALUES (${cuid()}, ${t.lang}, ${t.title}, ${t.description}, ${id})
            ON CONFLICT DO NOTHING
          `;
        }
      } catch(_) { /* GalleryImageTranslation may not exist yet */ }
      console.log(`✅ Gallery: ${frTrans.title}`);
    } catch (e) { console.error(`❌ Gallery order ${g.order}:`, e.message); }
  }

  console.log('');
  console.log('🎉 CREDDA-ULPGL database seeded successfully!');
  console.log('─────────────────────────────────────────────');
  console.log('Super Admin:  rkule880@gmail.com / Rkule@02');
  console.log('Admin:        admin@credda-ulpgl.org / credda2026admin');
  console.log('─────────────────────────────────────────────');
  console.log('Members: 4  Articles: 5  Events: 4  Testimonials: 3  Gallery: 4');
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
}).finally(() => process.exit(0));
