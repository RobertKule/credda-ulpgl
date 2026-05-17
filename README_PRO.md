# 🏛️ CREDDA ULPGL - Centre de Recherche en Eau, Développement Durable et Santé

[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![License: Private](https://img.shields.io/badge/License-Private-red.svg)](LICENSE)

Plateforme institutionnelle et clinique du **CREDDA**, affilié à l'Université Libre des Pays des Grands Lacs (ULPGL). Ce projet combine un CMS académique haut de gamme avec un système de gestion de cas pour la **Clinique de Droit de l'Environnement (CDE)**.

---

## ✨ Points Forts

- 🚀 **Performance Extrême** : Next.js App Router avec Server Actions.
- 🎨 **Design Elite** : UI/UX premium utilisant Tailwind v4, Framer Motion et GSAP.
- 🌍 **Multilingue** : Support complet FR, EN et Swahili via `next-intl`.
- ⚖️ **Impact Social** : Plateforme de soumission et de suivi de cas juridiques pour les communautés locales.
- 🌑 **Mode Sombre Natif** : Design optimisé pour une lecture académique prolongée.

---

## 🛠️ Stack Technique

- **Framework** : Next.js 15+ (App Router)
- **Styling** : Tailwind CSS v4 & Shadcn UI
- **ORM** : Prisma (PostgreSQL)
- **Auth** : Auth.js (NextAuth)
- **Email** : Nodemailer
- **Maps** : Leaflet & Mapbox GL

---

## 🚀 Installation & Lancement

### 1. Prérequis
- Node.js 18+ 
- PostgreSQL
- Un compte Cloudinary (pour les images)

### 2. Cloner le projet
```bash
git clone https://github.com/votre-user/credda-ulpgl.git
cd credda-ulpgl
```

### 3. Configuration
Créez un fichier `.env` à la racine :
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/credda"
NEXTAUTH_SECRET="votre_secret_ici"
CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"
```

### 4. Lancer le projet
```bash
npm install
npm run dev
```

---

## 📂 Structure du Projet

```text
├── app/             # Application Next.js (Routes & Layouts)
├── components/      # UI Components (Shadcn + Custom)
├── lib/             # Cœur logique (DB, Auth, Utils)
├── services/        # Business Logic (Server Actions)
├── prisma/          # Schéma de base de données
└── messages/        # Fichiers de traduction
```

---

## 📜 Licence

Ce projet est la propriété exclusive de l'ULPGL. Tous droits réservés.
