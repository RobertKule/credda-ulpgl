# Logique Métier & Fonctionnement du Projet : CREDDA-ULPGL

Ce document explique les mécanismes internes et la logique opérationnelle implémentés pour les services clés du CREDDA.

## 🏛️ La Clinique de Droit de l'Environnement (CDE)
La CDE est un pilier stratégique du centre. Sa logique repose sur l'accès à la justice environnementale.

### 📝 Soumission de Cas (Case Submission)
- **Interface Public** : Les citoyens ou organisations peuvent soumettre des cas via un formulaire dédié.
- **Réception & Alertes** : Chaque soumission crée un enregistrement dans la table `ClinicalCase` de la base de données.
- **Notification Dashboard** : Une notification en temps réel apparaît sur le dashboard administrateur (badge numérique dans la sidebar).
- **Gestion Admin** : Les administrateurs peuvent consulter le détail, changer le statut du cas (En attente, En cours, Résolu) et archiver les dossiers.

### 🟢 Accent Écologique (Emerald Green)
Le thème "Emerald Green" (#064E3B) est utilisé exclusivement pour les éléments liés à la Clinique Juridique et à l'écologie, symbolisant la nature et la justice environnementale comme accent sur le thème institutionnel Gold/Dark.

## 📢 Système d'Annonces Globales (Broadcast System)
Le système permet de diffuser des messages critiques ou institutionnels de manière immédiate.

### ⚙️ Fonctionnement Technique
1. **Création Admin** : Dans `/admin/announcements`, l'administrateur crée une annonce avec un titre, un message et un niveau de priorité.
2. **Priorité Unique** : Seule l'annonce marquée comme "Active" (`isActive: true`) est diffusée sur le site public.
3. **Persistance Locale** : Pour éviter l'agacement des visiteurs, la bannière est dismissible.
   - Si un utilisateur clique sur "Fermer", une clé `dismissed_announcement_${id}` est stockée dans le **localStorage**.
   - La bannière ne réapparaîtra plus pour cet utilisateur tant qu'une nouvelle annonce (avec un ID différent) ne sera pas publiée.

## 👤 Gestion des Utilisateurs & Rôles
L'accès au backend est sécurisé via NextAuth.js.
- **SUPER_ADMIN** : Accès complet au système, incluant la gestion des administrateurs et la configuration système globale.
- **ADMIN** : Accès à la gestion des contenus (Research, Clinical Cases, Publications, Announcements).

## 🏢 Identité Visuelle Institutionnelle
Le design suit une ligne "Premium & Strict" :
- **Rayon de Courbure (Radius)** : Standardisé à `rounded-md` (6px) pour tous les boutons, cartes et containers, assurant un look institutionnel formel.
- **Typographie** : Utilisation de *Fraunces* (Serif) pour les titres académiques et *Outfit* (Sans) pour la lisibilité technique.
