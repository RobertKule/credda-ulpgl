import dotenv from 'dotenv'
import path from 'path'

// Chargement explicite du fichier .env depuis la racine
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  })
  
  console.log('🧹 Début du nettoyage ciblé de la base de données CREDDA-ULPGL...');

  // Liste des emails des profils d'équipe à supprimer
  const emailsToRemove = [
    'dir@credda-ulpgl.org',
    'kahindo@credda-ulpgl.org',
    'zawadi@credda-ulpgl.org',
    'lwaboshi@credda-ulpgl.org'
  ]

  // ── 1. NETTOYAGE DES MEMBRES DE L'ÉQUIPE (MEMBER & TRANSLATIONS) ──────────
  try {
    console.log('⏳ Recherche et suppression des membres de l\'équipe...');
    
    // 1.A. Trouver les IDs des membres concernés pour nettoyer leurs traductions
    const members = await prisma.member.findMany({
      where: {
        email: { in: emailsToRemove }
      },
      select: { id: true, email: true }
    })

    if (members.length > 0) {
      const memberIds = members.map(m => m.id)

      // Supprimer les traductions associées à ces membres (éviter l'erreur FK)
      await prisma.memberTranslation.deleteMany({
        where: { memberId: { in: memberIds } }
      })

      // Supprimer les lignes principales de la table Member
      const deletedMembers = await prisma.member.deleteMany({
        where: { id: { in: memberIds } }
      })

      console.log(`✅ ${deletedMembers.count} membres supprimés avec succès.`);
    } else {
      console.log('ℹ️ Aucun membre correspondant trouvé dans la table Member.');
    }
  } catch (e) {
    console.error('❌ Erreur lors de la suppression des membres :', e)
  }

  // ── 2. PURGE DES UTILISATEURS (USER) POUR NE GARDER QUE L'ADMIN & SUPERADMIN ──
  try {
    console.log('⏳ Filtrage de la table des utilisateurs (User)...')

    // Les seuls comptes qui doivent survivre
    const adminEmailsToKeep = ['rkule880@gmail.com', 'admin@credda-ulpgl.org']

    const deletedUsers = await prisma.user.deleteMany({
      where: {
        email: {
          notIn: adminEmailsToKeep
        }
      }
    })

    console.log(`✅ ${deletedUsers.count} utilisateur(s) secondaire(s) supprimé(s).`)
    console.log('🔒 Seuls les comptes admin et superadmin sont conservés en base de données.')

  } catch (e) {
    console.error('❌ Erreur lors du nettoyage de la table User :', e)
  }

  console.log('─────────────────────────────────────────────')
  console.log('🎉 Alignement de production terminé avec succès !')
  
  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error('❌ Le script de nettoyage a échoué :', e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })