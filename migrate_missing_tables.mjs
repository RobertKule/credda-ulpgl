// migrate_missing_tables.mjs – Creates missing tables not yet in the DB
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL || !DATABASE_URL.startsWith('postgres')) {
  console.error('❌ DATABASE_URL missing');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function run() {
  console.log('🚀 Running missing table migrations...');

  // Check User table columns and add status if needed
  try {
    await sql`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'APPROVED'`;
    console.log('✅ User.status column ensured');
  } catch(e) { console.log('ℹ️ User.status:', e.message); }

  // Add SUPER_ADMIN role if enum doesn't include it
  try {
    await sql`ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN'`;
    console.log('✅ Role.SUPER_ADMIN enum added');
  } catch(e) { console.log('ℹ️ SUPER_ADMIN enum:', e.message); }

  // GalleryImage
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "GalleryImage" (
        "id" TEXT NOT NULL,
        "src" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "eventId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
      )
    `;
    console.log('✅ GalleryImage table created');
  } catch(e) { console.log('ℹ️ GalleryImage:', e.message); }

  // GalleryImageTranslation
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "GalleryImageTranslation" (
        "id" TEXT NOT NULL,
        "language" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "galleryImageId" TEXT NOT NULL,
        CONSTRAINT "GalleryImageTranslation_pkey" PRIMARY KEY ("id")
      )
    `;
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "GalleryImageTranslation_galleryImageId_language_key"
      ON "GalleryImageTranslation"("galleryImageId", "language")
    `;
    console.log('✅ GalleryImageTranslation table created');
  } catch(e) { console.log('ℹ️ GalleryImageTranslation:', e.message); }

  // Event
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "Event" (
        "id" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "date" TIMESTAMP(3) NOT NULL,
        "location" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "coverImageUrl" TEXT,
        "isPublished" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
      )
    `;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "Event_slug_key" ON "Event"("slug")`;
    await sql`CREATE INDEX IF NOT EXISTS "Event_slug_idx" ON "Event"("slug")`;
    await sql`CREATE INDEX IF NOT EXISTS "Event_date_idx" ON "Event"("date")`;
    console.log('✅ Event table created');
  } catch(e) { console.log('ℹ️ Event:', e.message); }

  // EventTranslation
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "EventTranslation" (
        "id" TEXT NOT NULL,
        "language" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "content" TEXT,
        "eventId" TEXT NOT NULL,
        CONSTRAINT "EventTranslation_pkey" PRIMARY KEY ("id")
      )
    `;
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "EventTranslation_eventId_language_key"
      ON "EventTranslation"("eventId", "language")
    `;
    console.log('✅ EventTranslation table created');
  } catch(e) { console.log('ℹ️ EventTranslation:', e.message); }

  // Add FK for GalleryImage.eventId -> Event
  try {
    await sql`
      ALTER TABLE "GalleryImage"
      ADD CONSTRAINT "GalleryImage_eventId_fkey"
      FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE
    `;
    console.log('✅ GalleryImage.eventId FK added');
  } catch(e) { console.log('ℹ️ GalleryImage FK:', e.message); }

  // Add FK EventTranslation -> Event
  try {
    await sql`
      ALTER TABLE "EventTranslation"
      ADD CONSTRAINT "EventTranslation_eventId_fkey"
      FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `;
    console.log('✅ EventTranslation.eventId FK added');
  } catch(e) { console.log('ℹ️ EventTranslation FK:', e.message); }

  // Add FK GalleryImageTranslation -> GalleryImage
  try {
    await sql`
      ALTER TABLE "GalleryImageTranslation"
      ADD CONSTRAINT "GalleryImageTranslation_galleryImageId_fkey"
      FOREIGN KEY ("galleryImageId") REFERENCES "GalleryImage"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `;
    console.log('✅ GalleryImageTranslation.galleryImageId FK added');
  } catch(e) { console.log('ℹ️ GalleryImageTranslation FK:', e.message); }

  // Testimonial
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "Testimonial" (
        "id" TEXT NOT NULL,
        "authorName" TEXT NOT NULL,
        "authorRole" TEXT NOT NULL,
        "avatarInitials" TEXT,
        "photoUrl" TEXT,
        "isPublished" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
      )
    `;
    console.log('✅ Testimonial table created');
  } catch(e) { console.log('ℹ️ Testimonial:', e.message); }

  // TestimonialTranslation
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "TestimonialTranslation" (
        "id" TEXT NOT NULL,
        "language" TEXT NOT NULL,
        "quote" TEXT NOT NULL,
        "testimonialId" TEXT NOT NULL,
        CONSTRAINT "TestimonialTranslation_pkey" PRIMARY KEY ("id")
      )
    `;
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "TestimonialTranslation_testimonialId_language_key"
      ON "TestimonialTranslation"("testimonialId", "language")
    `;
    console.log('✅ TestimonialTranslation table created');
  } catch(e) { console.log('ℹ️ TestimonialTranslation:', e.message); }

  // FK TestimonialTranslation -> Testimonial
  try {
    await sql`
      ALTER TABLE "TestimonialTranslation"
      ADD CONSTRAINT "TestimonialTranslation_testimonialId_fkey"
      FOREIGN KEY ("testimonialId") REFERENCES "Testimonial"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `;
    console.log('✅ TestimonialTranslation.testimonialId FK added');
  } catch(e) { console.log('ℹ️ TestimonialTranslation FK:', e.message); }

  console.log('\n🎉 Migration complete!');
}

run().catch(e => { console.error('❌ Migration failed:', e.message); process.exit(1); })
  .finally(() => process.exit(0));
