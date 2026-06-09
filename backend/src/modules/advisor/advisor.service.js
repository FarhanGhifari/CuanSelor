import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { supabase } from "../../config/supabase.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";

// ── Gemini Model ──────────────────────────────────────────────────────────────
const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-pro-preview",
  apiKey: env.geminiApiKey,
  temperature: 0.7,
  maxOutputTokens: 4096,
  topP: 0.95,
  streaming: true,
});

const DASHBOARD_INVESTMENT_SUGGESTIONS = {
  conservative: {
    label: "Konservatif",
    title: "Fokus stabil, pertumbuhan tetap ada",
    summary: "Porsi defensif lebih dominan untuk menjaga modal, dengan sedikit eksposur pertumbuhan dan lindung nilai.",
    badge: "Menjaga kestabilan",
    allocations: [
      { label: "Obligasi", percentage: 45, reason: "Menjaga arus return lebih stabil dan cocok untuk profil berhati-hati." },
      { label: "Emas", percentage: 35, reason: "Menjadi penyeimbang saat pasar bergejolak dan membantu menjaga nilai aset." },
      { label: "Saham", percentage: 20, reason: "Tetap memberi ruang pertumbuhan, tetapi dalam porsi yang terukur." },
    ],
  },
  moderate: {
    label: "Moderat",
    title: "Seimbang antara aman dan tumbuh",
    summary: "Komposisi dibuat lebih berimbang agar portofolio tetap bertumbuh tanpa terlalu agresif terhadap fluktuasi pasar.",
    badge: "Pertumbuhan terukur",
    allocations: [
      { label: "Saham", percentage: 45, reason: "Menjadi mesin pertumbuhan utama untuk horizon menengah hingga panjang." },
      { label: "Obligasi", percentage: 30, reason: "Membantu menjaga kestabilan portofolio saat pasar saham melemah." },
      { label: "Emas", percentage: 25, reason: "Menambah diversifikasi dan proteksi terhadap ketidakpastian ekonomi." },
    ],
  },
  aggressive: {
    label: "Agresif",
    title: "Agresif untuk mengejar pertumbuhan",
    summary: "Porsi saham dibuat dominan untuk mengejar return jangka panjang, dengan obligasi dan emas sebagai penyeimbang risiko.",
    badge: "Pertumbuhan maksimal",
    allocations: [
      { label: "Saham", percentage: 70, reason: "Menjadi porsi terbesar karena paling sesuai untuk target pertumbuhan tinggi." },
      { label: "Emas", percentage: 20, reason: "Menjadi buffer saat volatilitas pasar tinggi dan menjaga diversifikasi." },
      { label: "Obligasi", percentage: 10, reason: "Menambah unsur stabilitas tanpa terlalu mengurangi potensi return." },
    ],
  },
};

const INSTRUMENT_LABELS = {
  deposito: "Deposito Bank",
  ori_sbn: "ORI / SBN (Obligasi Pemerintah)",
  rd_pasar_uang: "Reksa Dana Pasar Uang",
  rd_pendapatan_tetap: "Reksa Dana Pendapatan Tetap",
  rd_campuran: "Reksa Dana Campuran",
  rd_saham_idx: "Reksa Dana Saham / IDX Composite",
};

function formatCurrency(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return `Rp ${Math.round(number).toLocaleString("id-ID")}`;
}

function formatPercent(value, fractionDigits = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const percent = Math.abs(number) <= 1 ? number * 100 : number;
  return `${percent.toFixed(fractionDigits)}%`;
}

function formatPercentagePoint(value, fractionDigits = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return `${(number * 100).toFixed(fractionDigits)} pp`;
}

function formatAllocationPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const percent = Math.abs(number) <= 1 ? number * 100 : number;
  return `${percent.toFixed(percent % 1 === 0 ? 0 : 1)}%`;
}

function pushIfPresent(parts, label, value) {
  if (value !== null && value !== undefined && value !== "") {
    parts.push(`${label}: ${value}`);
  }
}

function buildDashboardAllocationContext(riskProfile) {
  const suggestion =
    DASHBOARD_INVESTMENT_SUGGESTIONS[riskProfile] || DASHBOARD_INVESTMENT_SUGGESTIONS.moderate;

  const allocations = suggestion.allocations
    .map((item) => `${item.label} ${item.percentage}% - ${item.reason}`)
    .join(" | ");

  return [
    `Saran investasi dashboard untuk profil ${suggestion.label}: ${suggestion.title}`,
    `Ringkasan dashboard: ${suggestion.summary}`,
    `Badge dashboard: ${suggestion.badge}`,
    `Proporsi dashboard: ${allocations}`,
  ].join("\n");
}

function buildDetailedAllocationContext(allocation) {
  if (!allocation || typeof allocation !== "object") return null;

  const allocations = Object.entries(allocation)
    .map(([key, value]) => {
      const percent = formatAllocationPercent(value);
      if (!percent) return null;
      return `${INSTRUMENT_LABELS[key] || key}: ${percent}`;
    })
    .filter(Boolean);

  if (allocations.length === 0) return null;
  return `Alokasi detail kalkulator: ${allocations.join(" | ")}`;
}

