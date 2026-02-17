// app/[locale]/gallery/GalleryClient.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  X, ChevronLeft, ChevronRight, Download, Heart, 
  Share2, Maximize2, Minimize2, Grid, List, Filter
} from "lucide-react";
import { useTranslations } from "next-intl";

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  category: string;
  description: string | null;
  featured: boolean;
  order: number;
  createdAt: Date;
}

interface GalleryClientProps {
  images: GalleryImage[];
  locale: string;
}

export default function GalleryClient({ images, locale }: GalleryClientProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [filter, setFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");
  const [likedImages, setLikedImages] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const t = useTranslations('GalleryPage');

  // Filtrer les images
  const filteredImages = filter === "all" 
    ? images 
    : images.filter(img => img.category === filter);

  // Catégories uniques
  const categories = ["all", ...new Set(images.map(img => img.category))];

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    const newIndex = direction === "next" 
      ? (selectedIndex + 1) % filteredImages.length
      : (selectedIndex - 1 + filteredImages.length) % filteredImages.length;
    
    setSelectedIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const toggleLike = (id: string) => {
    setLikedImages(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedImage) return;
    
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") navigateLightbox("next");
    if (e.key === "ArrowLeft") navigateLightbox("prev");
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, selectedIndex]);

  if (images.length === 0) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-md mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full" />
              <Image
                src="/images/placeholder-gallery.svg"
                alt="Empty gallery"
                width={200}
                height={200}
                className="mx-auto relative z-10 opacity-50"
              />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">
              {t('empty.title')}
            </h3>
            <p className="text-slate-500 font-light">
              {t('empty.description')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Filtres et contrôles */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Filtres par catégorie */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
              <Filter size={14} className="text-slate-400 shrink-0" />
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap rounded-none ${
                      filter === cat
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'text-slate-500 border-slate-200 hover:border-blue-900 hover:text-blue-900'
                    }`}
                  >
                    {cat === "all" ? t('filters.all') : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Vue mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid"
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-slate-400 hover:text-blue-900'
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("masonry")}
                className={`p-2 transition-colors ${
                  viewMode === "masonry"
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-slate-400 hover:text-blue-900'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Résultats */}
          <div className="mt-4 text-xs text-slate-500">
            {t('results', { 
              count: filteredImages.length,
              total: images.length 
            })}
          </div>
        </div>
      </section>

      {/* Grille d'images */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {viewMode === "grid" ? (
            // Vue Grille
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {filteredImages.map((image, idx) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group relative aspect-square overflow-hidden bg-slate-100 cursor-pointer rounded-lg shadow-md hover:shadow-2xl transition-all duration-500"
                  onClick={() => openLightbox(image, idx)}
                >
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Contenu au survol */}
                  <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[8px] font-black uppercase tracking-widest text-blue-400">
                      {image.category}
                    </p>
                    <h3 className="text-xs font-bold text-white line-clamp-1 mt-1">
                      {image.title}
                    </h3>
                  </div>

                  {/* Badge catégorie */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-black/50 backdrop-blur-sm text-white border-none text-[6px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                      {image.category}
                    </Badge>
                  </div>

                  {/* Bouton like */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(image.id);
                    }}
                    className="absolute top-3 right-3 z-20 p-2 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
                  >
                    <Heart 
                      size={14} 
                      className={likedImages.includes(image.id) ? 'fill-red-500 text-red-500' : 'text-white'} 
                    />
                  </button>

                  {/* Image featured */}
                  {image.featured && (
                    <div className="absolute top-3 right-12 z-20">
                      <Badge className="bg-amber-500 text-white border-none text-[6px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                        {t('featured')}
                      </Badge>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            // Vue Masonry
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filteredImages.map((image, idx) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="break-inside-avoid group relative cursor-pointer mb-4"
                  onClick={() => openLightbox(image, idx)}
                >
                  <div className="relative overflow-hidden bg-slate-100 rounded-lg shadow-md hover:shadow-2xl transition-all duration-500">
                    <Image
                      src={image.src}
                      alt={image.title}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Contenu */}
                    <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[8px] font-black uppercase tracking-widest text-blue-400">
                        {image.category}
                      </p>
                      <h3 className="text-xs font-bold text-white line-clamp-1">
                        {image.title}
                      </h3>
                    </div>

                    {/* Badge catégorie */}
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-black/50 backdrop-blur-sm text-white border-none text-[6px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                        {image.category}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Contrôles */}
            <div className="absolute top-4 right-4 z-30 flex gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-3 bg-white/10 backdrop-blur-md text-white hover:bg-blue-600 transition-all rounded-full"
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button
                onClick={closeLightbox}
                className="p-3 bg-white/10 backdrop-blur-md text-white hover:bg-red-600 transition-all rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("prev");
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md text-white hover:bg-blue-600 transition-all rounded-full z-30"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("next");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md text-white hover:bg-blue-600 transition-all rounded-full z-30"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image */}
            <motion.div
              key={selectedImage.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`relative ${isFullscreen ? 'w-screen h-screen' : 'max-w-6xl max-h-[80vh]'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                width={isFullscreen ? 1920 : 1200}
                height={isFullscreen ? 1080 : 800}
                className="object-contain w-full h-full"
                priority
              />
            </motion.div>

            {/* Informations */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container mx-auto">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-blue-600 text-white border-none text-[8px] font-black uppercase tracking-widest px-3 py-1">
                    {selectedImage.category}
                  </Badge>
                  {selectedImage.featured && (
                    <Badge className="bg-amber-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-3 py-1">
                      {t('featured')}
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2">{selectedImage.title}</h2>
                {selectedImage.description && (
                  <p className="text-white/70 max-w-2xl">{selectedImage.description}</p>
                )}
                <div className="flex gap-4 mt-4">
                  <button className="flex items-center gap-2 text-xs bg-white/10 hover:bg-blue-600 px-4 py-2 rounded-full transition-all">
                    <Download size={14} /> {t('download')}
                  </button>
                  <button className="flex items-center gap-2 text-xs bg-white/10 hover:bg-blue-600 px-4 py-2 rounded-full transition-all">
                    <Share2 size={14} /> {t('share')}
                  </button>
                  <button
                    onClick={() => toggleLike(selectedImage.id)}
                    className="flex items-center gap-2 text-xs bg-white/10 hover:bg-blue-600 px-4 py-2 rounded-full transition-all"
                  >
                    <Heart 
                      size={14} 
                      className={likedImages.includes(selectedImage.id) ? 'fill-red-500 text-red-500' : ''} 
                    />
                    {likedImages.includes(selectedImage.id) ? t('liked') : t('like')}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Compteur */}
            <div className="absolute top-4 left-4 text-white/50 text-sm">
              {selectedIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}