// prisma/seed.js
const { PrismaClient, Role, Domain, MediaType } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding CREDDA-ULPGL...\n');

  // ============================================
  // 1. NETTOYAGE DE LA BASE (optionnel)
  // ============================================
  console.log('🧹 Nettoyage des données existantes...');
  
  // L'ordre est important à cause des relations
  await prisma.articleTranslation.deleteMany();
  await prisma.article.deleteMany();
  await prisma.publicationTranslation.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.memberTranslation.deleteMany();
  await prisma.member.deleteMany();
  await prisma.categoryTranslation.deleteMany();
  await prisma.category.deleteMany();
  await prisma.media.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.user.deleteMany(); // Supprimer après les relations
  
  console.log('✅ Nettoyage terminé\n');

  // ============================================
  // 2. CRÉATION DES UTILISATEURS
  // ============================================
  console.log('👤 Création des utilisateurs...');

  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const editorPassword = await bcrypt.hash('Editor123!', 12);
  const researcherPassword = await bcrypt.hash('Researcher123!', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@credda-ulpgl.org',
      password: adminPassword,
      name: 'Dr. Kennedy Kihangi Bindu',
      role: Role.ADMIN,
    },
  });
  console.log('✅ Admin créé:', admin.email);

  const editor = await prisma.user.create({
    data: {
      email: 'editor@credda-ulpgl.org',
      password: editorPassword,
      name: 'Prof. Marie-Goretti Nduwayo',
      role: Role.EDITOR,
    },
  });
  console.log('✅ Éditeur créé:', editor.email);

  const researcher = await prisma.user.create({
    data: {
      email: 'researcher@credda-ulpgl.org',
      password: researcherPassword,
      name: 'Dr. Esther Mukandoli',
      role: Role.RESEARCHER,
    },
  });
  console.log('✅ Chercheur créé:', researcher.email);

  // ============================================
  // 3. CRÉATION DES CATÉGORIES
  // ============================================
  console.log('\n📁 Création des catégories...');

  const categories = [
    {
      slug: 'droit-environnemental',
      fr: 'Droit Environnemental',
      en: 'Environmental Law',
      sw: 'Sheria ya Mazingira',
    },
    {
      slug: 'gouvernance',
      fr: 'Gouvernance et Institutions',
      en: 'Governance & Institutions',
      sw: 'Utawala na Taasisi',
    },
    {
      slug: 'droits-humains',
      fr: 'Droits Humains',
      en: 'Human Rights',
      sw: 'Haki za Binadamu',
    },
    {
      slug: 'justice-climatique',
      fr: 'Justice Climatique',
      en: 'Climate Justice',
      sw: 'Haki ya Hali ya Hewa',
    },
    {
      slug: 'genre-et-developpement',
      fr: 'Genre et Développement',
      en: 'Gender & Development',
      sw: 'Jinsia na Maendeleo',
    },
    {
      slug: 'conflits-et-paix',
      fr: 'Conflits et Consolidation de la Paix',
      en: 'Conflict & Peacebuilding',
      sw: 'Migogoro na Ujenzi wa Amani',
    },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        slug: cat.slug,
        translations: {
          create: [
            { language: 'fr', name: cat.fr },
            { language: 'en', name: cat.en },
            { language: 'sw', name: cat.sw },
          ],
        },
      },
    });
    createdCategories.push(category);
    console.log(`✅ Catégorie: ${cat.fr}`);
  }

  // ============================================
  // 4. CRÉATION DES ARTICLES DE RECHERCHE
  // ============================================
  console.log('\n📝 Création des articles de recherche...');

  const researchArticles = [
    {
      slug: 'gouvernance-miniere-droits-communautes',
      title: 'Gouvernance minière et droits des communautés locales dans l\'est de la RDC',
      excerpt: 'Cette étude examine les impacts socio-environnementaux de l\'exploitation minière artisanale et propose un cadre juridique pour la protection des droits fonciers des communautés.',
      content: `# Gouvernance minière et droits des communautés

## Résumé exécutif

La province du Nord-Kivu connaît une intensification de l'exploitation minière artisanale qui, si elle génère des revenus, engendre également des conflits fonciers récurrents entre communautés locales et entreprises extractives. Cette recherche, menée par le CREDDA-ULPGL entre janvier et décembre 2024, analyse les mécanismes juridiques existants et propose des réformes pour une meilleure protection des droits des communautés.

## Méthodologie

L'étude s'appuie sur une méthodologie mixte :
- 45 entretiens semi-directifs avec des chefs coutumiers, autorités locales et représentants d'entreprises
- 12 focus groups dans les territoires de Masisi, Walikale et Rutshuru
- Analyse de 78 contrats miniers et conventions locales
- Revue de la législation minière congolaise (Code minier 2018 et son règlement)

## Principales conclusions

1. **Insécurité foncière chronique** : 73% des communautés enquêtées ne disposent d'aucun titre foncier formel sur leurs terres ancestrales
2. **Défaut de consultation préalable** : Dans 82% des cas, les communautés n'ont pas été consultées avant l'octroi des permis miniers
3. **Cahiers des charges inexécutés** : Seulement 15% des engagements pris par les entreprises dans les cahiers des charges sont effectivement réalisés
4. **Accès limité à la justice** : Moins de 5% des conflits miniers aboutissent à une décision de justice

## Recommandations

1. **Renforcer le cadre juridique** : Réviser l'article 278 du Code minier pour imposer une obligation de consentement préalable, libre et éclairé des communautés
2. **Créer des cliniques juridiques mobiles** : Déployer des équipes d'avocats dans les zones minières pour faciliter l'accès au droit
3. **Mettre en place un observatoire indépendant** : Suivre et publier annuellement un rapport sur la mise en œuvre des cahiers des charges
4. **Former les magistrats** : Développer un programme de formation spécialisé en contentieux minier et environnemental

## Conclusion

La sécurisation des droits fonciers des communautés et l'accès à la justice constituent des préalables indispensables à une exploitation minière qui bénéficierait réellement aux populations locales. Le CREDDA s'engage à accompagner les réformes nécessaires à travers ses activités de recherche et de clinique juridique.`,
      category: 'droit-environnemental',
      domain: Domain.RESEARCH,
      featured: true,
      published: true,
      mainImage: '/images/research/mining.jpg',
    },
    {
      slug: 'changements-climatiques-migration-grands-lacs',
      title: 'Changements climatiques et migration transfrontalière dans les Grands Lacs',
      excerpt: 'Analyse des flux migratoires liés aux perturbations climatiques et propositions pour un cadre de protection régional.',
      content: `# Changements climatiques et migration transfrontalière

## Contexte

La région des Grands Lacs africains est particulièrement vulnérable aux changements climatiques. La hausse des températures, la modification des régimes pluviométriques et l'intensification des phénomènes météorologiques extrêmes affectent directement les moyens de subsistance des populations, principalement agricoles. Cette recherche documente les liens entre dégradation environnementale et mobilité humaine, et examine les réponses juridiques existantes.

## Impacts observés

- **Érosion côtière** : Le lac Kivu a vu son niveau baisser de 1,5 mètre en 10 ans, affectant les activités de pêche
- **Glissements de terrain** : Les provinces du Nord et Sud-Kivu ont enregistré 23 glissements de terrain majeurs entre 2020-2024
- **Conflits agro-pastoraux** : Augmentation de 40% des conflits liés à l'accès aux pâturages et points d'eau

## Cadre juridique

Le Protocole de l'UA sur la protection des personnes déplacées internes (2009) ne couvre pas spécifiquement les migrants climatiques transfrontaliers. La Convention de Kampala offre une base mais son application reste limitée.

## Recommandations

1. Développer un statut régional de "personne déplacée pour motif environnemental"
2. Créer des mécanismes de coopération transfrontalière pour la gestion des migrations climatiques
3. Intégrer l'adaptation au changement climatique dans les politiques nationales de développement`,
      category: 'justice-climatique',
      domain: Domain.RESEARCH,
      featured: true,
      published: true,
      mainImage: '/images/research/climate.jpg',
    },
    {
      slug: 'justice-transitionnelle-nord-kivu',
      title: 'Justice transitionnelle et réconciliation communautaire au Nord-Kivu',
      excerpt: 'Évaluation des mécanismes locaux de résolution des conflits et recommandations pour une justice inclusive post-conflit.',
      content: `# Justice transitionnelle et réconciliation

## Introduction

Alors que les processus judiciaires formels peinent à répondre aux attentes des victimes des conflits armés dans l'est de la RDC, des mécanismes locaux de justice émergent spontanément. Cette recherche documente ces initiatives et évalue leur potentiel en matière de réconciliation communautaire.

## Mécanismes identifiés

1. **Tribunaux communautaires** : Fonctionnant sur la base du droit coutumier, ils traitent les litiges fonciers et les conflits de voisinage
2. **Cérémonies de réconciliation** : Rituels traditionnels impliquant reconnaissance des torts et compensation symbolique
3. **Comités de paix locaux** : Structures mixtes rassemblant autorités coutumières, religieuses et administratives

## Limites et défis

- Absence de reconnaissance juridique officielle
- Exclusion fréquente des femmes et des jeunes
- Risques de cooptation par les acteurs politiques

## Perspectives

L'articulation entre justice formelle et informelle constitue une piste prometteuse pour une justice transitionnelle contextualisée et inclusive.`,
      category: 'conflits-et-paix',
      domain: Domain.RESEARCH,
      featured: false,
      published: true,
      mainImage: '/images/research/justice.jpg',
    },
  ];

  for (const article of researchArticles) {
    const category = createdCategories.find(c => c.slug === article.category);
    if (category) {
      await prisma.article.create({
        data: {
          slug: article.slug,
          domain: article.domain,
          published: article.published,
          featured: article.featured,
          mainImage: article.mainImage,
          categoryId: category.id,
          translations: {
            create: [
              {
                language: 'fr',
                title: article.title,
                excerpt: article.excerpt,
                content: article.content,
              },
              {
                language: 'en',
                title: article.title, // À traduire idéalement
                excerpt: article.excerpt,
                content: article.content,
              },
            ],
          },
        },
      });
      console.log(`✅ Article: ${article.title}`);
    }
  }

  // ============================================
  // 5. CRÉATION DES ARTICLES CLINIQUES
  // ============================================
  console.log('\n⚖️ Création des articles cliniques...');

  const clinicalArticles = [
    {
      slug: 'accompagnement-communautes-bishusha',
      title: 'Accompagnement des communautés de Bishusha dans la sécurisation foncière',
      excerpt: 'Rapport d\'intervention de la clinique juridique auprès de 450 familles menacées d\'expulsion dans le groupement de Bishusha, territoire de Rutshuru.',
      content: `# Rapport d'intervention clinique - Bishusha

## Contexte

En janvier 2025, la clinique juridique du CREDDA a été saisie par les représentants de 450 familles du groupement de Bishusha (Rutshuru) menacées d'expulsion par une société agro-industrielle revendiquant un titre foncier obtenu en 2018.

## Actions menées

1. **Diagnostic juridique** : Analyse des titres fonciers et de la procédure d'octroi
2. **Médiation** : Organisation de 4 sessions de dialogue entre les parties
3. **Représentation en justice** : Dépôt d'une requête en référé devant le tribunal de paix de Rutshuru
4. **Plaidoyer** : Sensibilisation des autorités administratives locales

## Résultats

- Suspension provisoire de la procédure d'expulsion
- Engagement de la société à négocier une convention de cohabitation pacifique
- Création d'un comité de suivi associant les représentants communautaires

## Perspectives

Un accompagnement juridique à long terme est nécessaire pour sécuriser durablement les droits des familles et prévenir de nouveaux conflits.`,
      category: 'droits-humains',
      domain: Domain.CLINICAL,
      featured: true,
      published: true,
      mainImage: '/images/clinical/bishusha.jpg',
    },
    {
      slug: 'protection-foret-bombo-lumene',
      title: 'Protection de la forêt de Bombo-Lumene contre l\'exploitation illégale',
      excerpt: 'Action de la clinique environnementale pour la préservation du patrimoine forestier et l\'application du code forestier.',
      content: `# Protection de la forêt de Bombo-Lumene

## Contexte

La réserve de Bombo-Lumene, située à 140 km de Kinshasa, subit une pression croissante liée à l'exploitation illégale de bois d'œuvre et au charbonnage. La clinique environnementale du CREDDA a documenté ces infractions et engagé des actions contentieuses.

## Constats

- 12 scieries artisanales illégales recensées
- 450 hectares de forêt dégradés entre 2023-2024
- Complicité présumée d'agents de l'administration forestière

## Actions

1. **Enquête de terrain** : Documentation photographique et géolocalisation des sites d'exploitation
2. **Contentieux administratif** : Saisine du ministre provincial de l'environnement
3. **Action en justice** : Citation directe devant le tribunal de grande instance
4. **Campagne médiatique** : Publication d'un rapport et conférence de presse

## Résultats

- Suspension de 5 permis d'exploitation
- Ouverture d'une enquête par l'Inspection générale de l'environnement
- Saisie de 150 m³ de grumes illégalement exploitées`,
      category: 'droit-environnemental',
      domain: Domain.CLINICAL,
      featured: true,
      published: true,
      mainImage: '/images/clinical/bombo.jpg',
    },
  ];

  for (const article of clinicalArticles) {
    const category = createdCategories.find(c => c.slug === article.category);
    if (category) {
      await prisma.article.create({
        data: {
          slug: article.slug,
          domain: article.domain,
          published: article.published,
          featured: article.featured,
          mainImage: article.mainImage,
          categoryId: category.id,
          translations: {
            create: [
              {
                language: 'fr',
                title: article.title,
                excerpt: article.excerpt,
                content: article.content,
              },
            ],
          },
        },
      });
      console.log(`✅ Article clinique: ${article.title}`);
    }
  }

  // ============================================
  // 6. CRÉATION DES PUBLICATIONS SCIENTIFIQUES
  // ============================================
  console.log('\n📄 Création des publications scientifiques...');

  // prisma/seed.js - EXTRAIT POUR PUBLICATIONS AVEC CONTENU
