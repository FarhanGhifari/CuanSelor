"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, User, Loader2 } from "lucide-react";

export default function TanyaFindSorPage() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Halo! Saya FindSor, AI Financial Advisor Anda. Saya siap membantu menjawab pertanyaan seputar perencanaan keuangan dan pensiun. Ada yang bisa saya bantu?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // TODO: Integrate with AI service
    // Simulasi response untuk sekarang
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Terima kasih atas pertanyaan Anda! Fitur AI chatbot sedang dalam pengembangan. Saat ini Anda dapat melihat proyeksi pensiun lengkap di Dashboard."
      }]);
      setIsLoading(false);
    }, 1500);
  };

  const quickQuestions = [
    "Bagaimana cara meningkatkan dana pensiun saya?",
    "Kapan waktu terbaik untuk mulai investasi?",
    "Apa itu ruin probability?",
    "Berapa persen gaji yang harus ditabung?"
  ];

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-3xl p-8 mb-6 text-white"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">Tanya FindSor!</h1>
            <p className="text-emerald-100">AI Financial Advisor - Siap Membantu 24/7</p>
          </div>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
              </div>
            </motion.div>
          )}

          {messages.length === 1 && (
            <div className="mt-8">
              <p className="text-sm font-medium text-gray-500 mb-4">Pertanyaan Populer:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="text-left p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 group"
                  >
                    <p className="text-sm text-gray-700 group-hover:text-emerald-700 font-medium">
                      {question}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Tanyakan sesuatu tentang keuangan Anda..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            FindSor menggunakan AI untuk memberikan saran. Selalu konsultasikan dengan ahli untuk keputusan finansial penting.
          </p>
        </div>
      </div>
    </div>
  );
}
