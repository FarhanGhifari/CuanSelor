import { useState, useCallback, useRef, useEffect } from "react";
import {
  getActiveConversation,
  sendChatMessage,
  deleteConversation,
  type ChatMessage,
  type Conversation,
} from "../services/advisor.service";

interface UseAdvisorReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  conversationId: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => Promise<void>;
  loadConversation: () => Promise<void>;
  initialized: boolean;
}

export function useAdvisor(): UseAdvisorReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const streamingRef = useRef(false);

  // Load existing conversation on mount
  const loadConversation = useCallback(async () => {
    try {
      const { conversation, messages: history } = await getActiveConversation();
      setConversationId(conversation.id);
      setMessages(
        history.map((m) => ({
          role: m.role,
          content: m.content,
          created_at: m.created_at,
        }))
      );
    } catch (err) {
      console.error("[useAdvisor] Failed to load conversation:", err);
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  // Send a message
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || streamingRef.current) return;

      // Optimistic: add user message immediately
      const userMsg: ChatMessage = { role: "user", content: message.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      streamingRef.current = true;

      // Add empty assistant message for streaming
      const assistantIdx = { current: 0 };
      setMessages((prev) => {
        assistantIdx.current = prev.length;
        return [...prev, { role: "assistant", content: "" }];
      });

      try {
        setIsStreaming(true);

        await sendChatMessage(
          message.trim(),
          conversationId,
          // onChunk: append to the assistant's message
          (chunk) => {
            setMessages((prev) => {
              const updated = [...prev];
              const lastMsg = updated[updated.length - 1];
              if (lastMsg && lastMsg.role === "assistant") {
                updated[updated.length - 1] = {
                  ...lastMsg,
                  content: lastMsg.content + chunk,
                };
              }
              return updated;
            });
          },
          // onConversationId
          (id) => {
            setConversationId(id);
          }
        );
      } catch (err) {
        console.error("[useAdvisor] Chat error:", err);
        // Update the assistant message with error
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.role === "assistant" && !lastMsg.content) {
            updated[updated.length - 1] = {
              ...lastMsg,
              content:
                "Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi. 🙏",
            };
          }
          return updated;
        });
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        streamingRef.current = false;
      }
    },
    [conversationId]
  );

  // Clear conversation and start fresh
  const clearConversation = useCallback(async () => {
    if (conversationId) {
      try {
        await deleteConversation(conversationId);
      } catch {
        // OK if it fails — we still clear locally
      }
    }
    setMessages([]);
    setConversationId(null);

    // Create a fresh conversation
    try {
      const { conversation } = await getActiveConversation();
      setConversationId(conversation.id);
    } catch {
      // Will be created on next message
    }
  }, [conversationId]);

  return {
    messages,
    isLoading,
    isStreaming,
    conversationId,
    sendMessage,
    clearConversation,
    loadConversation,
    initialized,
  };
}
