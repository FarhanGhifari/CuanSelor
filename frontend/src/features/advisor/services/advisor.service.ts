import { apiClient } from "@/lib/api/axios.config";
import { API } from "@/lib/constants/api-endpoints";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at?: string;
}

interface ActiveConversationResponse {
  success: boolean;
  data: {
    conversation: Conversation;
    messages: ChatMessage[];
  };
}

/**
 * Fetch the active conversation + messages for the current user.
 */
export async function getActiveConversation(): Promise<{
  conversation: Conversation;
  messages: ChatMessage[];
}> {
  const { data } = await apiClient.get<ActiveConversationResponse>(
    API.ADVISOR.ACTIVE
  );
  return data.data;
}

/**
 * Send a chat message and process the SSE stream.
 * Returns conversation ID and calls onChunk for each streamed text chunk.
 */
export async function sendChatMessage(
  message: string,
  conversationId: string | null,
  onChunk: (chunk: string) => void,
  onConversationId?: (id: string) => void
): Promise<string> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const response = await fetch(`${BASE_URL}/api/advisor/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      message,
      conversationId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let fullResponse = "";
  let resolvedConvId = conversationId || "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    const lines = text.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      try {
        const payload = JSON.parse(line.slice(6));

        if (payload.type === "conversation_id") {
          resolvedConvId = payload.conversationId;
          onConversationId?.(resolvedConvId);
        } else if (payload.type === "chunk") {
          fullResponse += payload.content;
          onChunk(payload.content);
        } else if (payload.type === "done") {
          // Stream complete
        }
      } catch {
        // Skip malformed SSE lines
      }
    }
  }

  return fullResponse;
}

/**
 * Delete a conversation.
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  await apiClient.delete(
    `${API.ADVISOR.CONVERSATIONS}/${conversationId}`
  );
}
