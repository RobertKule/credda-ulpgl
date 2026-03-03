// app/[locale]/gallery/GalleryClient.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  X, ChevronLeft, ChevronRight, Download, Heart, 
  Share2, Maximize2, Minimize2, Grid, List, Filter,
  Camera, Star, Eye
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
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
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

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
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
              <Camera size={80} className="mx-auto text-slate-300 relative z-10" strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">
              {t('empty.title')}
            </h3>
            <p className="text-slate-500 font-light text-lg">
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
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap rounded-full ${
                      filter === cat
                        ? 'bg-blue-900 text-white border-blue-900 shadow-lg'
                        : 'text-slate-500 border-slate-200 hover:border-blue-900 hover:text-blue-900'
                    }`}
                  >
                    {cat === "all" ? t('filters.all') : cat}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Vue mode */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-full transition-colors ${
                  viewMode === "grid"
                    ? 'bg-white text-blue-900 shadow-md'
                    : 'text-slate-400 hover:text-blue-900'
                }`}
              >
                <Grid size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("masonry")}
                className={`p-2 rounded-full transition-colors ${
                  viewMode === "masonry"
                    ? 'bg-white text-blue-900 shadow-md'
                    : 'text-slate-400 hover:text-blue-900'
                }`}
              >
                <List size={18} />
              </motion.button>
            </div>
          </div>

          {/* Résultats */}
          <motion.div 
            key={`${filter}-${filteredImages.length}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-slate-500"
          >
            {t('results', { 
              count: filteredImages.length,
              total: images.length 
            })}
          </motion.div>
        </div>
      </section>

      {/* Grille d'images */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {viewMode === "grid" ? (
            // Vue Grille
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredImages.map((image, idx) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group relative aspect-square overflow-hidden bg-slate-100 cursor-pointer rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500"
                  onClick={() => openLightbox(image, idx)}
                >
                  {!imageErrors[image.id] ? (
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={() => handleImageError(image.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <Camera size={40} className="text-slate-400" />
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                  />
                  
                  {/* Contenu au survol */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-x-0 bottom-0 p-6"
                  >
                    <Badge className="bg-blue-600 text-white border-0 mb-2 text-[10px] px-2 py-1">
                      {image.category}
                    </Badge>
                    <h3 className="text-lg font-serif font-bold text-white line-clamp-2">
                      {image.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Eye size={14} className="text-blue-400" />
                      <span className="text-xs text-white/70">Détails</span>
                    </div>
                  </motion.div>

                  {/* Badge catégorie (visible sans survol) */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-black/50 backdrop-blur-sm text-white border-none text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                      {image.category}
                    </Badge>
                  </div>

                  {/* Bouton like */}
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(image.id);
                    }}
                    className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Heart 
                      size={16} 
                      className={likedImages.includes(image.id) ? 'fill-red-500 text-red-500' : 'text-white'} 
                    />
                  </motion.button>

                  {/* Badge featured */}
                  {image.featured && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-16 z-20"
                    >
                      <Badge className="bg-amber-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1">
                        <Star size={10} className="fill-white" />
                        {t('featured')}
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Vue Masonry
            <motion.div layout className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {filteredImages.map((image, idx) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="break-inside-avoid group relative cursor-pointer mb-6"
                  onClick={() => openLightbox(image, idx)}
                >
                  <div className="relative overflow-hidden bg-slate-100 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500">
                    {!imageErrors[image.id] ? (
                      <Image
                        src={image.src}
                        alt={image.title}
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={() => handleImageError(image.id)}
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] flex items-center justify-center bg-slate-200">
                        <Camera size={48} className="text-slate-400" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                    />
                    
                    {/* Contenu au survol */}
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-x-0 bottom-0 p-6"
                    >
                      <Badge className="bg-blue-600 text-white border-0 mb-2 text-[10px] px-2 py-1">
                        {image.category}
                      </Badge>
                      <h3 className="text-lg font-serif font-bold text-white">
                        {image.title}
                      </h3>
                    </motion.div>

                    {/* Badge catégorie */}
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-black/50 backdrop-blur-sm text-white border-none text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {image.category}
                      </Badge>
                    </div>

                    {/* Badge featured */}
                    {image.featured && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-amber-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1">
                          <Star size={10} className="fill-white" />
                        </Badge>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
            className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Contrôles */}
            <div className="absolute top-4 right-4 z-30 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-3 bg-white/10 backdrop-blur-md text-white hover:bg-blue-600 transition-all rounded-full"
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeLightbox}
                className="p-3 bg-white/10 backdrop-blur-md text-white hover:bg-red-600 transition-all rounded-full"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Navigation */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("prev");
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md text-white hover:bg-blue-600 transition-all rounded-full z-30"
            >
              <ChevronLeft size={24} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("next");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md text-white hover:bg-blue-600 transition-all rounded-full z-30"
            >
              <ChevronRight size={24} />
            </motion.button>

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
              {!imageErrors[`lightbox-${selectedImage.id}`] ? (
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  width={isFullscreen ? 1920 : 1200}
                  height={isFullscreen ? 1080 : 800}
                  className="object-contain w-full h-full"
                  priority
                  onError={() => handleImageError(`lightbox-${selectedImage.id}`)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                  <Camera size={80} className="text-slate-700" />
                </div>
              )}
            </motion.div>

            {/* Informations */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container mx-auto">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-blue-600 text-white border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    {selectedImage.category}
                  </Badge>
                  {selectedImage.featured && (
                    <Badge className="bg-amber-500 text-white border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                      <Star size={12} className="fill-white" />
                      {t('featured')}
                    </Badge>
                  )}
                </div>
                <h2 className="text-3xl font-serif font-bold mb-2">{selectedImage.title}</h2>
                {selectedImage.description && (
                  <p className="text-white/80 max-w-2xl text-lg font-light">
                    {selectedImage.description}
                  </p>
                )}
                <div className="flex gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-sm bg-white/10 hover:bg-blue-600 px-6 py-3 rounded-full transition-all"
                  >
                    <Download size={16} /> {t('download')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-sm bg-white/10 hover:bg-blue-600 px-6 py-3 rounded-full transition-all"
                  >
                    <Share2 size={16} /> {t('share')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleLike(selectedImage.id)}
                    className="flex items-center gap-2 text-sm bg-white/10 hover:bg-blue-600 px-6 py-3 rounded-full transition-all"
                  >
                    <Heart 
                      size={16} 
                      className={likedImages.includes(selectedImage.id) ? 'fill-red-500 text-red-500' : ''} 
                    />
                    {likedImages.includes(selectedImage.id) ? t('liked') : t('like')}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Compteur */}
            <div className="absolute top-4 left-4 text-white/50 text-sm font-mono">
              {String(selectedIndex + 1).padStart(2, '0')} / {String(filteredImages.length).padStart(2, '0')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}