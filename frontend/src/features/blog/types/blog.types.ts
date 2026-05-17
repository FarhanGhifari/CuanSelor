export type BlogCategory =
    | "Dana Pensiun"
    | "Investasi"
    | "Budgeting"
    | "Literasi Finansial"
    | "Aktuaria";

export interface BlogArticle {
    slug: string;
    title: string;
    excerpt: string;
    category: BlogCategory;
    readTime: number;       // menit
    publishedAt: string;       // ISO date string
    author: string;
    content: BlogContent[];
}

export type BlogContent =
    | { type: "paragraph"; text: string }
    | { type: "heading"; text: string }
    | { type: "callout"; text: string }
    | { type: "list"; items: string[] };