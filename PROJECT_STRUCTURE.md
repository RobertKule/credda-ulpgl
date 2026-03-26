# Guide d'Architecture & Logique Métier : CREDDA-ULPGL

Ce document détaille la structure interne du projet et les règles métier implémentées pour assurer la pérennité du centre de recherche.

## 🏗️ Structure du Projet

```text
├── app/[locale]/          # Routes i18n (Next.js App Router)
│   ├── (auth)/            # Connexion et récupération de mot de passe
│   ├── (dashboard)/       # Interface d'administration
│   ├── api/               # Points de terminaison (Annonces, Notifications, Contact)
│   └── layout.tsx         # Layout racine avec Providers (Theme, Auth, Intl)
├── components/
│   ├── admin/             # Composants spécifiques au Dashboard
│   ├── home/              # Sections de la page d'accueil (Hero, Partner, etc.)
│   ├── shared/            # Composants transversaux (Navbar, Footer, Search)
│   └── ui/                # Composants atomiques (Boutons, Inputs via Shadcn/ui)
├── lib/
│   ├── db.ts              # Instance Prisma client
│   ├── auth.ts            # Configuration NextAuth
│   └── utils.ts           # Utilitaires Tailwind CSS (cn merge)
├── messages/              # Fichiers JSON de traduction (fr, en, sw)
└── public/                # Assets (logocredda.png, vidéos promotionnelles)
```

## 🧠 Logique Métier Clé

### 1. Gestion des Rôles & Sécurité
- **Rôles** : Le système distingue le `SUPER_ADMIN` (accès total) et l' `ADMIN` (gestion de contenu). La détection se fait via le JWT NextAuth.
- **Clinique Juridique** : Les cas cliniques soumis via le site sont stockés en base de données et déclenchent une notification visuelle immédiate sur le dashboard admin.

### 2. Le Système d'Annonces Globales
Il permet à la direction de diffuser des messages critiques à tous les visiteurs.
- **Persistence** : Si un utilisateur ferme une annonce (bouton "Fermer"), l'état est stocké dans le `localStorage`. La bannière ne réapparaîtra que si un nouvel ID d'annonce est généré par l'admin.
- **Priorité** : Seule l'annonce marquée comme "active" en base de données est affichée.

### 3. Cycle de Vie des Publications
Le centre fonctionne sur un modèle de recherche active. Les publications sont gérées en base de données avec des types spécifiques (Articles, Rapports, Livres) et sont filtrables en temps réel sur le frontend.

### 4. Internationalisation (i18n)
Toute chaîne de caractères affichée à l'utilisateur doit passer par le hook `useTranslations()`. Les ajouts de contenu dynamique (base de données) doivent prévoir des champs multilingues ou suivre la langue locale courante.

## 🛠️ Maintenance & Scalabilité
- **Base de Données** : Prisma est configuré pour utiliser les pools de connexion Supabase, supportant ainsi une montée en charge importante.
- **CSS** : Tailwind CSS 4 est utilisé pour un styling déclaratif, facilitant l'évolution du design system sans accumulation de dettes techniques.
