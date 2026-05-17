import Link from "next/link";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CATEGORY_STYLES, formatDate } from "../utils/blog.utils";
import type { BlogArticle } from "../types/blog.types";

interface ArticleCardProps {
    article: BlogArticle;
    featured?: boolean;
    size?: "lg" | "md" | "sm";
}

// Warna gradient per kategori untuk hero visual
const CATEGORY_GRADIENT: Record<string, string> = {
    "Dana Pensiun": "from-blue-600 to-blue-400",
    "Investasi": "from-emerald-600 to-teal-400",
    "Budgeting": "from-amber-500 to-orange-400",
    "Literasi Finansial": "from-violet-600 to-purple-400",
    "Aktuaria": "from-rose-600 to-pink-400",
};

export function ArticleCard({ article, featured = false, size = "md" }: ArticleCardProps) {
    const style = CATEGORY_STYLES[article.category];
    const gradient = CATEGORY_GRADIENT[article.category];

    // ── Featured (hero besar) ──────────────────────────────────
    if (featured) {
        return (
            <Link href={`/blog/${article.slug}`} className="group block">
                {/* Hero image area */}
                <div className={cn(
                    "w-full rounded-3xl mb-6 flex items-end overflow-hidden relative",
                    "h-[420px] lg:h-[500px]",
                    `bg-gradient-to-br ${gradient}`
                )}>
                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 0%, transparent 60%)" }} />
                    {/* Bottom fade */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="relative z-10 p-8">
                        <span className={cn("inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 bg-white/20 text-white backdrop-blur-sm")}>
                            {article.category}
                        </span>
                        <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight max-w-xl">
                            {article.title}
                        </h2>
                    </div>
                </div>

                {/* Text below image */}
                <p className="text-muted-foreground leading-relaxed mb-3 text-base max-w-2xl">
                    {article.excerpt}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime} mnt baca</span>
                    <span className="text-border">·</span>
                    <span>{formatDate(article.publishedAt)}</span>
                    <span className="text-border">·</span>
                    <span className={cn("font-medium text-xs px-2.5 py-0.5 rounded-full", style.badge)}>
                        {article.category}
                    </span>
                </div>
            </Link>
        );
    }

    // ── Large card (2 kolom) ───────────────────────────────────
    if (size === "lg") {
        return (
            <Link href={`/blog/${article.slug}`} className="group block">
                <div className={cn(
                    "w-full rounded-2xl mb-4 overflow-hidden relative flex items-end",
                    "h-56",
                    `bg-gradient-to-br ${gradient}`
                )}>
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 0%, transparent 60%)" }} />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <span className={cn("inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2", style.badge)}>
                    {article.category}
                </span>
                <h3 className="font-semibold text-foreground text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                    {article.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {article.readTime} mnt · {formatDate(article.publishedAt)}
                </div>
            </Link>
        );
    }

    // ── Small card (list / related) ────────────────────────────
    return (
        <Link href={`/blog/${article.slug}`} className="group flex gap-5 md:gap-6 items-start py-8 border-t border-border/50 last:border-b-0">
            {/* Image (Larger square like Apple) */}
            <div className={cn(
                "w-28 h-28 md:w-[140px] md:h-[140px] rounded-2xl flex-shrink-0 bg-gradient-to-br relative overflow-hidden",
                gradient
            )}>
                 <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 0%, transparent 60%)" }} />
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
                <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2">
                    {article.category}
                </span>
                <h4 className="font-bold text-foreground text-lg md:text-[19px] leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-3">
                    {article.title}
                </h4>
                <div className="text-[13px] text-muted-foreground font-medium">
                    {formatDate(article.publishedAt)}
                </div>
            </div>
        </Link>
    );
}