const publications = [
  {
    year: 2025,
    doi: '10.5281/credda.2025.01',
    pdfUrl: '/publications/gouvernance-miniere-2025.pdf',
    domain: Domain.RESEARCH,
    translations: [
      {
        language: 'fr',
        title: 'Gouvernance minière et développement local dans les provinces de l\'est de la RDC',
        authors: 'Pr. Kennedy Kihangi Bindu, Dr. Marie Uwimana, Prof. Jean-Bosco Bahala',
        description: 'Cette étude analyse les mécanismes de redistribution des revenus miniers...',
        content: `# Gouvernance minière et développement local

## Introduction
La République Démocratique du Congo dispose d'un sous-sol extrêmement riche, mais cette richesse ne profite pas suffisamment aux communautés locales. Cette étude examine...

## Méthodologie
Notre recherche s'appuie sur une enquête de terrain menée dans 12 sites miniers du Nord-Kivu entre janvier et décembre 2024...

## Résultats principaux
1. **Fuite des revenus** : Seulement 15% des quotes-parts atteignent les entités territoriales décentralisées
2. **Défaut de transparence** : 80% des conventions minières ne sont pas publiées
3. **Conflits fonciers** : Augmentation de 40% des litiges liés à l'exploitation minière

## Recommandations
- Renforcer les mécanismes de contrôle parlementaire
- Créer un observatoire citoyen des industries extractives
- Réviser le code minier pour imposer la publication des contrats

## Conclusion
La réforme du secteur minier congolais passe nécessairement par une meilleure redistribution des revenus et une participation effective des communautés locales aux décisions qui les affectent.`
      },
      {
        language: 'en',
        title: 'Mining Governance and Local Development in Eastern DRC',
        authors: 'Prof. Kennedy Kihangi Bindu, Dr. Marie Uwimana, Prof. Jean-Bosco Bahala',
        description: 'This study analyzes mining revenue redistribution mechanisms...',
        content: `# Mining Governance and Local Development

## Introduction
The Democratic Republic of Congo has an extremely rich subsoil, but this wealth does not sufficiently benefit local communities. This study examines...

## Methodology
Our research is based on field surveys conducted in 12 mining sites in North Kivu between January and December 2024...

## Main Findings
1. **Revenue leakage**: Only 15% of mining royalties reach decentralized territorial entities
2. **Lack of transparency**: 80% of mining agreements are not published
3. **Land conflicts**: 40% increase in litigation related to mining operations

## Recommendations
- Strengthen parliamentary oversight mechanisms
- Create a citizen observatory for extractive industries
- Revise the mining code to mandate contract transparency

## Conclusion
Reform of the Congolese mining sector necessarily requires better revenue redistribution and effective participation of local communities in decisions affecting them.`
      }
    ]
  }
];

  for (const pub of publications) {
    await prisma.publication.create({
      data: {
        year: pub.year,
        doi: pub.doi,
        pdfUrl: pub.pdfUrl,
        domain: pub.domain,
        translations: {
          create: pub.translations,
        },
      },
    });
    console.log(`✅ Publication: ${pub.translations[0].title}`);
  }

  // ============================================
  // 7. CRÉATION DES MEMBRES DE L'ÉQUIPE
  // ============================================
  console.log('\n👥 Création des membres de l\'équipe...');

  const members = [
    {
      order: 1,
      email: 'kennedy.kihangi@credda-ulpgl.org',
      image: '/images/team/kennedy-kihangi.jpg',
      translations: [
        {
          language: 'fr',
          name: 'Pr. Dr. Kennedy Kihangi Bindu',
          role: 'Directeur de Recherche',
          bio: 'Professeur ordinaire à la Faculté de Droit de l\'ULPGL, titulaire d\'un doctorat en droit international des droits de l\'homme de l\'Université Catholique de Louvain. Ses recherches portent sur la justice transitionnelle, les droits économiques et sociaux et la gouvernance des ressources naturelles. Il est l\'auteur de plus de 45 publications scientifiques.',
        },
        {
          language: 'en',
          name: 'Prof. Dr. Kennedy Kihangi Bindu',
          role: 'Research Director',
          bio: 'Full professor at the Faculty of Law of ULPGL, holds a PhD in international human rights law from the Catholic University of Louvain. His research focuses on transitional justice, economic and social rights, and natural resource governance. He is the author of over 45 scientific publications.',
        },
      ],
    },
    {
      order: 2,
      email: 'marie.nduwayo@credda-ulpgl.org',
      image: '/images/team/marie-nduwayo.jpg',
      translations: [
        {
          language: 'fr',
          name: 'Prof. Marie-Goretti Nduwayo',
          role: 'Coordinatrice de la Clinique Juridique',
          bio: 'Avocate au barreau du Nord-Kivu et professeure de droit foncier. Elle dirige la clinique juridique du CREDDA depuis 2018 et a accompagné plus de 2000 familles dans la sécurisation de leurs droits fonciers. Elle est membre de plusieurs réseaux régionaux de défense des droits des femmes.',
        },
        {
          language: 'en',
          name: 'Prof. Marie-Goretti Nduwayo',
          role: 'Legal Clinic Coordinator',
          bio: 'Lawyer at the North Kivu Bar and professor of land law. She has headed the CREDDA legal clinic since 2018 and has supported over 2,000 families in securing their land rights. She is a member of several regional women\'s rights networks.',
        },
      ],
    },
    {
      order: 3,
      email: 'esther.mukandoli@credda-ulpgl.org',
      image: '/images/team/esther-mukandoli.jpg',
      translations: [
        {
          language: 'fr',
          name: 'Dr. Esther Mukandoli',
          role: 'Chercheure en droit environnemental',
          bio: 'Docteure en droit de l\'environnement de l\'Université de Kinshasa, ses travaux portent sur la protection des écosystèmes du Bassin du Congo et les droits des communautés autochtones. Elle a participé à l\'élaboration de la stratégie nationale REDD+ et conseille plusieurs organisations de la société civile.',
        },
        {
          language: 'en',
          name: 'Dr. Esther Mukandoli',
          role: 'Environmental Law Researcher',
          bio: 'PhD in environmental law from the University of Kinshasa, her work focuses on the protection of Congo Basin ecosystems and the rights of indigenous communities. She contributed to the national REDD+ strategy and advises several civil society organizations.',
        },
      ],
    },
    {
      order: 4,
      email: 'jean-bosco.bahala@credda-ulpgl.org',
      image: '/images/team/jean-bosco-bahala.jpg',
      translations: [
        {
          language: 'fr',
          name: 'Prof. Jean-Bosco Bahala',
          role: 'Expert en gouvernance minière',
          bio: 'Professeur d\'économie des ressources naturelles, il coordonne l\'observatoire des industries extractives du CREDDA. Il a conduit plusieurs missions d\'expertise pour la Banque Mondiale et le PNUD sur la réforme du secteur minier en RDC.',
        },
        {
          language: 'en',
          name: 'Prof. Jean-Bosco Bahala',
          role: 'Mining Governance Expert',
          bio: 'Professor of natural resource economics, he coordinates CREDDA\'s extractive industries observatory. He has led several expert missions for the World Bank and UNDP on mining sector reform in the DRC.',
        },
      ],
    },
    {
      order: 5,
      email: 'sarah.balagizi@credda-ulpgl.org',
      image: '/images/team/sarah-balagizi.jpg',
      translations: [
        {
          language: 'fr',
          name: 'Prof. Sarah Balagizi',
          role: 'Spécialiste en droits des femmes',
          bio: 'Professeure de droit et avocate, elle dirige le programme "Femmes, Droit et Développement" du CREDDA. Ses recherches portent sur les discriminations légales à l\'égard des femmes et les stratégies de plaidoyer pour des réformes législatives. Elle est autrice de "Le genre dans la jurisprudence constitutionnelle africaine".',
        },
        {
          language: 'en',
          name: 'Prof. Sarah Balagizi',
          role: 'Women\'s Rights Specialist',
          bio: 'Law professor and lawyer, she heads CREDDA\'s "Women, Law and Development" program. Her research focuses on legal discrimination against women and advocacy strategies for legislative reform. She is the author of "Gender in African Constitutional Jurisprudence".',
        },
      ],
    },
  ];

  for (const member of members) {
    await prisma.member.create({
      data: {
        order: member.order,
        email: member.email,
        image: member.image,
        translations: {
          create: member.translations,
        },
      },
    });
    console.log(`✅ Membre: ${member.translations[0].name}`);
  }

  // ============================================
  // 8. CRÉATION DES MESSAGES DE CONTACT (EXEMPLES)
  // ============================================
  console.log('\n💬 Création de messages de contact...');

  const contactMessages = [
    {
      name: 'David Michael Peyton',
      email: 'david.peyton@northwestern.edu',
      subject: 'Demande de partenariat scientifique',
      message: `Dear CREDDA team,

I am a PhD candidate at Northwestern University researching transitional justice mechanisms in post-conflict societies. I would be very interested in exploring potential collaboration with your research center for my fieldwork in North Kivu.

I plan to be in Goma from June to August 2025 and would welcome the opportunity to meet with your team and discuss possible synergies between my research and your ongoing projects.

Best regards,
David Michael Peyton`,
      isRead: true,
      replyContent: `Cher David,

Nous vous remercions vivement pour votre intérêt pour les activités de recherche du CREDDA. Nous serions ravis de vous accueillir lors de votre séjour à Goma.

Notre équipe travaille actuellement sur plusieurs projets relatifs à la justice transitionnelle qui pourraient effectivement présenter des synergies avec vos recherches. Je vous invite à nous contacter à votre arrivée pour organiser une rencontre avec notre directeur de recherche.

Bien cordialement,
Secrétariat CREDDA-ULPGL`,
      repliedAt: new Date('2025-02-10'),
    },
    {
      name: 'Heather Lynne Zimmerman',
      email: 'h.zimmerman@lse.ac.uk',
      subject: 'Research collaboration request',
      message: `Dear Professor Kihangi,

I am a Masters student at the London School of Economics working on my dissertation on climate change adaptation policies in the Great Lakes region.

I had the opportunity to read your publications on environmental justice and I am very impressed by the work of CREDDA. I would be grateful for any guidance or resources you could share on this topic.

Thank you for your consideration.

Sincerely,
Heather Zimmerman`,
      isRead: false,
    },
    {
      name: 'Britta Sjöstedt',
      email: 'britta.sjostedt@jur.lu.se',
      subject: 'Visiting researcher - Lund University',
      message: `Dear Professor Kennedy KIHANGI BINDU,

I am writing to recall my visit to ULPGL in 2015 during my PhD research. It was a wonderful experience and I am still grateful for your warm welcome and the connections you helped me establish.

I am now leading a research project on legal frameworks for biodiversity protection in conflict-affected areas, and I would be very interested in renewing our collaboration. Would it be possible to arrange a virtual meeting to discuss potential joint activities?

Looking forward to hearing from you.

Best regards,
Britta Sjöstedt
Associate Professor, Lund University`,
      isRead: true,
      replyContent: `Dear Britta,

What a pleasure to hear from you! I remember your visit to Goma very well and the excellent work you conducted during your PhD.

We would be delighted to collaborate on this new research project. Our environmental law clinic has developed significant expertise in this area and we have several ongoing cases related to biodiversity protection in the Virunga National Park.

I suggest we schedule a videoconference next week. Please let me know your availability.

Warm regards,
Pr. Kennedy Kihangi Bindu`,
      repliedAt: new Date('2025-02-12'),
    },
  ];

  for (const msg of contactMessages) {
    await prisma.contactMessage.create({
      data: {
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        isRead: msg.isRead,
        replyContent: msg.replyContent,
        repliedAt: msg.repliedAt,
      },
    });
    console.log(`✅ Message: ${msg.subject}`);
  }

  // ============================================
  // 9. CRÉATION DES MÉDIAS (EXEMPLES)
  // ============================================
  console.log('\n🖼️ Création des médias...');

  await prisma.media.createMany({
    data: [
      {
        type: MediaType.IMAGE,
        url: '/images/gallery/credda-conference-2025.jpg',
        title: 'Conférence annuelle du CREDDA 2025',
      },
      {
        type: MediaType.IMAGE,
        url: '/images/gallery/clinique-mobile-rutshuru.jpg',
        title: 'Clinique juridique mobile à Rutshuru',
      },
      {
        type: MediaType.VIDEO_LINK,
        url: 'https://youtu.be/example',
        title: 'Présentation du CREDDA-ULPGL',
      },
    ],
  });
  console.log('✅ Médias créés');

  // ============================================
  // 10. RÉCAPITULATIF FINAL
  // ============================================
  console.log('\n' + '='.repeat(50));
  console.log('🎉 SEED TERMINÉ AVEC SUCCÈS !');
  console.log('='.repeat(50));
  console.log(`\n📊 RÉCAPITULATIF:`);
  console.log(`   - ${await prisma.user.count()} utilisateurs`);
  console.log(`   - ${await prisma.category.count()} catégories`);
  console.log(`   - ${await prisma.article.count()} articles`);
  console.log(`   - ${await prisma.publication.count()} publications`);
  console.log(`   - ${await prisma.member.count()} membres d'équipe`);
  console.log(`   - ${await prisma.contactMessage.count()} messages`);
  console.log(`   - ${await prisma.media.count()} médias`);
  console.log('\n' + '='.repeat(50));
  console.log('\n🔐 IDENTIFIANTS DE CONNEXION :');
  console.log('   Admin     : admin@credda-ulpgl.org / Admin123!');
  console.log('   Éditeur   : editor@credda-ulpgl.org / Editor123!');
  console.log('   Chercheur : researcher@credda-ulpgl.org / Researcher123!');
  console.log('\n' + '='.repeat(50));
}

main()
  .catch((e) => {
    console.error('\n❌ ERREUR DURANT LE SEEDING:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });