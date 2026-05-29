import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { supabase } from "../../config/supabase.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";

// ── Gemini Model ──────────────────────────────────────────────────────────────
const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash",
  apiKey: env.geminiApiKey,
  temperature: 0.7,
  maxOutputTokens: 4096,
  topP: 0.95,
  streaming: true,
});

// ── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Kamu adalah **FindSor**, AI Financial Advisor di platform CuanSelor — aplikasi perencanaan keuangan & pensiun untuk anak muda Indonesia.

PERAN:
- Membantu user memahami kondisi keuangannya berdasarkan data yang tersedia.
- Memberikan edukasi seputar investasi, tabungan, pensiun, dan perencanaan keuangan.
- Menganalisis data finansial user dan memberikan insight personal.

ATURAN KETAT:
1. Jawab HANYA pertanyaan seputar keuangan pribadi, investasi, pensiun, tabungan, budgeting, dan perencanaan finansial.
2. Jika ditanya di luar topik keuangan (misalnya coding, resep masakan, politik), tolak dengan sopan: "Maaf, saya hanya bisa membantu soal keuangan. Ada pertanyaan finansial yang bisa saya bantu? 😊"
3. JANGAN PERNAH merekomendasikan saham, reksa dana, atau produk investasi SPESIFIK. Berikan edukasi umum tentang jenis-jenis instrumen saja.
4. JANGAN memberikan saran pajak yang spesifik — arahkan ke konsultan pajak.
5. Selalu akhiri saran penting dengan disclaimer: "💡 *Ini bukan saran investasi resmi. Untuk keputusan besar, konsultasikan dengan financial planner bersertifikat.*"
6. Gunakan bahasa Indonesia yang ramah, santai, tapi tetap profesional. Sesekali pakai emoji untuk kesan friendly.
7. Jika data user tersedia, referensikan secara spesifik (misalnya "Dengan gaji Rp X juta/bulan dan tabungan Y%...").
8. Gunakan format Markdown untuk respons (bold, bullet points, numbering) agar rapi dan mudah dibaca.
9. Jawab dengan ringkas dan to-the-point. Maksimal 300 kata per respons kecuali user meminta penjelasan detail.
10. Jika user belum punya data lengkap, sarankan untuk melengkapi profil di menu "Profil & Finansial".`;

// ── User Context Builder ──────────────────────────────────────────────────────
async function buildUserContext(userId) {
  const [userResult, financialResult, pensionResult, riskResult, profileResult] =
    await Promise.all([
      supabase.from("user").select("name, email").eq("id", userId).single(),
      supabase
        .from("financial_records")
        .select("monthly_income, monthly_expenses, saving_percentage, cold_cash, annual_bonus, expected_annual_return")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("retirement_plans")
        .select("target_retirement_age, post_retirement_lifestyle")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("risk_profiles")
        .select("risk_category, answers, assessed_at")
        .eq("user_id", userId)
        .order("assessed_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("full_name, gender, date_of_birth")
        .eq("id", userId)
        .maybeSingle(),
    ]);

  const user = userResult.data;
  const financial = financialResult.data;
  const pension = pensionResult.data;
  const risk = riskResult.data;
  const profile = profileResult.data;

  const parts = [];

  // Personal info
  const name = profile?.full_name || user?.name || "User";
  parts.push(`Nama: ${name}`);

  if (profile?.date_of_birth) {
    const birthYear = new Date(profile.date_of_birth).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    parts.push(`Usia: ${age} tahun`);
  }
  if (profile?.gender) {
    parts.push(`Gender: ${profile.gender}`);
  }

  // Financial data
  if (financial) {
    const fmt = (n) => {
      if (!n || n === 0) return "Rp 0";
      return `Rp ${Number(n).toLocaleString("id-ID")}`;
    };
    parts.push(`Pendapatan bulanan: ${fmt(financial.monthly_income)}`);
    if (financial.monthly_expenses) parts.push(`Pengeluaran bulanan: ${fmt(financial.monthly_expenses)}`);
    parts.push(`Persentase tabungan: ${financial.saving_percentage}%`);
    parts.push(`Tabungan/aset saat ini: ${fmt(financial.cold_cash)}`);
    if (financial.annual_bonus) parts.push(`Bonus tahunan: ${financial.annual_bonus} bulan gaji`);
    if (financial.expected_annual_return) parts.push(`Expected annual return: ${financial.expected_annual_return}%`);
  } else {
    parts.push("Data finansial: Belum diisi");
  }

  // Pension plan
  if (pension) {
    parts.push(`Target usia pensiun: ${pension.target_retirement_age} tahun`);
    parts.push(`Gaya hidup pasca-pensiun: ${pension.post_retirement_lifestyle}% dari gaya hidup sekarang`);
  } else {
    parts.push("Rencana pensiun: Belum diisi");
  }

  // Risk profile
  if (risk) {
    const riskLabels = {
      conservative: "Konservatif (hati-hati)",
      moderate: "Moderat (seimbang)",
      aggressive: "Agresif (berani ambil risiko)",
      very_aggressive: "Sangat Agresif",
    };
    parts.push(`Profil risiko: ${riskLabels[risk.risk_category] || risk.risk_category}`);
  } else {
    parts.push("Profil risiko: Belum dinilai");
  }

  return parts.join("\n");
}

// ── Conversation Management ───────────────────────────────────────────────────

/**
 * Get or create the active conversation for a user.
 * Strategy: 1 active conversation per user (most recent).
 */
export async function getOrCreateConversation(userId) {
  // Try to find existing conversation
  const { data: existing, error: findError } = await supabase
    .from("chat_conversations")
    .select("id, title, created_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findError) {
    throw new AppError("Gagal mengambil data percakapan", 500, findError.message);
  }

  if (existing) return existing;

  // Create new conversation
  const { data: created, error: createError } = await supabase
    .from("chat_conversations")
    .insert({ user_id: userId })
    .select("id, title, created_at")
    .single();

  if (createError) {
    throw new AppError("Gagal membuat percakapan baru", 500, createError.message);
  }

  return created;
}

/**
 * Load chat history from database for a conversation.
 */
export async function loadChatHistory(conversationId, userId) {
  // Verify ownership
  const { data: conv, error: convError } = await supabase
    .from("chat_conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .single();

  if (convError || !conv) {
    throw new AppError("Percakapan tidak ditemukan", 404);
  }

  const { data: messages, error } = await supabase
    .from("chat_messages")
    .select("role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new AppError("Gagal mengambil riwayat chat", 500, error.message);
  }

  return messages || [];
}

/**
 * Save a message to the database.
 */
async function saveMessage(conversationId, role, content) {
  const { error } = await supabase
    .from("chat_messages")
    .insert({ conversation_id: conversationId, role, content });

  if (error) {
    console.error("[ADVISOR] Failed to save message:", error.message);
  }

  // Update conversation's updated_at
  await supabase
    .from("chat_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);
}

/**
 * Auto-generate conversation title from first user message.
 */
async function maybeUpdateTitle(conversationId, userMessage) {
  const { data } = await supabase
    .from("chat_conversations")
    .select("title")
    .eq("id", conversationId)
    .single();

  if (data?.title === "Percakapan Baru") {
    const title = userMessage.length > 50 ? userMessage.substring(0, 47) + "..." : userMessage;
    await supabase
      .from("chat_conversations")
      .update({ title })
      .eq("id", conversationId);
  }
}

// ── Chat with AI (Streaming) ──────────────────────────────────────────────────

/**
 * Send a message and stream the AI response.
 * @param {string} userId
 * @param {string} conversationId
 * @param {string} userMessage
 * @param {function} onChunk - callback(chunk: string) for streaming
 * @returns {Promise<string>} full AI response
 */
export async function chat(userId, conversationId, userMessage, onChunk) {
  // 1. Build context
  const userContext = await buildUserContext(userId);

  // 2. Load conversation history from DB
  const history = await loadChatHistory(conversationId, userId);

  // 3. Build LangChain message array
  const messages = [
    new SystemMessage(`${SYSTEM_PROMPT}\n\nDATA USER (gunakan sebagai konteks saat menjawab):\n${userContext}`),
  ];

  // Add history (limit last 20 messages to keep context window reasonable)
  const recentHistory = history.slice(-20);
  for (const msg of recentHistory) {
    if (msg.role === "user") {
      messages.push(new HumanMessage(msg.content));
    } else if (msg.role === "assistant") {
      messages.push(new AIMessage(msg.content));
    }
  }

  // Add current user message
  messages.push(new HumanMessage(userMessage));

  // 4. Save user message to DB
  await saveMessage(conversationId, "user", userMessage);
  await maybeUpdateTitle(conversationId, userMessage);

  // 5. Stream response from Gemini
  let fullResponse = "";

  try {
    const stream = await model.stream(messages);

    for await (const chunk of stream) {
      const text = chunk.content;
      if (text) {
        fullResponse += text;
        if (onChunk) onChunk(text);
      }
    }
  } catch (err) {
    console.error("[ADVISOR] Gemini error:", err.message);

    // Fallback response on error
    fullResponse =
      "Maaf, saya sedang mengalami gangguan teknis. Silakan coba lagi dalam beberapa saat. 🙏";
    if (onChunk) onChunk(fullResponse);
  }

  // 6. Save assistant response to DB
  await saveMessage(conversationId, "assistant", fullResponse);

  return fullResponse;
}

/**
 * Delete a conversation and all its messages.
 */
export async function deleteConversation(conversationId, userId) {
  const { error } = await supabase
    .from("chat_conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", userId);

  if (error) {
    throw new AppError("Gagal menghapus percakapan", 500, error.message);
  }
}

/**
 * List all conversations for a user.
 */
export async function listConversations(userId) {
  const { data, error } = await supabase
    .from("chat_conversations")
    .select("id, title, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new AppError("Gagal mengambil daftar percakapan", 500, error.message);
  }

  return data || [];
}
