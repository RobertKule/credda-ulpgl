export interface SearchResult {
  id: string;
  title: string;
  type: "Article" | "Publication" | "User" | "Message" | "Membre";
  href: string;
}
