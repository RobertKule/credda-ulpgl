var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// prisma/seed.js
var _a = require('@prisma/client'), PrismaClient = _a.PrismaClient, Role = _a.Role, Domain = _a.Domain, MediaType = _a.MediaType;
var bcrypt = require('bcryptjs');
var prisma = new PrismaClient();
// Fonction utilitaire pour générer un slug
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[éèêë]/g, 'e')
        .replace(/[àâä]/g, 'a')
        .replace(/[ùûü]/g, 'u')
        .replace(/[ôö]/g, 'o')
        .replace(/[îï]/g, 'i')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
function generateUniqueSlug(title_1) {
    return __awaiter(this, arguments, void 0, function (title, counter) {
        var baseSlug, slug, existing;
        if (counter === void 0) { counter = 0; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseSlug = generateSlug(title);
                    slug = counter > 0 ? "".concat(baseSlug, "-").concat(counter) : baseSlug;
                    return [4 /*yield*/, prisma.publication.findUnique({
                            where: { slug: slug }
                        })];
                case 1:
                    existing = _a.sent();
                    if (existing) {
                        return [2 /*return*/, generateUniqueSlug(title, counter + 1)];
                    }
                    return [2 /*return*/, slug];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var adminPassword, editorPassword, researcherPassword, admin, editor, researcher, categories, createdCategories, _i, categories_1, cat, category, researchArticles, _loop_1, _a, researchArticles_1, article, clinicalArticles, _loop_2, _b, clinicalArticles_1, article, publications, _c, publications_1, pub, slug, members, _d, members_1, member, contactMessages, _e, contactMessages_1, msg, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
        return __generator(this, function (_2) {
            switch (_2.label) {
                case 0:
                    console.log('🌱 Début du seeding CREDDA-ULPGL...\n');
                    // ============================================
                    // 1. NETTOYAGE DE LA BASE
                    // ============================================
                    console.log('🧹 Nettoyage des données existantes...');
                    return [4 /*yield*/, prisma.articleTranslation.deleteMany()];
                case 1:
                    _2.sent();
                    return [4 /*yield*/, prisma.article.deleteMany()];
                case 2:
                    _2.sent();
                    return [4 /*yield*/, prisma.publicationTranslation.deleteMany()];
                case 3:
                    _2.sent();
                    return [4 /*yield*/, prisma.publication.deleteMany()];
                case 4:
                    _2.sent();
                    return [4 /*yield*/, prisma.memberTranslation.deleteMany()];
                case 5:
                    _2.sent();
                    return [4 /*yield*/, prisma.member.deleteMany()];
                case 6:
                    _2.sent();
                    return [4 /*yield*/, prisma.categoryTranslation.deleteMany()];
                case 7:
                    _2.sent();
                    return [4 /*yield*/, prisma.category.deleteMany()];
                case 8:
                    _2.sent();
                    return [4 /*yield*/, prisma.media.deleteMany()];
                case 9:
                    _2.sent();
                    return [4 /*yield*/, prisma.contactMessage.deleteMany()];
                case 10:
                    _2.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 11:
                    _2.sent();
                    console.log('✅ Nettoyage terminé\n');
                    // ============================================
                    // 2. CRÉATION DES UTILISATEURS
                    // ============================================
                    console.log('👤 Création des utilisateurs...');
                    return [4 /*yield*/, bcrypt.hash('Admin123!', 12)];
                case 12:
                    adminPassword = _2.sent();
                    return [4 /*yield*/, bcrypt.hash('Editor123!', 12)];
                case 13:
                    editorPassword = _2.sent();
                    return [4 /*yield*/, bcrypt.hash('Researcher123!', 12)];
                case 14:
                    researcherPassword = _2.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'admin@credda-ulpgl.org',
                                password: adminPassword,
                                name: 'Dr. Kennedy Kihangi Bindu',
                                role: Role.ADMIN,
                            },
                        })];
                case 15:
                    admin = _2.sent();
                    console.log('✅ Admin créé:', admin.email);
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'editor@credda-ulpgl.org',
                                password: editorPassword,
                                name: 'Prof. Marie-Goretti Nduwayo',
                                role: Role.EDITOR,
                            },
                        })];
                case 16:
                    editor = _2.sent();
                    console.log('✅ Éditeur créé:', editor.email);
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'researcher@credda-ulpgl.org',
                                password: researcherPassword,
                                name: 'Dr. Esther Mukandoli',
                                role: Role.RESEARCHER,
                            },
                        })];
                case 17:
                    researcher = _2.sent();
                    console.log('✅ Chercheur créé:', researcher.email);
                    // ============================================
                    // 3. CRÉATION DES CATÉGORIES
                    // ============================================
                    console.log('\n📁 Création des catégories...');
                    categories = [
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
                    createdCategories = [];
                    _i = 0, categories_1 = categories;
                    _2.label = 18;
                case 18:
                    if (!(_i < categories_1.length)) return [3 /*break*/, 21];
                    cat = categories_1[_i];
                    return [4 /*yield*/, prisma.category.create({
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
                        })];
                case 19:
                    category = _2.sent();
                    createdCategories.push(category);
                    console.log("\u2705 Cat\u00E9gorie: ".concat(cat.fr));
                    _2.label = 20;
                case 20:
                    _i++;
                    return [3 /*break*/, 18];
                case 21:
                    // ============================================
                    // 4. CRÉATION DES ARTICLES DE RECHERCHE
                    // ============================================
                    console.log('\n📝 Création des articles de recherche...');
                    researchArticles = [
                        {
                            slug: 'gouvernance-miniere-droits-communautes',
                            title: 'Gouvernance minière et droits des communautés locales dans l\'est de la RDC',
                            excerpt: 'Cette étude examine les impacts socio-environnementaux de l\'exploitation minière artisanale et propose un cadre juridique pour la protection des droits fonciers des communautés.',
                            content: "# Gouvernance mini\u00E8re et droits des communaut\u00E9s\n\n## R\u00E9sum\u00E9 ex\u00E9cutif\n\nLa province du Nord-Kivu conna\u00EEt une intensification de l'exploitation mini\u00E8re artisanale qui, si elle g\u00E9n\u00E8re des revenus, engendre \u00E9galement des conflits fonciers r\u00E9currents entre communaut\u00E9s locales et entreprises extractives. Cette recherche, men\u00E9e par le CREDDA-ULPGL entre janvier et d\u00E9cembre 2024, analyse les m\u00E9canismes juridiques existants et propose des r\u00E9formes pour une meilleure protection des droits des communaut\u00E9s.\n\n## M\u00E9thodologie\n\nL'\u00E9tude s'appuie sur une m\u00E9thodologie mixte :\n- 45 entretiens semi-directifs avec des chefs coutumiers, autorit\u00E9s locales et repr\u00E9sentants d'entreprises\n- 12 focus groups dans les territoires de Masisi, Walikale et Rutshuru\n- Analyse de 78 contrats miniers et conventions locales\n- Revue de la l\u00E9gislation mini\u00E8re congolaise (Code minier 2018 et son r\u00E8glement)\n\n## Principales conclusions\n\n1. **Ins\u00E9curit\u00E9 fonci\u00E8re chronique** : 73% des communaut\u00E9s enqu\u00EAt\u00E9es ne disposent d'aucun titre foncier formel sur leurs terres ancestrales\n2. **D\u00E9faut de consultation pr\u00E9alable** : Dans 82% des cas, les communaut\u00E9s n'ont pas \u00E9t\u00E9 consult\u00E9es avant l'octroi des permis miniers\n3. **Cahiers des charges inex\u00E9cut\u00E9s** : Seulement 15% des engagements pris par les entreprises dans les cahiers des charges sont effectivement r\u00E9alis\u00E9s\n4. **Acc\u00E8s limit\u00E9 \u00E0 la justice** : Moins de 5% des conflits miniers aboutissent \u00E0 une d\u00E9cision de justice\n\n## Recommandations\n\n1. **Renforcer le cadre juridique** : R\u00E9viser l'article 278 du Code minier pour imposer une obligation de consentement pr\u00E9alable, libre et \u00E9clair\u00E9 des communaut\u00E9s\n2. **Cr\u00E9er des cliniques juridiques mobiles** : D\u00E9ployer des \u00E9quipes d'avocats dans les zones mini\u00E8res pour faciliter l'acc\u00E8s au droit\n3. **Mettre en place un observatoire ind\u00E9pendant** : Suivre et publier annuellement un rapport sur la mise en \u0153uvre des cahiers des charges\n4. **Former les magistrats** : D\u00E9velopper un programme de formation sp\u00E9cialis\u00E9 en contentieux minier et environnemental\n\n## Conclusion\n\nLa s\u00E9curisation des droits fonciers des communaut\u00E9s et l'acc\u00E8s \u00E0 la justice constituent des pr\u00E9alables indispensables \u00E0 une exploitation mini\u00E8re qui b\u00E9n\u00E9ficierait r\u00E9ellement aux populations locales. Le CREDDA s'engage \u00E0 accompagner les r\u00E9formes n\u00E9cessaires \u00E0 travers ses activit\u00E9s de recherche et de clinique juridique.",
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
                            content: "# Changements climatiques et migration transfrontali\u00E8re\n\n## Contexte\n\nLa r\u00E9gion des Grands Lacs africains est particuli\u00E8rement vuln\u00E9rable aux changements climatiques. La hausse des temp\u00E9ratures, la modification des r\u00E9gimes pluviom\u00E9triques et l'intensification des ph\u00E9nom\u00E8nes m\u00E9t\u00E9orologiques extr\u00EAmes affectent directement les moyens de subsistance des populations, principalement agricoles. Cette recherche documente les liens entre d\u00E9gradation environnementale et mobilit\u00E9 humaine, et examine les r\u00E9ponses juridiques existantes.\n\n## Impacts observ\u00E9s\n\n- **\u00C9rosion c\u00F4ti\u00E8re** : Le lac Kivu a vu son niveau baisser de 1,5 m\u00E8tre en 10 ans, affectant les activit\u00E9s de p\u00EAche\n- **Glissements de terrain** : Les provinces du Nord et Sud-Kivu ont enregistr\u00E9 23 glissements de terrain majeurs entre 2020-2024\n- **Conflits agro-pastoraux** : Augmentation de 40% des conflits li\u00E9s \u00E0 l'acc\u00E8s aux p\u00E2turages et points d'eau\n\n## Cadre juridique\n\nLe Protocole de l'UA sur la protection des personnes d\u00E9plac\u00E9es internes (2009) ne couvre pas sp\u00E9cifiquement les migrants climatiques transfrontaliers. La Convention de Kampala offre une base mais son application reste limit\u00E9e.\n\n## Recommandations\n\n1. D\u00E9velopper un statut r\u00E9gional de \"personne d\u00E9plac\u00E9e pour motif environnemental\"\n2. Cr\u00E9er des m\u00E9canismes de coop\u00E9ration transfrontali\u00E8re pour la gestion des migrations climatiques\n3. Int\u00E9grer l'adaptation au changement climatique dans les politiques nationales de d\u00E9veloppement",
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
                            content: "# Justice transitionnelle et r\u00E9conciliation\n\n## Introduction\n\nAlors que les processus judiciaires formels peinent \u00E0 r\u00E9pondre aux attentes des victimes des conflits arm\u00E9s dans l'est de la RDC, des m\u00E9canismes locaux de justice \u00E9mergent spontan\u00E9ment. Cette recherche documente ces initiatives et \u00E9value leur potentiel en mati\u00E8re de r\u00E9conciliation communautaire.\n\n## M\u00E9canismes identifi\u00E9s\n\n1. **Tribunaux communautaires** : Fonctionnant sur la base du droit coutumier, ils traitent les litiges fonciers et les conflits de voisinage\n2. **C\u00E9r\u00E9monies de r\u00E9conciliation** : Rituels traditionnels impliquant reconnaissance des torts et compensation symbolique\n3. **Comit\u00E9s de paix locaux** : Structures mixtes rassemblant autorit\u00E9s coutumi\u00E8res, religieuses et administratives\n\n## Limites et d\u00E9fis\n\n- Absence de reconnaissance juridique officielle\n- Exclusion fr\u00E9quente des femmes et des jeunes\n- Risques de cooptation par les acteurs politiques\n\n## Perspectives\n\nL'articulation entre justice formelle et informelle constitue une piste prometteuse pour une justice transitionnelle contextualis\u00E9e et inclusive.",
                            category: 'conflits-et-paix',
                            domain: Domain.RESEARCH,
                            featured: false,
                            published: true,
                            mainImage: '/images/research/justice.jpg',
                        },
                    ];
                    _loop_1 = function (article) {
                        var category;
                        return __generator(this, function (_3) {
                            switch (_3.label) {
                                case 0:
                                    category = createdCategories.find(function (c) { return c.slug === article.category; });
                                    if (!category) return [3 /*break*/, 2];
                                    return [4 /*yield*/, prisma.article.create({
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
                                                            title: article.title,
                                                            excerpt: article.excerpt,
                                                            content: article.content,
                                                        },
                                                    ],
                                                },
                                            },
                                        })];
                                case 1:
                                    _3.sent();
                                    console.log("\u2705 Article: ".concat(article.title));
                                    _3.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    _a = 0, researchArticles_1 = researchArticles;
                    _2.label = 22;
                case 22:
                    if (!(_a < researchArticles_1.length)) return [3 /*break*/, 25];
                    article = researchArticles_1[_a];
                    return [5 /*yield**/, _loop_1(article)];
                case 23:
                    _2.sent();
                    _2.label = 24;
                case 24:
                    _a++;
                    return [3 /*break*/, 22];
                case 25:
                    // ============================================
                    // 5. CRÉATION DES ARTICLES CLINIQUES
                    // ============================================
                    console.log('\n⚖️ Création des articles cliniques...');
                    clinicalArticles = [
                        {
                            slug: 'accompagnement-communautes-bishusha',
                            title: 'Accompagnement des communautés de Bishusha dans la sécurisation foncière',
                            excerpt: 'Rapport d\'intervention de la clinique juridique auprès de 450 familles menacées d\'expulsion dans le groupement de Bishusha, territoire de Rutshuru.',
                            content: "# Rapport d'intervention clinique - Bishusha\n\n## Contexte\n\nEn janvier 2025, la clinique juridique du CREDDA a \u00E9t\u00E9 saisie par les repr\u00E9sentants de 450 familles du groupement de Bishusha (Rutshuru) menac\u00E9es d'expulsion par une soci\u00E9t\u00E9 agro-industrielle revendiquant un titre foncier obtenu en 2018.\n\n## Actions men\u00E9es\n\n1. **Diagnostic juridique** : Analyse des titres fonciers et de la proc\u00E9dure d'octroi\n2. **M\u00E9diation** : Organisation de 4 sessions de dialogue entre les parties\n3. **Repr\u00E9sentation en justice** : D\u00E9p\u00F4t d'une requ\u00EAte en r\u00E9f\u00E9r\u00E9 devant le tribunal de paix de Rutshuru\n4. **Plaidoyer** : Sensibilisation des autorit\u00E9s administratives locales\n\n## R\u00E9sultats\n\n- Suspension provisoire de la proc\u00E9dure d'expulsion\n- Engagement de la soci\u00E9t\u00E9 \u00E0 n\u00E9gocier une convention de cohabitation pacifique\n- Cr\u00E9ation d'un comit\u00E9 de suivi associant les repr\u00E9sentants communautaires\n\n## Perspectives\n\nUn accompagnement juridique \u00E0 long terme est n\u00E9cessaire pour s\u00E9curiser durablement les droits des familles et pr\u00E9venir de nouveaux conflits.",
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
                            content: "# Protection de la for\u00EAt de Bombo-Lumene\n\n## Contexte\n\nLa r\u00E9serve de Bombo-Lumene, situ\u00E9e \u00E0 140 km de Kinshasa, subit une pression croissante li\u00E9e \u00E0 l'exploitation ill\u00E9gale de bois d'\u0153uvre et au charbonnage. La clinique environnementale du CREDDA a document\u00E9 ces infractions et engag\u00E9 des actions contentieuses.\n\n## Constats\n\n- 12 scieries artisanales ill\u00E9gales recens\u00E9es\n- 450 hectares de for\u00EAt d\u00E9grad\u00E9s entre 2023-2024\n- Complicit\u00E9 pr\u00E9sum\u00E9e d'agents de l'administration foresti\u00E8re\n\n## Actions\n\n1. **Enqu\u00EAte de terrain** : Documentation photographique et g\u00E9olocalisation des sites d'exploitation\n2. **Contentieux administratif** : Saisine du ministre provincial de l'environnement\n3. **Action en justice** : Citation directe devant le tribunal de grande instance\n4. **Campagne m\u00E9diatique** : Publication d'un rapport et conf\u00E9rence de presse\n\n## R\u00E9sultats\n\n- Suspension de 5 permis d'exploitation\n- Ouverture d'une enqu\u00EAte par l'Inspection g\u00E9n\u00E9rale de l'environnement\n- Saisie de 150 m\u00B3 de grumes ill\u00E9galement exploit\u00E9es",
                            category: 'droit-environnemental',
                            domain: Domain.CLINICAL,
                            featured: true,
                            published: true,
                            mainImage: '/images/clinical/bombo.jpg',
                        },
                    ];
                    _loop_2 = function (article) {
                        var category;
                        return __generator(this, function (_4) {
                            switch (_4.label) {
                                case 0:
                                    category = createdCategories.find(function (c) { return c.slug === article.category; });
                                    if (!category) return [3 /*break*/, 2];
                                    return [4 /*yield*/, prisma.article.create({
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
                                        })];
                                case 1:
                                    _4.sent();
                                    console.log("\u2705 Article clinique: ".concat(article.title));
                                    _4.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    _b = 0, clinicalArticles_1 = clinicalArticles;
                    _2.label = 26;
                case 26:
                    if (!(_b < clinicalArticles_1.length)) return [3 /*break*/, 29];
                    article = clinicalArticles_1[_b];
                    return [5 /*yield**/, _loop_2(article)];
                case 27:
                    _2.sent();
                    _2.label = 28;
                case 28:
                    _b++;
                    return [3 /*break*/, 26];
                case 29:
                    // ============================================
                    // 6. CRÉATION DES PUBLICATIONS SCIENTIFIQUES
                    // ============================================
                    console.log('\n📄 Création des publications scientifiques...');
                    publications = [
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
                                    content: "# Gouvernance mini\u00E8re et d\u00E9veloppement local\n\n## Introduction\nLa R\u00E9publique D\u00E9mocratique du Congo dispose d'un sous-sol extr\u00EAmement riche, mais cette richesse ne profite pas suffisamment aux communaut\u00E9s locales. Cette \u00E9tude examine...\n\n## M\u00E9thodologie\nNotre recherche s'appuie sur une enqu\u00EAte de terrain men\u00E9e dans 12 sites miniers du Nord-Kivu entre janvier et d\u00E9cembre 2024...\n\n## R\u00E9sultats principaux\n1. **Fuite des revenus** : Seulement 15% des quotes-parts atteignent les entit\u00E9s territoriales d\u00E9centralis\u00E9es\n2. **D\u00E9faut de transparence** : 80% des conventions mini\u00E8res ne sont pas publi\u00E9es\n3. **Conflits fonciers** : Augmentation de 40% des litiges li\u00E9s \u00E0 l'exploitation mini\u00E8re\n\n## Recommandations\n- Renforcer les m\u00E9canismes de contr\u00F4le parlementaire\n- Cr\u00E9er un observatoire citoyen des industries extractives\n- R\u00E9viser le code minier pour imposer la publication des contrats\n\n## Conclusion\nLa r\u00E9forme du secteur minier congolais passe n\u00E9cessairement par une meilleure redistribution des revenus et une participation effective des communaut\u00E9s locales aux d\u00E9cisions qui les affectent."
                                },
                                {
                                    language: 'en',
                                    title: 'Mining Governance and Local Development in Eastern DRC',
                                    authors: 'Prof. Kennedy Kihangi Bindu, Dr. Marie Uwimana, Prof. Jean-Bosco Bahala',
                                    description: 'This study analyzes mining revenue redistribution mechanisms...',
                                    content: "# Mining Governance and Local Development\n\n## Introduction\nThe Democratic Republic of Congo has an extremely rich subsoil, but this wealth does not sufficiently benefit local communities. This study examines...\n\n## Methodology\nOur research is based on field surveys conducted in 12 mining sites in North Kivu between January and December 2024...\n\n## Main Findings\n1. **Revenue leakage**: Only 15% of mining royalties reach decentralized territorial entities\n2. **Lack of transparency**: 80% of mining agreements are not published\n3. **Land conflicts**: 40% increase in litigation related to mining operations\n\n## Recommendations\n- Strengthen parliamentary oversight mechanisms\n- Create a citizen observatory for extractive industries\n- Revise the mining code to mandate contract transparency\n\n## Conclusion\nReform of the Congolese mining sector necessarily requires better revenue redistribution and effective participation of local communities in decisions affecting them."
                                }
                            ]
                        }
                    ];
                    _c = 0, publications_1 = publications;
                    _2.label = 30;
                case 30:
                    if (!(_c < publications_1.length)) return [3 /*break*/, 34];
                    pub = publications_1[_c];
                    return [4 /*yield*/, generateUniqueSlug(pub.translations[0].title)];
                case 31:
                    slug = _2.sent();
                    return [4 /*yield*/, prisma.publication.create({
                            data: {
                                slug: slug, // ✅ Champ requis AJOUTÉ
                                year: pub.year,
                                doi: pub.doi,
                                pdfUrl: pub.pdfUrl,
                                domain: pub.domain,
                                translations: {
                                    create: pub.translations,
                                },
                            },
                        })];
                case 32:
                    _2.sent();
                    console.log("\u2705 Publication: ".concat(pub.translations[0].title, " (slug: ").concat(slug, ")"));
                    _2.label = 33;
                case 33:
                    _c++;
                    return [3 /*break*/, 30];
                case 34:
                    // ============================================
                    // 7. CRÉATION DES MEMBRES DE L'ÉQUIPE
                    // ============================================
                    console.log('\n👥 Création des membres de l\'équipe...');
                    members = [
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
                    _d = 0, members_1 = members;
                    _2.label = 35;
                case 35:
                    if (!(_d < members_1.length)) return [3 /*break*/, 38];
                    member = members_1[_d];
                    return [4 /*yield*/, prisma.member.create({
                            data: {
                                order: member.order,
                                email: member.email,
                                image: member.image,
                                translations: {
                                    create: member.translations,
                                },
                            },
                        })];
                case 36:
                    _2.sent();
                    console.log("\u2705 Membre: ".concat(member.translations[0].name));
                    _2.label = 37;
                case 37:
                    _d++;
                    return [3 /*break*/, 35];
                case 38:
                    // ============================================
                    // 8. CRÉATION DES MESSAGES DE CONTACT
                    // ============================================
                    console.log('\n💬 Création de messages de contact...');
                    contactMessages = [
                        {
                            name: 'David Michael Peyton',
                            email: 'david.peyton@northwestern.edu',
                            subject: 'Demande de partenariat scientifique',
                            message: "Dear CREDDA team,\n\nI am a PhD candidate at Northwestern University researching transitional justice mechanisms in post-conflict societies. I would be very interested in exploring potential collaboration with your research center for my fieldwork in North Kivu.\n\nI plan to be in Goma from June to August 2025 and would welcome the opportunity to meet with your team and discuss possible synergies between my research and your ongoing projects.\n\nBest regards,\nDavid Michael Peyton",
                            isRead: true,
                            replyContent: "Cher David,\n\nNous vous remercions vivement pour votre int\u00E9r\u00EAt pour les activit\u00E9s de recherche du CREDDA. Nous serions ravis de vous accueillir lors de votre s\u00E9jour \u00E0 Goma.\n\nNotre \u00E9quipe travaille actuellement sur plusieurs projets relatifs \u00E0 la justice transitionnelle qui pourraient effectivement pr\u00E9senter des synergies avec vos recherches. Je vous invite \u00E0 nous contacter \u00E0 votre arriv\u00E9e pour organiser une rencontre avec notre directeur de recherche.\n\nBien cordialement,\nSecr\u00E9tariat CREDDA-ULPGL",
                            repliedAt: new Date('2025-02-10'),
                        },
                        {
                            name: 'Heather Lynne Zimmerman',
                            email: 'h.zimmerman@lse.ac.uk',
                            subject: 'Research collaboration request',
                            message: "Dear Professor Kihangi,\n\nI am a Masters student at the London School of Economics working on my dissertation on climate change adaptation policies in the Great Lakes region.\n\nI had the opportunity to read your publications on environmental justice and I am very impressed by the work of CREDDA. I would be grateful for any guidance or resources you could share on this topic.\n\nThank you for your consideration.\n\nSincerely,\nHeather Zimmerman",
                            isRead: false,
                        },
                        {
                            name: 'Britta Sjöstedt',
                            email: 'britta.sjostedt@jur.lu.se',
                            subject: 'Visiting researcher - Lund University',
                            message: "Dear Professor Kennedy KIHANGI BINDU,\n\nI am writing to recall my visit to ULPGL in 2015 during my PhD research. It was a wonderful experience and I am still grateful for your warm welcome and the connections you helped me establish.\n\nI am now leading a research project on legal frameworks for biodiversity protection in conflict-affected areas, and I would be very interested in renewing our collaboration. Would it be possible to arrange a virtual meeting to discuss potential joint activities?\n\nLooking forward to hearing from you.\n\nBest regards,\nBritta Sj\u00F6stedt\nAssociate Professor, Lund University",
                            isRead: true,
                            replyContent: "Dear Britta,\n\nWhat a pleasure to hear from you! I remember your visit to Goma very well and the excellent work you conducted during your PhD.\n\nWe would be delighted to collaborate on this new research project. Our environmental law clinic has developed significant expertise in this area and we have several ongoing cases related to biodiversity protection in the Virunga National Park.\n\nI suggest we schedule a videoconference next week. Please let me know your availability.\n\nWarm regards,\nPr. Kennedy Kihangi Bindu",
                            repliedAt: new Date('2025-02-12'),
                        },
                    ];
                    _e = 0, contactMessages_1 = contactMessages;
                    _2.label = 39;
                case 39:
                    if (!(_e < contactMessages_1.length)) return [3 /*break*/, 42];
                    msg = contactMessages_1[_e];
                    return [4 /*yield*/, prisma.contactMessage.create({
                            data: {
                                name: msg.name,
                                email: msg.email,
                                subject: msg.subject,
                                message: msg.message,
                                isRead: msg.isRead,
                                replyContent: msg.replyContent,
                                repliedAt: msg.repliedAt,
                            },
                        })];
                case 40:
                    _2.sent();
                    console.log("\u2705 Message: ".concat(msg.subject));
                    _2.label = 41;
                case 41:
                    _e++;
                    return [3 /*break*/, 39];
                case 42:
                    // ============================================
                    // 9. CRÉATION DES MÉDIAS
                    // ============================================
                    console.log('\n🖼️ Création des médias...');
                    return [4 /*yield*/, prisma.media.createMany({
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
                        })];
                case 43:
                    _2.sent();
                    console.log('✅ Médias créés');
                    // ============================================
                    // 10. RÉCAPITULATIF FINAL
                    // ============================================
                    console.log('\n' + '='.repeat(50));
                    console.log('🎉 SEED TERMINÉ AVEC SUCCÈS !');
                    console.log('='.repeat(50));
                    console.log("\n\uD83D\uDCCA R\u00C9CAPITULATIF:");
                    _g = (_f = console).log;
                    _h = "   - ".concat;
                    return [4 /*yield*/, prisma.user.count()];
                case 44:
                    _g.apply(_f, [_h.apply("   - ", [_2.sent(), " utilisateurs"])]);
                    _k = (_j = console).log;
                    _l = "   - ".concat;
                    return [4 /*yield*/, prisma.category.count()];
                case 45:
                    _k.apply(_j, [_l.apply("   - ", [_2.sent(), " cat\u00E9gories"])]);
                    _o = (_m = console).log;
                    _p = "   - ".concat;
                    return [4 /*yield*/, prisma.article.count()];
                case 46:
                    _o.apply(_m, [_p.apply("   - ", [_2.sent(), " articles"])]);
                    _r = (_q = console).log;
                    _s = "   - ".concat;
                    return [4 /*yield*/, prisma.publication.count()];
                case 47:
                    _r.apply(_q, [_s.apply("   - ", [_2.sent(), " publications"])]);
                    _u = (_t = console).log;
                    _v = "   - ".concat;
                    return [4 /*yield*/, prisma.member.count()];
                case 48:
                    _u.apply(_t, [_v.apply("   - ", [_2.sent(), " membres d'\u00E9quipe"])]);
                    _x = (_w = console).log;
                    _y = "   - ".concat;
                    return [4 /*yield*/, prisma.contactMessage.count()];
                case 49:
                    _x.apply(_w, [_y.apply("   - ", [_2.sent(), " messages"])]);
                    _0 = (_z = console).log;
                    _1 = "   - ".concat;
                    return [4 /*yield*/, prisma.media.count()];
                case 50:
                    _0.apply(_z, [_1.apply("   - ", [_2.sent(), " m\u00E9dias"])]);
                    console.log('\n' + '='.repeat(50));
                    console.log('\n🔐 IDENTIFIANTS DE CONNEXION :');
                    console.log('   Admin     : admin@credda-ulpgl.org / Admin123!');
                    console.log('   Éditeur   : editor@credda-ulpgl.org / Editor123!');
                    console.log('   Chercheur : researcher@credda-ulpgl.org / Researcher123!');
                    console.log('\n' + '='.repeat(50));
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('\n❌ ERREUR DURANT LE SEEDING:');
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
