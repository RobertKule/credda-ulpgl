"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GalleryForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<{ file: File; preview: string; type: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const handleFiles = (selectedFiles: FileList) => {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select files first!");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      files.forEach((item) => formData.append("attachments", item.file));

      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        setFiles([]);
        router.refresh();
        alert("Gallery Album uploaded successfully!");
      } else {
        alert("Error while processing upload.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Album Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Visite des étudiants en Droit à la Clinique Juridique"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Détails sur l'activité..."
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center min-h-[180px] flex flex-col items-center justify-center ${
          isDragging ? "border-blue-500 bg-blue-50/50" : "border-gray-300 bg-gray-50/50"
        }`}
      >
        <p className="text-sm text-gray-600">Drag & drop files here, or click to choose files</p>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {files.map((item, index) => (
            <div key={index} className="relative aspect-square border rounded-xl overflow-hidden bg-gray-100 group">
              {item.type === "IMAGE" ? (
                <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <video src={item.preview} className="w-full h-full object-cover" muted />
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs shadow-md"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg shadow"
      >
        {loading ? "Uploading..." : "Save Album"}
      </button>
    </form>
  );
}
