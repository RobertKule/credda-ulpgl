"use client";

import { useTranslations } from "next-intl";
import { m as motion } from "framer-motion";
import { Shield, Lock, FileText, Fingerprint, MailCheck } from "lucide-react";
import MediaCard from "@/components/media/MediaCard";
import { db } from "@/lib/db";

export default async function PrivacyPage({ params }: { locale: string }) {
  const t = useTranslations("PrivacyPage");
  const { locale } = params;

  // Fetch gallery images with translations and files
  const galleryImagesData = await db.galleryImage.findMany({
    include: { translations: { where: { language: locale } }, files: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const galleryImages = galleryImagesData as unknown as any[];

  // Map to unified media objects and detect type
  const allMedia = galleryImages.map((gi) => {
    const isVideo =
      (gi.src?.includes("youtube.com") || gi.src?.includes("youtu.be") || gi.src?.includes("vimeo.com")) ||
      gi.src?.match(/\.(mp4|mov|webm|ogg|mkv)$/i) ||
      (gi.files?.some((f: any) => f.fileType === "VIDEO"));
    return {
      id: gi.id,
      title: gi.translations?.[0]?.title || `Média ${gi.category}`,
      description: gi.translations?.[0]?.description || undefined,
      type: isVideo ? "VIDEO" as const : "IMAGE" as const,
      itemType: "media" as const,
      url: isVideo ? (gi.files?.[0]?.url ?? gi.src) : gi.src,
      coverImageUrl: isVideo ? gi.src : undefined,
      thumbnailUrl: gi.src,
      category: gi.category || "General",
      files: gi.files || [],
    };
  });

  const videoReports = allMedia.filter((m) => m.type === "VIDEO");
  const imageGallery = allMedia.filter((m) => m.type === "IMAGE");

  const icons = [FileText, Fingerprint, Lock, Shield];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              {t("header.badge")}
            </span>
            <h1
              className="text-5xl md:text-6xl font-serif text-slate-900 mb-8 leading-tight"
              dangerouslySetInnerHTML={{ __html: t.raw("header.title") }}
            />
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              {t("header.description")}
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {Array.isArray(t.raw("sections")) &&
              (t.raw("sections") as { title: string; content: string }[]).map((section, idx) => {
                const Icon = icons[idx % icons.length];
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                      <Icon className="text-slate-400 group-hover:text-primary transition-colors" size={24} />
                    </div>
                    <h2 className="text-2xl font-serif text-slate-900 mb-4 tracking-tight">
                      {section.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed">{section.content}</p>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Video Reportage Section */}
      <section className="py-24 bg-slate-100">
        <div className="container mx-auto px-6 text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Reportage Vidéo</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Tous les reportages vidéo du CREDDA.</p>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videoReports.map((media) => (
              <MediaCard key={media.id} media={media} onClick={() => {}} />
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Gallery Section (Images only) */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Galerie Institutionnelle</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Une archive visuelle vivante des activités du CREDDA.</p>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {imageGallery.map((media) => (
              <MediaCard key={media.id} media={media} onClick={() => {}} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto p-12 rounded-[2.5rem] bg-primary/5 border border-primary/10 text-center relative overflow-hidden">
            <MailCheck className="mx-auto mb-6 text-primary opacity-50" size={48} />
            <h3 className="text-3xl font-serif text-slate-900 mb-4">{t("footer.title")}</h3>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">{t("footer.description")}</p>
            <a href="mailto:contact@credda-ulpgl.org" className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-md font-bold hover:bg-slate-800 transition-colors">
              {t("footer.cta")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}


import { useTranslations } from "next-intl";
import { m as motion } from "framer-motion";
import { Shield, Lock, FileText, Fingerprint, MailCheck } from "lucide-react";
import MediaCard from "@/components/media/MediaCard";
import { db } from "@/lib/db";

export default async function PrivacyPage({ params }: { locale: string }) {
  const t = useTranslations("PrivacyPage");
  const { locale } = params;

  // Fetch gallery images with translations
  const galleryImagesData = await db.galleryImage.findMany({
    include: { translations: { where: { language: locale } }, files: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const galleryImages = galleryImagesData as unknown as any[];

  const galleryMedia = galleryImages.map((gi) => ({
    id: gi.id,
    title: gi.translations?.[0]?.title || `Média ${gi.category}`,
    description: gi.translations?.[0]?.description || undefined,
    type: "IMAGE" as const,
    itemType: "media" as const,
    url: gi.src,
    coverImageUrl: undefined,
    thumbnailUrl: gi.src,
    category: gi.category || "General",
    files: [{ url: gi.src, fileType: "IMAGE" }],
  }));

  const icons = [FileText, Fingerprint, Lock, Shield];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              {t("header.badge")}
            </span>
            <h1
              className="text-5xl md:text-6xl font-serif text-slate-900 mb-8 leading-tight"
              dangerouslySetInnerHTML={{ __html: t.raw("header.title") }}
            />
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              {t("header.description")}
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {Array.isArray(t.raw("sections")) &&
              (t.raw("sections") as { title: string; content: string }[]).map((section, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                      <Icon className="text-slate-400 group-hover:text-primary transition-colors" size={24} />
                    </div>
                    <h2 className="text-2xl font-serif text-slate-900 mb-4 tracking-tight">
                      {section.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Institutional Gallery Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Galerie Institutionnelle</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Une archive visuelle vivante des activités du CREDDA.</p>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryMedia.map((media) => (
              <MediaCard key={media.id} media={media} onClick={() => {}} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto p-12 rounded-[2.5rem] bg-primary/5 border border-primary/10 text-center relative overflow-hidden">
            <MailCheck className="mx-auto mb-6 text-primary opacity-50" size={48} />
            <h3 className="text-3xl font-serif text-slate-900 mb-4">{t("footer.title")}</h3>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">{t("footer.description")}</p>
            <a href="mailto:contact@credda-ulpgl.org" className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-md font-bold hover:bg-slate-800 transition-colors">
              {t("footer.cta")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}


import { useTranslations } from "next-intl";
import { m as motion } from "framer-motion";
import { Shield, Lock, FileText, Fingerprint, MailCheck } from "lucide-react";
import MediaCard from "@/components/media/MediaCard";
import { db } from "@/lib/db";

export default async function PrivacyPage({ params }: { locale: string }) {
  const t = useTranslations("PrivacyPage");
  const { locale } = params;

  // Fetch gallery images with translations
  const galleryImagesData = await db.galleryImage.findMany({
    include: { translations: { where: { language: locale } }, files: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const galleryImages = galleryImagesData as unknown as any[];

  const galleryMedia = galleryImages.map((gi) => ({
    id: gi.id,
    title: gi.translations?.[0]?.title || `Média ${gi.category}`,
    description: gi.translations?.[0]?.description || undefined,
    type: "IMAGE" as const,
    itemType: "media" as const,
    url: gi.src,
    coverImageUrl: undefined,
    thumbnailUrl: gi.src,
    category: gi.category || "General",
    files: [{ url: gi.src, fileType: "IMAGE" }],
  }));

  const icons = [FileText, Fingerprint, Lock, Shield];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              {t("header.badge")}
            </span>
            <h1
              className="text-5xl md:text-6xl font-serif text-slate-900 mb-8 leading-tight"
              dangerouslySetInnerHTML={{ __html: t.raw("header.title") }}
            />
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              {t("header.description")}
            </p>
          </motion.div>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {Array.isArray(t.raw("sections")) &&
              (t.raw("sections") as { title: string; content: string }[]).map(
                (section, index) => {
                  const Icon = icons[index % icons.length];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                        <Icon
                          className="text-slate-400 group-hover:text-primary transition-colors"
                          size={24}
                        />
                      </div>
                      <h2 className="text-2xl font-serif text-slate-900 mb-4 tracking-tight">
                        {section.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed">
                        {section.content}
                      </p>
                    </motion.div>
                  );
                }
              )}
          </div>
        </div>
      </section>

      {/* Institutional Gallery Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">
            Galerie Institutionnelle
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Une archive visuelle vivante des activités du CREDDA.
          </p>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryMedia.map((media) => (
              <MediaCard key={media.id} media={media} onClick={() => {}} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto p-12 rounded-[2.5rem] bg-primary/5 border border-primary/10 text-center relative overflow-hidden">
            <MailCheck className="mx-auto mb-6 text-primary opacity-50" size={48} />
            <h3 className="text-3xl font-serif text-slate-900 mb-4">
              {t("footer.title")}
            </h3>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
              {t("footer.description")}
            </p>
            <a
              href="mailto:contact@credda-ulpgl.org"
              className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-md font-bold hover:bg-slate-800 transition-colors"
            >
              {t("footer.cta")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}


import { useTranslations } from "next-intl";
import { m as motion } from "framer-motion";
import { Shield, Lock, FileText, Fingerprint, MailCheck } from "lucide-react";
import MediaCard from "@/components/media/MediaCard";
import { db } from "@/lib/db";

export default async function PrivacyPage({ params }: { params: { locale: string } }) {
  const t = useTranslations("PrivacyPage");
  const { locale } = params;

  // Fetch gallery images with translations
  const galleryImagesData = await db.galleryImage.findMany({
    include: { translations: { where: { language: locale } }, files: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const galleryImages = galleryImagesData as unknown as any[]; // simplified typing

  const galleryMedia = galleryImages.map((gi) => ({
    id: gi.id,
    title: gi.translations?.[0]?.title || `Média ${gi.category}`,
    description: gi.translations?.[0]?.description || undefined,
    type: "IMAGE" as const,
    itemType: "media" as const,
    url: gi.src,
    coverImageUrl: undefined,
    thumbnailUrl: gi.src,
    category: gi.category || "General",
    files: [{ url: gi.src, fileType: "IMAGE" }],
  }));

  const icons = [FileText, Fingerprint, Lock, Shield];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              {t("header.badge")}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-8 leading-tight"
                dangerouslySetInnerHTML={{ __html: t.raw("header.title") }} />
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              {t("header.description")}
            </p>
          </motion.div>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {Array.isArray(t.raw("sections")) && (t.raw("sections") as {title: string, content: string}[]).map((section, index) => {
              const Icon = icons[index % icons.length];
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <Icon className="text-slate-400 group-hover:text-primary transition-colors" size={24} />
                  </div>
                  <h2 className="text-2xl font-serif text-slate-900 mb-4 tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Institutional Gallery Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Galerie Institutionnelle</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Une archive visuelle vivante des activités du CREDDA.</p>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryMedia.map((media) => (
              <MediaCard key={media.id} media={media} onClick={() => {}} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto p-12 rounded-[2.5rem] bg-primary/5 border border-primary/10 text-center relative overflow-hidden">
            <MailCheck className="mx-auto mb-6 text-primary opacity-50" size={48} />
            <h3 className="text-3xl font-serif text-slate-900 mb-4">{t("footer.title")}</h3>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
              {t("footer.description")}
            </p>
            <a 
              href="mailto:contact@credda-ulpgl.org" 
              className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-md font-bold hover:bg-slate-800 transition-colors"
            >
              {t("footer.cta")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}


import { useTranslations } from "next-intl";
import { m as motion } from "framer-motion";
import { Shield, Lock, FileText, Fingerprint, MailCheck } from "lucide-react";

export default function PrivacyPage() {
  const t = useTranslations("PrivacyPage");
  
  const icons = [FileText, Fingerprint, Lock, Shield];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              {t("header.badge")}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-8 leading-tight"
                dangerouslySetInnerHTML={{ __html: t.raw("header.title") }} />
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              {t("header.description")}
            </p>
          </motion.div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {Array.isArray(t.raw("sections")) && (t.raw("sections") as {title: string, content: string}[]).map((section, index) => {
              const Icon = icons[index % icons.length];
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <Icon className="text-slate-400 group-hover:text-primary transition-colors" size={24} />
                  </div>
                  <h2 className="text-2xl font-serif text-slate-900 mb-4 tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto p-12 rounded-[2.5rem] bg-primary/5 border border-primary/10 text-center relative overflow-hidden">
            <MailCheck className="mx-auto mb-6 text-primary opacity-50" size={48} />
            <h3 className="text-3xl font-serif text-slate-900 mb-4">{t("footer.title")}</h3>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
              {t("footer.description")}
            </p>
            <a 
              href="mailto:contact@credda-ulpgl.org" 
              className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-md font-bold hover:bg-slate-800 transition-colors"
            >
              {t("footer.cta")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
