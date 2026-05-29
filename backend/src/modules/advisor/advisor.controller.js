import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/api-response.js";
import {
  chat,
  getOrCreateConversation,
  loadChatHistory,
  deleteConversation,
  listConversations,
} from "./advisor.service.js";

// ── POST /api/advisor/chat ────────────────────────────────────────────────────
// Streaming response via SSE (Server-Sent Events)
export const chatWithAdvisor = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { message, conversationId } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ success: false, message: "Pesan tidak boleh kosong" });
  }

  // Get or create conversation
  let convId = conversationId;
  if (!convId) {
    const conv = await getOrCreateConversation(userId);
    convId = conv.id;
  }

  // Set SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  // Send conversation ID first
  res.write(`data: ${JSON.stringify({ type: "conversation_id", conversationId: convId })}\n\n`);

  // Stream AI response
  await chat(userId, convId, message.trim(), (chunk) => {
    res.write(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`);
  });

  // Signal done
  res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
  res.end();
});

// ── GET /api/advisor/conversations ────────────────────────────────────────────
export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await listConversations(req.user.id);
  return ok(res, conversations);
});

// ── GET /api/advisor/conversations/:id/messages ───────────────────────────────
export const getConversationMessages = asyncHandler(async (req, res) => {
  const messages = await loadChatHistory(req.params.id, req.user.id);
  return ok(res, messages);
});

// ── DELETE /api/advisor/conversations/:id ─────────────────────────────────────
export const removeConversation = asyncHandler(async (req, res) => {
  await deleteConversation(req.params.id, req.user.id);
  return ok(res, null, "Percakapan berhasil dihapus");
});

// ── GET /api/advisor/active ───────────────────────────────────────────────────
// Get or create the active conversation (for initial page load)
export const getActiveConversation = asyncHandler(async (req, res) => {
  const conversation = await getOrCreateConversation(req.user.id);
  const messages = await loadChatHistory(conversation.id, req.user.id);
  return ok(res, { conversation, messages });
});
