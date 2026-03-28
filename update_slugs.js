const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

async function main() {
  const members = await db.member.findMany({ include: { translations: true } });
  
  for (const m of members) {
    if (!m.slug || m.slug === '') {
      const nameTranslation = m.translations.find(t => t.language === 'fr')?.name || m.translations[0]?.name;
      if (nameTranslation) {
        const newSlug = slugify(nameTranslation) + '-' + Math.floor(Math.random() * 1000);
        await db.member.update({
          where: { id: m.id },
          data: { 
            name: nameTranslation,
            slug: newSlug 
          }
        });
        console.log(`Updated ${nameTranslation} with slug ${newSlug}`);
      }
    }
  }
}

main().then(() => db.$disconnect()).catch(e => { console.error(e); db.$disconnect(); });
