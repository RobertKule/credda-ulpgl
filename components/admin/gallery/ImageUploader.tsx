"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";

export interface ImageUploaderProps {
    onUploadSuccess: (url: string) => void;
    defaultImage?: string;
}

export function ImageUploader({ onUploadSuccess, defaultImage }: ImageUploaderProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(defaultImage || null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Create a local preview immediately
        setImagePreview(URL.createObjectURL(file));
        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("category", "gallery");

            const response = await fetch("/api/admin/gallery/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'upload");
            }

            const data = await response.json();
            onUploadSuccess(data.url);
            setImagePreview(data.url);
        } catch (err: any) {
            console.error(err);
            setError("Le téléversement a échoué. Veuillez réessayer.");
            setImagePreview(defaultImage || null);
        } finally {
            setIsUploading(false);
        }
    }, [defaultImage, onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
            "image/avif": [],
        },
        maxFiles: 1,
        disabled: isUploading,
    });

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
        onUploadSuccess("");
    };

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-blue-500 bg-blue-50/50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                    } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <input {...getInputProps()} />

                {imagePreview ? (
                    <div className="relative w-full h-full p-2">
                        <div className="relative w-full h-full overflow-hidden rounded-md">
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                className="object-contain"
                            />
                        </div>
                        {!isUploading && (
                            <button
                                type="button"
                                onClick={clearImage}
                                className="absolute top-4 right-4 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md transition-colors"
                                title="Supprimer l'image"
                            >
                                <X size={16} />
                            </button>
                        )}

                        {isUploading && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm rounded-md">
                                <div className="flex flex-col items-center text-blue-600 gap-2">
                                    <Loader2 className="animate-spin" size={32} />
                                    <span className="text-sm font-semibold">Téléversement...</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                        <UploadCloud size={40} className="mb-3 text-slate-400" />
                        <p className="mb-2 text-sm font-semibold text-slate-700">
                            {isDragActive ? "Déposez l'image ici" : "Cliquez ou glissez une image ici"}
                        </p>
                        <p className="text-xs text-slate-500">WEBP, PNG, JPG ou AVIF (Max. 5MB)</p>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
