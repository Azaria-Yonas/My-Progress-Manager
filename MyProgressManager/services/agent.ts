import { api } from "./api";

export type AgentRole = "user" | "assistant";

export interface AgentMessage {
  id: string;
  role: AgentRole;
  text: string;
  error?: boolean;
}

export interface SendMessageOptions {
  sessionId?: string;
  signal?: AbortSignal;
}

const REPLY_KEYS = [
  "reply",
  "message",
  "response",
  "text",
  "content",
  "answer",
  "output",
];

function normalizeReply(payload: unknown): string {
  if (typeof payload === "string") return payload.trim();

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of REPLY_KEYS) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    try {
      return JSON.stringify(payload);
    } catch {
      return String(payload);
    }
  }

  return payload == null ? "" : String(payload);
}

export const AgentService = {
  async sendMessage(text: string, options: SendMessageOptions = {}): Promise<string> {
    const payload = {
      message: text,
      session_id: options.sessionId,
    };

    const data = await api.post<unknown>("/agent/message", payload, {
      signal: options.signal,
    });

    return normalizeReply(data);
  },
};

