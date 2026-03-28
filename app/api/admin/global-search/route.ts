import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [articles, publications, members, messages, users] = await Promise.all([
      prisma.article.findMany({
        where: {
          OR: [
            { slug: { contains: query, mode: 'insensitive' } },
            { translations: { some: { title: { contains: query, mode: 'insensitive' } } } }
          ]
        },
        include: { translations: { take: 1 } },
        take: 5
      }),
      prisma.publication.findMany({
        where: {
          OR: [
            { slug: { contains: query, mode: 'insensitive' } },
            { translations: { some: { title: { contains: query, mode: 'insensitive' } } } }
          ]
        },
        include: { translations: { take: 1 } },
        take: 5
      }),
      prisma.member.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { translations: { some: { name: { contains: query, mode: 'insensitive' } } } }
          ]
        },
        include: { translations: { take: 1 } },
        take: 5
      }),
      prisma.contactMessage.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { subject: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5
      })
    ]);

    const results = [
      ...articles.map(a => ({ id: a.id, title: a.translations[0]?.title || a.slug, type: "Article", href: `/admin/articles/edit/${a.id}` })),
      ...publications.map(p => ({ id: p.id, title: p.translations[0]?.title || p.slug, type: "Publication", href: `/admin/articles/edit/${p.id}?type=PUBLICATION` })),
      ...members.map(m => ({ id: m.id, title: (m as any).translations[0]?.name || (m as any).name || "Membre", type: "Membre", href: `/admin/members` })),
      ...messages.map(msg => ({ id: msg.id, title: `${msg.name}: ${msg.subject || 'Sujet' }`, type: "Message", href: `/admin/messages` })),
      ...users.map(u => ({ id: u.id, title: u.name || u.email, type: "User", href: `/admin/users` }))
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Global search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
