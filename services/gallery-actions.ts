"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getFeaturedGalleryImages(limit: number = 20) {
    try {
        return await db.galleryImage.findMany({
            where: { featured: true },
            orderBy: { order: "asc" },
            take: limit,
            select: { id: true, src: true, title: true, category: true, description: true }
        });
    } catch (error) {
        console.error("Gallery fetch error:", error);
        return [];
    }
}

export async function getAllGalleryImages() {
    try {
        return await db.galleryImage.findMany({
            orderBy: { order: "asc" },
            select: { id: true, src: true, title: true, category: true, description: true }
        });
    } catch (error) {
        console.error("Gallery fetch error:", error);
        return [];
    }
}
