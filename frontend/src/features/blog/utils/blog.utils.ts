import type { BlogCategory } from "../types/blog.types";

export const CATEGORIES = [
    "Semua",
    "Dana Pensiun",
    "Investasi",
    "Budgeting",
    "Literasi Finansial",
    "Aktuaria",
] as const;

export const CATEGORY_STYLES: Record<BlogCategory, { badge: string; icon: string }> = {
    "Dana Pensiun": { badge: "bg-blue-100 text-blue-700", icon: "text-blue-500" },
    "Investasi": { badge: "bg-emerald-100 text-emerald-700", icon: "text-emerald-500" },
    "Budgeting": { badge: "bg-amber-100 text-amber-700", icon: "text-amber-500" },
    "Literasi Finansial": { badge: "bg-purple-100 text-purple-700", icon: "text-purple-500" },
    "Aktuaria": { badge: "bg-pink-100 text-pink-700", icon: "text-pink-500" },
};

export const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });