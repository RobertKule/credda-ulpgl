# CREDDA-ULPGL : Centre de Recherche sur la Démocratie et le Développement en Afrique

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-CSS%204-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: Private](https://img.shields.io/badge/License-Private-red.svg)](LICENSE)

## 📌 Présentation
Le **Centre de Recherche sur la Démocratie et le Développement en Afrique (CREDDA)**, rattaché à l'Université Libre des Pays des Grands Lacs (ULPGL), est une institution d'excellence dédiée à la recherche juridique, sociale et environnementale en République Démocratique du Congo.

Cette plateforme "Production-Ready" centralise :
- La diffusion des **recherches scientifiques** et publications.
- La gestion opérationnelle de la **Clinique de Droit de l'Environnement**.
- Un système de **broadcast global** pour les annonces institutionnelles.
- Une interface administrative moderne pour le pilotage des contenus.

## 🛠️ Stack Technique
- **Projet** : CREDDA-ULPGL
- **Framework** : Next.js 15 (App Router, Turbopack)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS 4 + Framer Motion (Animations Premium)
- **Base de Données** : PostgreSQL via **Supabase** (Transaction Pooler)
- **Stockage Assets** : **Supabase Storage** (Remplacement de Cloudinary)
- **Authentification** : NextAuth.js
- **Internationalisation** : next-intl (Support multi-locales : FR, EN, SW)
- **Déploiement** : Vercel

## 👨‍💻 Équipe de Développement
- **Lead Developer** : [Robert Kule](https://github.com/RobertKule)

## 🚀 Installation & Développement

### Pré-requis
- Node.js 20+
- PostgreSQL (Local ou Supabase)

### Étape 1 : Cloner le projet
```bash
git clone https://github.com/robert-kule/credda-ulpgl.git
cd credda-ulpgl
```

### Étape 2 : Configuration
Copiez le fichier `.env.example` en `.env` et renseignez les variables nécessaires :
- `DATABASE_URL` (Supabase Transaction Pooler)
- `DIRECT_URL` (Connexion directe DB)
- `SUPABASE_URL` & `SUPABASE_ANON_KEY` (Gestion du stockage)
- `NEXTAUTH_SECRET`

### Étape 3 : Installation des dépendances
```bash
npm install
```

### Étape 4 : Base de données
```bash
npx prisma generate
npx prisma db push
```

### Étape 5 : Lancement
```bash
npm run dev
```

## 📂 Architecture
- `/app` : Routes, layouts et API logic (Next.js 15 conventions).
- `/components` : Bibliothèque de composants réutilisables (Shared, Home, Admin).
- `/lib` : Configurations partagées (Auth, Prisma, Utils).
- `/messages` : Dictionnaires de traduction pour l'i18n.
- `/public` : Assets statiques (Logos, Vidéos, Images Thématiques).

## 📄 Licence
Ce projet est la propriété exclusive du CREDDA - ULPGL. Tous droits réservés.

---
*Conçu avec excellence pour l'avenir de l'Afrique.*
