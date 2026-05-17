import type { Metadata }   from "next";
import { BlogListPage }    from "@/features/blog/components/BlogListPage";

export const metadata: Metadata = {
  title:       "Blog & Literasi Finansial — CuanSelor",
  description: "Panduan keuangan praktis untuk Gen Z Indonesia — dari dasar budgeting hingga strategi pensiun berbasis aktuaria.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <BlogListPage />
    </div>
  );
}