import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
  chatWithAdvisor,
  getConversations,
  getConversationMessages,
  removeConversation,
  getActiveConversation,
} from "./advisor.controller.js";

export const advisorRouter = express.Router();

// All routes require authentication
advisorRouter.use(requireAuth);

// Chat (SSE streaming)
advisorRouter.post("/chat", chatWithAdvisor);

// Get active conversation + messages (for page load)
advisorRouter.get("/active", getActiveConversation);

// Conversation management
advisorRouter.get("/conversations", getConversations);
advisorRouter.get("/conversations/:id/messages", getConversationMessages);
advisorRouter.delete("/conversations/:id", removeConversation);
