import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ArticleCard } from "./ArticleCard";
import { formatDate } from "../utils/blog.utils";
import { getArticleBySlug, getRelatedArticles } from "../data/articles";

const CATEGORY_GRADIENT: Record<string, string> = {
    "Dana Pensiun": "from-blue-600 to-blue-400",
    "Investasi": "from-emerald-600 to-teal-400",
    "Budgeting": "from-amber-500 to-orange-400",
    "Literasi Finansial": "from-violet-600 to-purple-400",
    "Aktuaria": "from-rose-600 to-pink-400",
};

interface BlogDetailPageProps {
    slug: string;
}

export function BlogDetailPage({ slug }: BlogDetailPageProps) {
    const article = getArticleBySlug(slug);
    if (!article) notFound();

    const related = getRelatedArticles(slug, 3);
    const gradient = CATEGORY_GRADIENT[article.category];

    return (
        <div className="min-h-screen bg-background">

            {/* ── Hero image area ──────────────────────────────────── */}
            <div className={cn(
                "w-full flex items-end relative overflow-hidden",
                "h-[50vh] lg:h-[60vh]",
                `bg-linear-to-br ${gradient}`
            )}>
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle at 60% 20%, white 0%, transparent 55%)" }} />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/60 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-12 w-full">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Blog
                    </Link>
                    <div className="max-w-3xl">
                        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 bg-white/20 text-white backdrop-blur-sm">
                            {article.category}
                        </span>
                        <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                            {article.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* ── Article body ─────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Meta row */}
                <div className="flex items-center gap-3 py-8 border-b border-border/50 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        CS
                    </div>
                    <span className="font-medium text-foreground">{article.author}</span>
                    <span className="text-border">·</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime} menit baca</span>
                    <span className="text-border">·</span>
                    <span>{formatDate(article.publishedAt)}</span>
                </div>

                {/* Content + Sidebar */}
                <div className="grid lg:grid-cols-[1fr_280px] gap-16 py-12">

                    {/* ── Main content ───────────────────────────────── */}
                    <article className="min-w-0">
                        {/* Lead excerpt */}
                        <p className="text-xl text-muted-foreground leading-relaxed mb-10 font-light">
                            {article.excerpt}
                        </p>

                        <div className="space-y-6">
                            {article.content.map((block, i) => {
                                if (block.type === "paragraph") {
                                    return (
                                        <p key={i} className="text-foreground/90 leading-[1.85] text-[1.05rem]">
                                            {block.text}
                                        </p>
                                    );
                                }

                                if (block.type === "heading") {
                                    return (
                                        <h2 key={i} className="text-2xl font-bold text-foreground mt-12 mb-2 tracking-tight">
                                            {block.text}
                                        </h2>
                                    );
                                }

                                if (block.type === "callout") {
                                    return (
                                        <div key={i} className="my-8 pl-6 border-l-4 border-primary">
                                            <p className="text-lg text-foreground font-light leading-relaxed italic">
                                                {block.text}
                                            </p>
                                        </div>
                                    );
                                }

                                if (block.type === "list") {
                                    return (
                                        <ul key={i} className="space-y-3 my-4">
                                            {block.items.map((item, j) => (
                                                <li key={j} className="flex items-start gap-3 text-foreground/90">
                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                    <span className="leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    );
                                }

                                return null;
                            })}
                        </div>

                        {/* CTA Banner */}
                        <div className={cn(
                            "mt-16 rounded-3xl p-10 text-center bg-linear-to-br",
                            gradient
                        )}>
                            <div className="absolute inset-0 opacity-10 rounded-3xl"
                                style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 0%, transparent 60%)" }} />
                            <p className="text-2xl font-bold text-white mb-3 leading-tight">
                                Siap menghitung proyeksi pensiunmu?
                            </p>
                            <p className="text-white/70 mb-6 text-sm">
                                Gratis, akurat berbasis aktuaria, dan selesai dalam 5 menit.
                            </p>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-7 py-3 bg-white text-foreground rounded-full font-semibold text-sm hover:bg-white/90 transition-all shadow-lg"
                            >
                                Mulai Gratis →
                            </Link>
                        </div>
                    </article>

                    {/* ── Sidebar ────────────────────────────────────── */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-28 space-y-8">

                            {/* About the author */}
                            <div className="p-5 rounded-2xl bg-muted/40 border border-border/50">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                                    Ditulis oleh
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                                        CS
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">{article.author}</p>
                                        <p className="text-xs text-muted-foreground">Redaksi CuanSelor</p>
                                    </div>
                                </div>
                            </div>

                            {/* Related articles */}
                            {related.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                                        Artikel Terkait
                                    </p>
                                    <div className="divide-y divide-border/50">
                                        {related.map((a) => (
                                            <ArticleCard key={a.slug} article={a} size="sm" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

                {/* ── Related (mobile) ─────────────────────────────── */}
                {related.length > 0 && (
                    <div className="lg:hidden pb-14">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Artikel Terkait
                            </span>
                            <div className="flex-1 h-px bg-border/50" />
                        </div>
                        <div className="grid sm:grid-cols-3 gap-6">
                            {related.map((a) => (
                                <ArticleCard key={a.slug} article={a} size="lg" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
