"use client";

import { useState } from "react";
import { ArticleCard } from "./ArticleCard";
import { CategoryFilter } from "./CategoryFilter";
import {
    getFeaturedArticle,
    getArticlesByCategory,
} from "../data/articles";

export function BlogListPage() {
    const [activeCategory, setActiveCategory] = useState("Semua");

    const featured = getFeaturedArticle();
    const filtered = getArticlesByCategory(activeCategory);
    const rest = filtered.filter((a) => a.slug !== featured.slug);

    // Dua artikel besar + sisanya list
    const bigCards = rest.slice(0, 2);
    const listCards = rest.slice(2);

    return (
        <div className="min-h-screen bg-background">

            {/* ── Page Header ─────────────────────────────────────── */}
            <div className="border-b border-border/50">
                <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pt-28 pb-8">
                    <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-2">
                        Blog
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Literasi finansial untuk Gen Z Indonesia.
                    </p>
                </div>

                {/* Category tabs — Apple-style pill tabs */}
                <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pb-1">
                    <CategoryFilter
                        active={activeCategory}
                        onChange={setActiveCategory}
                    />
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-14">

                {/* ── Featured hero — only show on "Semua" ──────────── */}
                {activeCategory === "Semua" && (
                    <div className="mb-16">
                        <ArticleCard article={featured} featured />
                    </div>
                )}

                {/* ── Two big cards ──────────────────────────────────── */}
                {bigCards.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-10 mb-16">
                        {bigCards.map((a) => (
                            <ArticleCard key={a.slug} article={a} size="lg" />
                        ))}
                    </div>
                )}

                {/* ── Divider label ──────────────────────────────────── */}
                {listCards.length > 0 && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                                Selengkapnya dari CuanSelor
                            </h2>
                        </div>

                        {/* ── List cards ─────────────────────────────────── */}
                        <div className="grid md:grid-cols-2 gap-x-12">
                            {listCards.map((a) => (
                                <ArticleCard key={a.slug} article={a} size="sm" />
                            ))}
                        </div>
                    </>
                )}

                {/* ── Empty state ────────────────────────────────────── */}
                {filtered.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-2xl font-semibold text-foreground mb-2">
                            Belum ada artikel
                        </p>
                        <p className="text-muted-foreground">
                            Artikel untuk kategori ini segera hadir.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}