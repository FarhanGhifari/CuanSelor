"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AboutSection() {
  const cardLeftVariants = {
    hidden: { opacity: 0, x: -120 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const cardRightVariants = {
    hidden: { opacity: 0, x: 120 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const statContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const statCardVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" as const }
    }
  };

  return (
    <section id="about" className="bg-[#f8f9fa] text-[#1b1b1c] font-sans antialiased w-full relative overflow-hidden">
      <style>{`
        .dot-pattern {
          background-image: radial-gradient(#6366F1 1.5px, transparent 1.5px);
          background-size: 8px 8px;
        }
      `}</style>

      {/* BEGIN: Main Content Area */}
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-[1440px] mx-auto">

        {/* BEGIN: Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-20">
          <div className="lg:col-span-8">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-black mb-6">
              KAMI MEMBANTU GENERASI MUDA MEMBANGUN MASA DEPAN FINANSIAL DENGAN LEBIH SADAR, TERARAH, DAN PENUH KEYAKINAN.
            </h1>
          </div>
          <div className="lg:col-span-4 flex flex-col justify-start">
            <p className="text-lg font-semibold text-[#1b1b1c] mb-4">
              Kekuatan kami terletak pada cara kami menggabungkan data, logika aktuaria, dan teknologi AI menjadi panduan finansial yang lebih personal.
            </p>
            <p className="text-[#444748] leading-relaxed">
              CuanSelor dibangun untuk membantu pengguna memahami kondisi finansial mereka, mengevaluasi berbagai kemungkinan, dan menyusun rencana masa depan yang lebih terukur. Kami ingin membuat perencanaan keuangan terasa lebih jelas, relevan, dan mudah diakses oleh generasi muda Indonesia.
            </p>
          </div>
        </div>
        {/* END: Header Section */}

        {/* BEGIN: Our Story Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-black">
            Perjalanan CuanSelor
            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M19 12l-7 7-7-7"></path>
            </svg>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden py-4 px-2">
            {/* Story Text Card */}
            <motion.div
              variants={cardLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-4 bg-white rounded-3xl p-8 flex flex-col justify-between h-[400px] lg:h-auto min-h-[400px] shadow-sm"
            >
              <div>
                <p className="text-[#444748] text-lg leading-relaxed">
                  CuanSelor lahir dari keresahan bahwa banyak anak muda ingin merencanakan masa depan finansial, tetapi bingung harus mulai dari mana. Keuangan terasa rumit, investasi sering membingungkan, dan tujuan jangka panjang kerap tertunda. Melalui simulasi, insight berbasis data, dan AI advisor, kami membantu proses perencanaan keuangan menjadi lebih jelas, lebih personal, and lebih mudah dipahami.
                </p>
              </div>
            </motion.div>

            {/* Story Visual Card */}
            <motion.div
              variants={cardRightVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-8 relative rounded-3xl overflow-hidden h-[400px] lg:h-[500px] bg-[#eeeff0] shadow-sm"
            >
              <img
                alt="CuanSelor Story Visual"
                className="w-full h-full object-cover"
                src="/About.png"
              />
            </motion.div>
          </div>
        </div>
        {/* END: Our Story Section */}

        {/* BEGIN: Statistics Section */}
        <motion.div
          variants={statContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4"
        >
          {/* Stat Card 1 */}
          <motion.div
            variants={statCardVariants}
            className="bg-white rounded-3xl p-8 flex flex-col justify-between h-[320px] relative overflow-hidden group border border-[#D7F5EA] shadow-[0_18px_50px_rgba(16,185,129,0.06)]"
          >
            <h3 className="text-6xl font-bold tracking-tight text-[#0F172A] z-10">3+</h3>
            {/* Abstract Geometric Graphic */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.2] pointer-events-none transition-transform group-hover:scale-105">
              <svg className="stroke-[#10B981]" fill="none" height="100" viewBox="0 0 200 100" width="200" xmlns="http://www.w3.org/2000/svg">
                <rect height="60" rx="4" strokeWidth="1.5" width="40" x="10" y="20"></rect>
                <rect height="60" rx="4" strokeWidth="1.5" width="40" x="30" y="25"></rect>
                <rect height="60" rx="4" strokeWidth="1.5" width="40" x="50" y="30"></rect>
                <rect height="60" rx="4" strokeWidth="1.5" width="40" x="70" y="35"></rect>
                <rect height="60" rx="4" strokeWidth="1.5" width="40" x="90" y="40"></rect>
                <path d="M130 45 L150 75" strokeWidth="1.5"></path>
              </svg>
            </div>
            <p className="text-xl font-bold text-[#111827] leading-tight z-10">Modul Finansial Utama</p>
          </motion.div>

          {/* Stat Card 2 */}
          <motion.div
            variants={statCardVariants}
            className="bg-white rounded-3xl p-8 flex flex-col justify-between h-[320px] relative overflow-hidden border border-[#DDE7FF] shadow-[0_18px_50px_rgba(99,102,241,0.05)]"
          >
            <h3 className="text-6xl font-bold tracking-tight text-[#0F172A] z-10">100+</h3>
            {/* Dot Pattern Graphic */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-24 dot-pattern opacity-[0.15]"></div>
            <p className="text-xl font-bold text-[#111827] leading-tight z-10">Skenario finansial & simulasi</p>
          </motion.div>

          {/* Stat Card 3 */}
          <motion.div
            variants={statCardVariants}
            className="bg-white rounded-3xl p-8 flex flex-col justify-between h-[320px] relative overflow-hidden border border-[#FEF3C7] shadow-[0_18px_50px_rgba(245,158,11,0.06)]"
          >
            <h3 className="text-6xl font-bold tracking-tight text-[#0F172A] z-10">100%</h3>
            {/* Star/Lines Graphic */}
            <div className="absolute inset-0 flex items-center justify-end pr-8 opacity-[0.2] pointer-events-none">
              <svg className="stroke-[#F59E0B]" fill="none" height="80" viewBox="0 0 180 80" width="180" xmlns="http://www.w3.org/2000/svg">
                {/* Vertical lines */}
                <g strokeWidth="0.5">
                  <line x1="10" x2="10" y1="10" y2="70"></line>
                  <line x1="15" x2="15" y1="10" y2="70"></line>
                  <line x1="20" x2="20" y1="10" y2="70"></line>
                  <line x1="25" x2="25" y1="10" y2="70"></line>
                  <line x1="30" x2="30" y1="10" y2="70"></line>
                  <line x1="35" x2="35" y1="10" y2="70"></line>
                  <line x1="40" x2="40" y1="10" y2="70"></line>
                  <line x1="45" x2="45" y1="10" y2="70"></line>
                  <line x1="50" x2="50" y1="10" y2="70"></line>
                  <line x1="55" x2="55" y1="10" y2="70"></line>
                  <line x1="60" x2="60" y1="10" y2="70"></line>
                  <line x1="65" x2="65" y1="10" y2="70"></line>
                  <line x1="70" x2="70" y1="10" y2="70"></line>
                  <line x1="75" x2="75" y1="10" y2="70"></line>
                  <line x1="80" x2="80" y1="10" y2="70"></line>
                  <line x1="85" x2="85" y1="10" y2="70"></line>
                  <line x1="90" x2="90" y1="10" y2="70"></line>
                  <line x1="95" x2="95" y1="10" y2="70"></line>
                </g>
                {/* Star shape */}
                <path d="M140 10 L146 25 L162 25 L149 34 L154 49 L140 40 L126 49 L131 34 L118 25 L134 25 Z" fill="#F59E0B" fillOpacity="0.08" strokeWidth="1.5"></path>
              </svg>
            </div>
            <p className="text-xl font-bold text-[#111827] leading-tight z-10">Fokus pada pengalaman pengguna</p>
          </motion.div>
        </motion.div>
        {/* END: Statistics Section */}
      </div>
    </section>
  );
}
