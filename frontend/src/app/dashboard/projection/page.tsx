"use client";

import { useState, useRef, useEffect, type ComponentProps } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, User, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useAdvisor } from "@/features/advisor/hooks/useAdvisor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ── Markdown component with styled elements ───────────────────────────────────
const markdownComponents: ComponentProps<typeof ReactMarkdown>["components"] = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="space-y-1 my-2">{children}</ul>,
  ol: ({ children }) => <ol className="space-y-1 my-2 list-decimal list-inside">{children}</ol>,
  li: ({ children }) => (
    <li className="flex gap-2 items-baseline">
      <span className="text-emerald-500 shrink-0 text-xs mt-0.5">●</span>
      <span className="flex-1">{children}</span>
    </li>
  ),
  h1: ({ children }) => <h3 className="text-base font-bold mt-3 mb-1">{children}</h3>,
  h2: ({ children }) => <h4 className="text-sm font-bold mt-3 mb-1">{children}</h4>,
  h3: ({ children }) => <h5 className="text-sm font-semibold mt-2 mb-1">{children}</h5>,
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <pre className="bg-gray-800 text-gray-100 rounded-lg p-3 my-2 overflow-x-auto text-xs">
          <code>{children}</code>
        </pre>
      );
    }
    return (
      <code className="bg-gray-100 text-emerald-700 px-1.5 py-0.5 rounded text-xs font-mono">
        {children}
      </code>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-3 border-emerald-400 pl-3 my-2 text-gray-600 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-gray-200" />,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline hover:text-emerald-700">
      {children}
    </a>
  ),
};

// ── Quick Questions ───────────────────────────────────────────────────────────
const quickQuestions = [
  "Berapa persen gaji ideal untuk ditabung?",
  "Bagaimana cara meningkatkan dana pensiun?",
  "Apa itu ruin probability?",
  "Kapan waktu terbaik mulai investasi?",
  "Jelaskan kondisi keuangan saya",
  "Tips budgeting untuk pemula",
];

export default function TanyaFindSorPage() {
  const {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
    clearConversation,
    initialized,
  } = useAdvisor();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const msg = input;
    setInput("");
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (q: string) => {
    setInput("");
    sendMessage(q);
  };

  if (!initialized) {
    return (
      <div className="h-[calc(100vh-7rem)] lg:h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm text-gray-400 font-medium">Memuat percakapan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] lg:h-[calc(100vh-10rem)] flex flex-col overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-3 px-1 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Tanya FindSor!</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-gray-400 font-medium">AI Financial Advisor</p>
            </div>
          </div>
        </div>

        {hasMessages && (
          <button
            onClick={clearConversation}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            title="Hapus percakapan"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hapus Chat</span>
          </button>
        )}
      </div>

      {/* ── Chat Area ──────────────────────────────────────────────────── */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto min-h-0"
      >
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            /* ── Welcome State ──────────────────────────────────────── */
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col items-center justify-center px-6"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mb-5 shadow-xl shadow-emerald-500/25"
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-gray-900 mb-1 text-center"
              >
                Tanya FindSor!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-400 mb-8 text-center max-w-sm"
              >
                AI Financial Advisor — Siap membantu kamu memahami kondisi keuanganmu 24/7
              </motion.p>

              {/* Quick question bubbles */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-2 max-w-lg"
              >
                {quickQuestions.map((q, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    onClick={() => handleQuickQuestion(q)}
                    className="px-3.5 py-2 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {q}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            /* ── Messages ───────────────────────────────────────────── */
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-5"
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Assistant avatar */}
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className={`max-w-[80%] lg:max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-emerald-600 text-white rounded-tr-sm"
                        : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm"
                    }`}
                  >
                    <div className="text-[13px] leading-relaxed prose-sm">
                      {message.role === "assistant" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents}
                        >
                          {message.content || ""}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>

                  {/* User avatar */}
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && !isStreaming && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Sticky Input ───────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-gray-100 bg-white/80 backdrop-blur-xl px-4 py-3">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanyakan seputar keuanganmu..."
              className="w-full px-4 py-3 pr-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:bg-white outline-none transition-all text-sm placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-95 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-gray-300 mt-2 text-center">
          FindSor menggunakan AI untuk memberikan edukasi keuangan. Bukan pengganti financial planner profesional.
        </p>
      </div>
    </div>
  );
}
