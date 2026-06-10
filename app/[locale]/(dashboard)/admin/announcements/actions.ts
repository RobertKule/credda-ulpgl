"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const ALLOWED_ROLES = ["ADMIN", "EDITOR", "SUPERADMIN"];

const SEED_ANNOUNCEMENTS = [
  {
    titleFr: "Appel à articles : Revue Congolaise de Droit Environnemental",
    titleEn: "Call for papers: Congolese Environmental Law Review",
    titleSw: "Wito wa makala: Jarida la Sheria ya Mazingira ya Kongo",
    contentFr: "Le CREDDA lance un appel à soumissions pour le prochain numéro de la Revue Congolaise de Droit de l'Environnement. Les chercheurs et doctorants sont invités à envoyer leurs articles originaux avant la date limite.",
    contentEn: "CREDDA is launching a call for submissions for the next issue of the Congolese Environmental Law Review. Researchers and doctoral students are invited to send their original articles before the deadline.",
    contentSw: "CREDDA inazindua wito wa kuwasilisha makala kwa toleo lijalo la Jarida la Sheria ya Mazingira ya Kongo. Watafiti na wanafunzi wa udaktari wanaalikwa kutuma makala zao asili kabla ya tarehe ya mwisho.",
    priority: "INFO",
    targetAudience: "RESEARCHERS",
    isPersistent: true,
    expiresAt: "2026-09-30T23:59:59.000Z",
    status: "ACTIVE",
    isActive: true
  },
  {
    titleFr: "Alerte : Pollution industrielle suspectée près du bassin du Lac Kivu",
    titleEn: "Alert: Suspected industrial pollution near Lake Kivu basin",
    titleSw: "Tahadhari: Uchafuzi wa viwanda unaoshukiwa karibu na bonde la Ziwa Kivu",
    contentFr: "Un déversement suspect de résidus industriels a été rapporté par les communautés locales au nord de Goma. Notre Clinique Juridique prépare une descente d'évaluation technique et juridique urgente.",
    contentEn: "A suspect discharge of industrial residues has been reported by local communities north of Goma. Our Legal Clinic is preparing an urgent technical and legal assessment visit.",
    contentSw: "Utoaji unaoshukiwa wa mabaki ya viwanda umeripotiwa na jamii za mitaa kaskazini mwa Goma. Kliniki yetu ya Kisheria inaandaa ziara ya haraka ya tathmini ya kiufundi na kisheria.",
    priority: "CRITICAL",
    targetAudience: "ALL",
    isPersistent: true,
    expiresAt: "2026-06-25T18:00:00.000Z",
    status: "ACTIVE",
    isActive: true
  },
  {
    titleFr: "Atelier de recherche : Méthodologie en Contentieux Écologique",
    titleEn: "Research Workshop: Methodology in Ecological Litigation",
    titleSw: "Warsha ya Utafiti: Mbinu katika Kesi za Kiekoolojia",
    contentFr: "Participez au prochain atelier d'analyse des cas pratiques organisé par le pôle recherche du CREDDA. Présentation des outils de plaidoyer environnemental de l'ULPGL.",
    contentEn: "Participate in the next workshop on practical cases organized by the CREDDA research department. Presentation of ULPGL's environmental advocacy tools.",
    contentSw: "Shiriki katika warsha inayofuata ya kesi za kiutendaji iliyoandaliwa na idara ya utafiti ya CREDDA. Uwasilishaji wa zana za utetezi wa mazingira za ULPGL.",
    priority: "INFO",
    targetAudience: "RESEARCHERS",
    isPersistent: false,
    expiresAt: "2026-06-18T16:00:00.000Z",
    status: "ACTIVE",
    isActive: true
  },
  {
    titleFr: "Maintenance planifiée des services numériques CREDDA",
    titleEn: "Scheduled maintenance of CREDDA digital services",
    titleSw: "Matengenezo yaliyopangwa ya huduma za kidijitali za CREDDA",
    contentFr: "En raison d'une mise à niveau technique du serveur de la bibliothèque en ligne, l'accès aux PDF de recherche sera interrompu temporairement ce dimanche de 02:00 à 06:00.",
    contentEn: "Due to a technical upgrade of the online library server, access to research PDFs will be temporarily suspended this Sunday from 02:00 to 06:00.",
    contentSw: "Kwa sababu ya uboreshaji wa kiufundi wa seva ya maktaba ya mkondoni, upatikanaji wa PDF za utafiti utasitishwa kwa muda Jumapili hii kuanzia 02:00 hadi 06:00.",
    priority: "WARNING",
    targetAudience: "ALL",
    isPersistent: false,
    expiresAt: "2026-06-14T06:00:00.000Z",
    status: "SCHEDULED",
    isActive: false
  },
  {
    titleFr: "Vœux de la Direction Scientifique pour l'année académique",
    titleEn: "New Academic Year Wishes from the Scientific Directorate",
    titleSw: "Hekima za Mwaka Mpya wa Masomo kutoka kwa Kurugenzi ya Sayansi",
    contentFr: "Le recteur de l'ULPGL et la direction scientifique du CREDDA souhaitent la bienvenue à tous les nouveaux chercheurs inscrits au programme de droit international de l'environnement.",
    contentEn: "The rector of ULPGL and the scientific management of CREDDA welcome all new researchers registered in the international environmental law program.",
    contentSw: "Mkuu wa chuo cha ULPGL na usimamizi wa kisayansi wa CREDDA wanawakaribisha watafiti wote wapya waliosajiliwa katika mpango wa sheria ya mazingira ya kimataifa.",
    priority: "INFO",
    targetAudience: "PUBLIC",
    isPersistent: false,
    expiresAt: "2026-01-31T23:59:59.000Z",
    status: "ARCHIVED",
    isActive: false
  },
  {
    titleFr: "Suspension temporaire de l'accueil physique à la Clinique Juridique",
    titleEn: "Temporary suspension of walk-ins at the Legal Clinic",
    titleSw: "Kusitishwa kwa muda kwa huduma ya ana kwa ana kwenye Kliniki ya Kisheria",
    contentFr: "Suite aux travaux de rénovation de l'aile administrative de l'ULPGL Goma, les consultations physiques sont temporairement redirigées vers notre formulaire en ligne et assistance téléphonique.",
    contentEn: "Following renovation work on the administrative wing of ULPGL Goma, physical consultations are temporarily redirected to our online form and telephone assistance.",
    contentSw: "Kufuatia kazi ya ukarabati kwenye bawa la utawala la ULPGL Goma, ushauri wa ana kwa ana unaelekezwa kwa muda kwa fomu yetu ya mkondoni na msaada wa simu.",
    priority: "WARNING",
    targetAudience: "PUBLIC",
    isPersistent: true,
    expiresAt: "2026-07-15T17:00:00.000Z",
    status: "ACTIVE",
    isActive: true
  }
];

