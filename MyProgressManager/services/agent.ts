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

export interface ChatHistoryMessage {
  role: AgentRole;
  text: string;
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

export interface AgentConfig {
  name: string | null;
  avatar: string | null;
  behavior: Record<string, string>;
}

export interface AgentConfigInput {
  name: string | null;
  avatar: string | null;
  behavior: Record<string, string>;
}

function parseBehavior(value: unknown): Record<string, string> {
  let source = value;

  if (typeof source === "string") {
    const trimmed = source.trim();
    if (!trimmed) return {};
    try {
      source = JSON.parse(trimmed);
    } catch {
      return {};
    }
  }

  if (!source || typeof source !== "object" || Array.isArray(source)) return {};

  const behavior: Record<string, string> = {};
  for (const [key, entry] of Object.entries(source as Record<string, unknown>)) {
    if (entry == null) continue;
    const text = typeof entry === "string" ? entry : String(entry);
    if (text.trim()) behavior[key] = text;
  }

  return behavior;
}

function asText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function normalizeAgentConfig(payload: unknown): AgentConfig {
  if (Array.isArray(payload)) {
    return {
      name: asText(payload[0]),
      avatar: asText(payload[1]),
      behavior: parseBehavior(payload[2]),
    };
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    return {
      name: asText(record.agent_name) ?? asText(record.name),
      avatar: asText(record.avatar_picture) ?? asText(record.avatar),
      behavior: parseBehavior(record.user_data ?? record.behavior),
    };
  }

  return { name: null, avatar: null, behavior: {} };
}

function toRequestBody(input: AgentConfigInput) {
  return {
    agent_name: input.name,
    avatar_picture: input.avatar,
    user_data: input.behavior,
  };
}

export const AgentService = {
  async sendMessage(
    chatHistory: ChatHistoryMessage[],
    options: SendMessageOptions = {}
  ): Promise<string> {
    const payload = {
      chat_history: chatHistory,
      session_id: options.sessionId,
    };

    const data = await api.post<unknown>("/agent/message", payload, {
      signal: options.signal,
    });

    return normalizeReply(data);
  },

  async getConfig(options: { signal?: AbortSignal } = {}): Promise<AgentConfig> {
    const data = await api.get<unknown>("/agent", { signal: options.signal });
    return normalizeAgentConfig(data);
  },

  configure(input: AgentConfigInput): Promise<unknown> {
    return api.post<unknown>("/agent", toRequestBody(input));
  },

  update(input: AgentConfigInput): Promise<unknown> {
    return api.put<unknown>("/agent", toRequestBody(input));
  },
};

