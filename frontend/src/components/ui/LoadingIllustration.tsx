"use client";

import { motion } from "framer-motion";

export function LoadingIllustration() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Rotating circles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0"
      >
        <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 rounded-full bg-emerald-500" />
        <div className="absolute bottom-0 left-1/2 w-3 h-3 -ml-1.5 rounded-full bg-emerald-400" />
        <div className="absolute left-0 top-1/2 w-3 h-3 -mt-1.5 rounded-full bg-emerald-600" />
        <div className="absolute right-0 top-1/2 w-3 h-3 -mt-1.5 rounded-full bg-emerald-300" />
      </motion.div>

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