export async function getAnnouncements() {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  let count = await db.announcement.count();
  if (count === 0) {
    // Seed initial data
    for (const item of SEED_ANNOUNCEMENTS) {
      try {
        await db.announcement.create({
          data: {
            level: (item.priority === "CRITICAL" ? "URGENT" : item.priority) as any,
            targetAudience: item.targetAudience,
            isPersistent: item.isPersistent,
            expiresAt: item.expiresAt ? new Date(item.expiresAt) : null,
            status: item.status,
            isActive: item.isActive,
            announcementTranslations: {
              createMany: {
                data: [
                  { language: "fr", title: item.titleFr, content: item.contentFr },
                  { language: "en", title: item.titleEn, content: item.contentEn },
                  { language: "sw", title: item.titleSw, content: item.contentSw },
                ]
              }
            }
          }
        });
      } catch (err) {
        console.warn("Announcement seed conflict avoided:", err);
      }
    }
  }

  return db.announcement.findMany({
    include: {
      announcementTranslations: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function createAnnouncement(data: {
  titleFr: string; titleEn: string; titleSw: string;
  contentFr: string; contentEn: string; contentSw: string;
  priority: "INFO" | "WARNING" | "CRITICAL";
  targetAudience: string;
  isPersistent: boolean;
  expiresAt?: string;
  status: string;
}) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  const levelMapped = data.priority === "CRITICAL" ? "URGENT" : data.priority;
  const isActive = data.status === "ACTIVE";

  const newAnn = await db.announcement.create({
    data: {
      level: levelMapped as any,
      targetAudience: data.targetAudience,
      isPersistent: data.isPersistent,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      status: data.status,
      isActive,
      announcementTranslations: {
        createMany: {
          data: [
            { language: "fr", title: data.titleFr, content: data.contentFr },
            { language: "en", title: data.titleEn, content: data.contentEn },
            { language: "sw", title: data.titleSw, content: data.contentSw }
          ]
        }
      }
    }
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/announcements");
  return { success: true, id: newAnn.id };
}

export async function updateAnnouncement(id: string, data: {
  titleFr: string; titleEn: string; titleSw: string;
  contentFr: string; contentEn: string; contentSw: string;
  priority: "INFO" | "WARNING" | "CRITICAL";
  targetAudience: string;
  isPersistent: boolean;
  expiresAt?: string;
  status: string;
}) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  const levelMapped = data.priority === "CRITICAL" ? "URGENT" : data.priority;
  const isActive = data.status === "ACTIVE";

  await db.announcement.update({
    where: { id },
    data: {
      level: levelMapped as any,
      targetAudience: data.targetAudience,
      isPersistent: data.isPersistent,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      status: data.status,
      isActive
    }
  });

  // Update translations individually using upsert
  const translations = [
    { language: "fr", title: data.titleFr, content: data.contentFr },
    { language: "en", title: data.titleEn, content: data.contentEn },
    { language: "sw", title: data.titleSw, content: data.contentSw }
  ];

  for (const tr of translations) {
    await db.announcementTranslation.upsert({
      where: {
        announcementId_language: {
          announcementId: id,
          language: tr.language
        }
      },
      update: {
        title: tr.title,
        content: tr.content
      },
      create: {
        announcementId: id,
        language: tr.language,
        title: tr.title,
        content: tr.content
      }
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/announcements");
  return { success: true };
}

export async function deleteAnnouncement(id: string) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  await db.announcement.delete({
    where: { id }
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/announcements");
  return { success: true };
}

export async function getActiveAnnouncement(locale: string) {
  try {
    const announcement = await db.announcement.findFirst({
      where: { isActive: true },
      include: {
        announcementTranslations: {
          where: { language: locale }
        }
      }
    });

    if (!announcement || !announcement.announcementTranslations[0]) return null;

    return {
      id: announcement.id,
      level: announcement.level,
      title: announcement.announcementTranslations[0].title,
      content: announcement.announcementTranslations[0].content,
      updatedAt: announcement.updatedAt
    };
  } catch (error) {
    console.error("[GET_ACTIVE_ANNOUNCEMENT_ERROR]", error);
    return null;
  }
}

