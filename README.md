<div align="center">
  <img src="public/logocredda.png" alt="CREDDA Logo" width="180" />
  <h1>🏛️ CREDDA-ULPGL</h1>
  <p><strong>Centre de Recherche sur la Démocratie et le Développement en Afrique</strong></p>
  
  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15%20(Turbopack)-black?logo=next.js" alt="Next.js 15" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Backend%20as%20a%20Service-3ECF8E?logo=supabase" alt="Supabase" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-ORM%20Type--safe-2D3748?logo=prisma" alt="Prisma" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS%204.0%20(Alpha)-38B2AC?logo=tailwind-css" alt="Tailwind CSS 4" /></a>
  </p>
</div>

---

## 📋 Table of Contents
- [Executive Summary](#-executive-summary)
- [Core Architecture](#-core-architecture)
- [Senior Tech Stack](#-senior-tech-stack)
- [Key Features](#-key-features)
- [Developer Experience (DX)](#-developer-experience-dx)
- [Deployment & CI/CD](#-deployment--cicd)
- [Ownership & Team](#-ownership--team)

---

## 🎯 Executive Summary
Le **CREDDA-ULPGL** est une plateforme institutionnelle de grade "Enterprise" conçue pour l'Université Libre des Pays des Grands Lacs. Dépassant le simple cadre d'un site vitrine, c'est un écosystème complexe intégrant la gestion de recherches académiques, le suivi de dossiers juridiques pour la **Clinique de Droit de l'Environnement**, et une diffusion multilingue (FR, EN, SW) en temps réel.

> [!IMPORTANT]
> L'architecture est orientée **Performance & Scalabilité**, utilisant les dernières avancées du framework Next.js 15 pour garantir un score Lighthouse optimal et une maintenance facilitée.

---

## 🏗️ Core Architecture
La solution repose sur une architecture **Monolithe Modulaire** exploitant l'App Router de Next.js.

### Patterns Design & Logic
*   **Atomic Design Pattern** : Décomposition des composants UI pour une réutilisation maximale.
*   **Type-Safe Data Layer** : Utilisation stricte de Prisma pour la synchronisation du schéma avec PostgreSQL (Supabase).
*   **RBAC Architecture** : Système de permissions granulaire (SuperAdmin / Admin / Researcher).
*   **I18n Orchestration** : Gestion multi-locales synchrone via `next-intl`.

### Directory Structure (Clean Layout)
```text
├── 📂 app/              # Architecture Server-First & API Routes
├── 📂 components/       # UI Library (Shared, Home, Admin, Public)
├── 📂 lib/              # Core Logic (Auth.js, Prisma Client, Env Validation)
├── 📂 prisma/           # Database Schema & Native Migrations
├── 📂 messages/         # Localization Strategy (Triple Locale)
└── 📂 hooks/            # Custom React Hooks pour la logique réutilisable
```

---

## 🛠️ Senior Tech Stack
*   **Frontend Ecosystem** : 
    *   **Next.js 15** : Exploitation du mode `Turbopack` et de l'ISR pour les publications.
    *   **Tailwind CSS 4** : Design System basé sur des variables CSS natives pour une performance brute.
    *   **Framer Motion** : Orchestration d'animations complexes (Scroll Reveal, 3D Titlts).
*   **Backend & Infrastructure** :
    *   **Supabase** : PostgreSQL managé avec transaction pooler pour la haute disponibilité.
    *   **Auth.js v5** : Authentification stateless avec gestion de middleware pour la protection des routes Admin.
    *   **Prisma Client** : Couche d'abstraction DB type-safe.

---

## ✨ Key Features
*   🌍 **Full i18n Strategy** : Implémentation du système trilingue incluant le **Kiswahili**, crucial pour l'impact régional.
*   ⚖️ **Clinical Case Management** : Module métier complexe pour le suivi des litiges environnementaux.
*   📢 **Global Announcement System** : Système de broadcast avec mode persistant (localStorage) et gestion Admin.
*   🖼️ **High-Performance Media** : Optimisation Next/Image combinée au stockage Supabase pour un rendu instantané.

---

## 🚀 Developer Experience (DX)

### Setup Quickstart
1.  **Clonage & Dépendances**
    ```bash
    git clone https://github.com/RobertKule/credda-ulpgl.git
    npm install
    ```
2.  **Synchronisation Schéma**
    ```bash
    npx prisma generate
    npx prisma db push
    ```
3.  **Environnement**
    Configurez votre `.env` avec les secrets Supabase et Auth.js.

### Production Build
```bash
npm run build
```
*Le build génère des pages statiques optimisées (SSG) et des routes dynamiques (SSR) selon les besoins métier.*

---

## 👨‍💻 Lead Engineer & Architecture
**Robert Kule**
*Lead Full Stack Engineer | Multimedia Systems Specialist*

[GitHub Profile](https://github.com/RobertKule) | [Laboratory @kulelab](https://youtube.com/@kulelab)

---

## 📄 Propriété Intellectuelle
Ce logiciel est une œuvre originale développée pour le **CREDDA - ULPGL**. 
*Tous droits réservés © 2026.*

---
<div align="center">
  <p><em>"Building the digital foundation for African Academic Excellence."</em></p>
</div>
