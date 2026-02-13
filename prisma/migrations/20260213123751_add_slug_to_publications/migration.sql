-- 1. Ajouter la colonne 'slug' en la rendant optionnelle pour l'instant
ALTER TABLE "Publication" ADD COLUMN "slug" TEXT;

-- 2. Remplir la colonne 'slug' pour les anciennes lignes avec une valeur unique (basée sur l'ID)
UPDATE "Publication" SET "slug" = 'publication-' || id;

-- 3. Maintenant que toutes les lignes ont une valeur, on peut appliquer la contrainte 'NOT NULL' et 'UNIQUE'
ALTER TABLE "Publication" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_slug_key" UNIQUE ("slug");