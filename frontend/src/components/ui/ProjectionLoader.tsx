"use client";

import Image from "next/image";
import "./ProjectionLoader.css";

interface ProjectionLoaderProps {
  text?: string;
  subtext?: string;
}

export function ProjectionLoader({ text = "Menghitung Proyeksi...", subtext }: ProjectionLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 w-full">
      {/* SVG Illustration with Soft Bounce Animation */}
      <div className="animate-soft-bounce">
        <Image
          src="/projection-illustration.svg"
          alt="Loading"
          width={280}
          height={280}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      
      {/* Text */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700">
          {text}
        </h3>
        {subtext && (
          <p className="text-sm text-gray-400 mt-1">{subtext}</p>
        )}
      </div>
    </div>
  );
}
