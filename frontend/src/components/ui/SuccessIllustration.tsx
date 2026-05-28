"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function SuccessIllustration() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      className="relative w-64 h-64 mx-auto"
    >
      {/* Main SVG Illustration from uploaded file */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative w-full h-full"
      >
        <Image
          src="/success-illustration.svg"
          alt="Success Illustration"
          width={256}
          height={256}
          className="w-full h-full object-contain"
          priority
        />
      </motion.div>

      {/* Floating animation for the whole illustration */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 pointer-events-none"
      />
    </motion.div>
  );
}
