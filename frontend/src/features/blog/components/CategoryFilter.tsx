"use client";

import { cn }         from "@/lib/utils/cn";
import { CATEGORIES } from "../utils/blog.utils";

interface CategoryFilterProps {
  active:   string;
  onChange: (cat: string) => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0",
            active === cat
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}