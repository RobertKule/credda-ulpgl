export interface EditorialItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  
  coverImage?: string;
  gallery?: string[];
  videoUrl?: string;
  pdfUrl?: string;
  
  featured: boolean;
  published: boolean;
  
  category?: string;
  tags?: string[];
  
  author?: string;
  createdAt: Date;
  
  // Custom type discriminator to help routing if needed
  type: 'article' | 'publication' | 'event' | 'program';
}
