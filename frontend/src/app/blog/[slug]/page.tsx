import type { Metadata }    from "next";
import { BlogDetailPage }   from "@/features/blog/components/BlogDetailPage";
import { getArticleBySlug, ARTICLES } from "@/features/blog/data/articles";

// Next.js 15: params adalah Promise
interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params untuk semua artikel
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

// Generate metadata dinamis per artikel
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug }  = await params;
  const article   = getArticleBySlug(slug);
  if (!article) return { title: "Artikel tidak ditemukan — CuanSelor" };

  return {
    title:       `${article.title} — CuanSelor`,
    description: article.excerpt,
  };
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-background">
      <BlogDetailPage slug={slug} />
    </div>
  );
}