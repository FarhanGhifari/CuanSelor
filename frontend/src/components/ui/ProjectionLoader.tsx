"use client";

import Image from "next/image";
import "./ProjectionLoader.css";

export function ProjectionLoader() {
  return (
    <div className="bg-white rounded-[32px] p-12 border border-gray-100">
      <div className="flex flex-col items-center justify-center gap-6">
        {/* SVG Illustration with Soft Bounce Animation */}
        <div className="animate-soft-bounce">
          <Image
            src="/projection-illustration.svg"
            alt="Calculating projection"
            width={280}
            height={280}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        
        {/* Text */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Menghitung Proyeksi...
          </h3>
        </div>
      </div>
    </div>
  );
}