function buildProjectionContext(projectionRow) {
  const result = projectionRow?.result_json;
  if (!result) return "Hasil proyeksi pensiun: Belum dihitung atau belum tersedia";

  const projection = result.projection || {};
  const median = projection.median_p50 || {};
  const pessimistic = projection.pessimistic_p10 || {};
  const optimistic = projection.optimistic_p90 || {};
  const actuarial = result.actuarial_summary || {};
  const recommendations = result.recommendations || {};
  const sensitivity = result.sensitivity || {};
  const metadata = result.metadata || {};
  const calculatorInput = projectionRow?.calculator_input || {};
  const simulationPlanningAge =
    calculatorInput.custom_planning_age || actuarial.planning_age_recommended;
  const dashboardRiskProfile = result.user_profile?.risk_profile || recommendations.effective_risk_profile || "moderate";

  const parts = ["Hasil proyeksi pensiun terbaru: Tersedia"];

  if (projectionRow.computed_at) {
    parts.push(`Waktu hitung proyeksi: ${new Date(projectionRow.computed_at).toISOString()}`);
  }

  pushIfPresent(parts, "Usia sekarang pada proyeksi", actuarial.current_age ?? result.user_profile?.age);
  pushIfPresent(parts, "Usia pensiun pada proyeksi", result.user_profile?.retirement_age);
  pushIfPresent(parts, "Target dana bertahan sampai usia pada simulasi", simulationPlanningAge);
  pushIfPresent(parts, "Usia rekomendasi aktuaria", actuarial.planning_age_recommended);
  pushIfPresent(parts, "Ekspektasi usia harapan hidup", actuarial.expected_death_age);
  pushIfPresent(parts, "Peluang hidup sampai pensiun", formatPercent(actuarial.survival_prob_at_retirement));

  pushIfPresent(parts, "Dana pensiun P10 pesimistis", formatCurrency(pessimistic.fund_at_retirement));
  pushIfPresent(parts, "Dana pensiun P50 median", formatCurrency(median.fund_at_retirement));
  pushIfPresent(parts, "Dana pensiun P90 optimistis", formatCurrency(optimistic.fund_at_retirement));
  pushIfPresent(parts, "Dana P50 dalam nilai uang hari ini", formatCurrency(median.real_fund_at_retirement));
  pushIfPresent(parts, "Kapasitas tarik tahunan P50", formatCurrency(median.annual_withdrawal_capacity));
  pushIfPresent(parts, "Probabilitas dana habis P50", formatPercent(median.ruin_probability));
  pushIfPresent(parts, "Perkiraan usia dana habis P50", median.fund_depleted_age ?? "Tidak habis sampai horizon simulasi");

  pushIfPresent(parts, "Dana minimum yang dibutuhkan", formatCurrency(recommendations.required_nest_egg));
  pushIfPresent(parts, "Surplus/gap dana P50", formatCurrency(recommendations.fund_gap_positive_means_surplus));
  pushIfPresent(parts, "Status on track", recommendations.is_on_track === true ? "On track" : recommendations.is_on_track === false ? "Belum on track" : null);
  pushIfPresent(parts, "Kontribusi bulanan saat ini", formatCurrency(recommendations.monthly_contribution_current));
  pushIfPresent(parts, "Profil risiko efektif", recommendations.effective_risk_profile);
  pushIfPresent(parts, "Return portofolio rata-rata", recommendations.portfolio_nominal_return_mean);
  pushIfPresent(parts, "Volatilitas portofolio", recommendations.portfolio_std);
  parts.push(buildDashboardAllocationContext(dashboardRiskProfile));
  const detailedAllocationContext = buildDetailedAllocationContext(recommendations.allocation);
  if (detailedAllocationContext) parts.push(detailedAllocationContext);
  if (Array.isArray(recommendations.instruments_in_portfolio) && recommendations.instruments_in_portfolio.length > 0) {
    const instruments = recommendations.instruments_in_portfolio
      .map((key) => INSTRUMENT_LABELS[key] || key)
      .join(", ");
    parts.push(`Instrumen dalam portofolio kalkulator: ${instruments}`);
  }

  if (sensitivity.if_retirement_delayed_3yr) {
    pushIfPresent(
      parts,
      "Jika pensiun ditunda 3 tahun",
      `dana berubah ${formatPercent(sensitivity.if_retirement_delayed_3yr.fund_change_pct)}, risiko dana habis berubah ${formatPercentagePoint(sensitivity.if_retirement_delayed_3yr.ruin_change)}`,
    );
  }

  if (sensitivity.if_savings_rate_plus_10pct) {
    pushIfPresent(
      parts,
      "Jika savings rate naik 10%",
      `dana berubah ${formatPercent(sensitivity.if_savings_rate_plus_10pct.fund_change_pct)}, risiko dana habis berubah ${formatPercentagePoint(sensitivity.if_savings_rate_plus_10pct.ruin_change)}`,
    );
  }

  if (Array.isArray(result.actionable_insights) && result.actionable_insights.length > 0) {
    parts.push(`Insight kalkulator: ${result.actionable_insights.slice(0, 3).join(" | ")}`);
  }

  pushIfPresent(parts, "Sumber mortalitas", metadata.mortality_source || actuarial.source);
  pushIfPresent(parts, "Jumlah simulasi", metadata.n_simulations?.toLocaleString?.("id-ID") || metadata.n_simulations);

  return parts.join("\n");
}

// ── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Kamu adalah **FindSor**, AI Financial Advisor di platform CuanSelor — aplikasi perencanaan keuangan & pensiun untuk anak muda Indonesia.

PERAN:
- Membantu user memahami kondisi keuangannya berdasarkan data yang tersedia.
- Memberikan edukasi seputar investasi, tabungan, pensiun, dan perencanaan keuangan.
- Menganalisis data finansial user dan memberikan insight personal.

ATURAN KETAT:
1. Jawab HANYA pertanyaan seputar keuangan pribadi, investasi, pensiun, tabungan, budgeting, dan perencanaan finansial.
2. Jika ditanya di luar topik keuangan (misalnya coding, resep masakan, politik), tolak dengan sopan: "Maaf, saya hanya bisa membantu soal keuangan. Ada pertanyaan finansial yang bisa saya bantu? 😊"
3. JANGAN PERNAH merekomendasikan emiten saham, merek reksa dana, atau produk investasi SPESIFIK. Boleh membahas kelas aset umum seperti Saham, Emas, Obligasi, deposito, SBN, dan reksa dana secara edukatif.
4. JANGAN memberikan saran pajak yang spesifik — arahkan ke konsultan pajak.
5. Selalu akhiri saran penting dengan disclaimer: "💡 *Ini bukan saran investasi resmi. Untuk keputusan besar, konsultasikan dengan financial planner bersertifikat.*"
6. Gunakan bahasa Indonesia yang ramah, santai, tapi tetap profesional. Sesekali pakai emoji untuk kesan friendly.
7. Jika data user tersedia, referensikan secara spesifik (misalnya "Dengan gaji Rp X juta/bulan dan tabungan Y%...").
8. Gunakan format Markdown untuk respons (bold, bullet points, numbering) agar rapi dan mudah dibaca.
9. Jawab dengan ringkas dan to-the-point. Maksimal 300 kata per respons kecuali user meminta penjelasan detail.
10. Jika user belum punya data lengkap, sarankan untuk melengkapi profil di menu "Profil & Finansial".
11. Jika HASIL PROYEKSI PENSIUN TERBARU tersedia, prioritaskan angka tersebut untuk pertanyaan tentang pensiun, target dana, risiko dana habis, surplus/gap, alokasi portofolio, dan skenario sensitivitas.
12. Jangan mengarang angka. Jika hasil proyeksi belum tersedia, katakan bahwa proyeksi perlu dihitung dulu di menu Proyeksi sebelum bisa membahas angka kalkulasi.
13. Ikuti flow jawaban: jawab pertanyaan utama dulu, rujuk data user/proyeksi yang relevan, beri 1-3 langkah praktis, lalu akhiri dengan disclaimer saat memberi strategi atau saran penting.`;

// ── User Context Builder ──────────────────────────────────────────────────────
async function buildUserContext(userId) {
  const [userResult, financialResult, pensionResult, riskResult, profileResult, projectionResult] =
    await Promise.all([
      supabase.from("user").select("name, email").eq("id", userId).single(),
      supabase
        .from("financial_records")
        .select("monthly_income, monthly_expenses, saving_percentage, cold_cash, annual_bonus, expected_annual_return")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("retirement_plans")
        .select("target_retirement_age, post_retirement_lifestyle, planning_age")
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
      supabase
        .from("projection_results")
        .select("result_json, calculator_input, computed_at")
        .eq("user_id", userId)
        .order("computed_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  const user = userResult.data;
  const financial = financialResult.data;
  const pension = pensionResult.data;
  const risk = riskResult.data;
  const profile = profileResult.data;
  const projection = projectionResult.data;

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
    if (pension.planning_age) parts.push(`Target dana bertahan sampai usia: ${pension.planning_age} tahun`);
    parts.push(`Gaya hidup pasca-pensiun: ${pension.post_retirement_lifestyle}% dari gaya hidup sekarang`);
  } else {
    parts.push("Rencana pensiun: Belum diisi");
  }

  parts.push(buildProjectionContext(projection));

  // Risk profile
  if (risk) {
    const riskLabels = {
      conservative: "Konservatif (hati-hati)",
      moderate: "Moderat (seimbang)",
      aggressive: "Agresif (berani ambil risiko)",
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
    new SystemMessage(`${SYSTEM_PROMPT}\n\nDATA USER DAN HASIL KALKULASI (gunakan sebagai konteks saat menjawab, jangan tampilkan mentah kecuali relevan):\n${userContext}`),
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
  const { data, error } = await supabase
    .from("chat_conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new AppError("Gagal menghapus percakapan", 500, error.message);
  }

  if (!data) {
    throw new AppError("Percakapan tidak ditemukan", 404);
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
