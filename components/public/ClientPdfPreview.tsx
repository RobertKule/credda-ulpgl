// components/public/ClientPdfPreview.tsx
"use client";

import dynamic from "next/dynamic";

// ✅ Dynamic import avec ssr: false DANS UN COMPOSANT CLIENT
const PdfPreview = dynamic(
  () => import("@/components/public/PdfPreview"),
  { ssr: false }
);

interface ClientPdfPreviewProps {
  url: string;
}

export default function ClientPdfPreview({ url }: ClientPdfPreviewProps) {
  return <PdfPreview url={url} />;
}