// constants/agentAvatars.ts

import { ImageSourcePropType } from "react-native";

export interface AgentAvatar {
  key: string;
  source: ImageSourcePropType;
}

export const AGENT_AVATARS: AgentAvatar[] = [
  { key: "agent0", source: require("../assets/images/agent0.png") },
  { key: "agent1", source: require("../assets/images/agent1.png") },
  { key: "agent2", source: require("../assets/images/agent2.png") },
  { key: "agent3", source: require("../assets/images/agent3.png") },
  { key: "agent4", source: require("../assets/images/agent4.png") },
  { key: "agent5", source: require("../assets/images/agent5.png") },
];

export const DEFAULT_AGENT_NAME = "Assistant Agent";

export function normalizeAvatarKey(value?: string | null): string | null {
  if (typeof value !== "string") return null;
  const key = value.trim().replace(/\.[^.]+$/, "").toLowerCase();
  return AGENT_AVATARS.some((avatar) => avatar.key === key) ? key : null;
}

export function getAgentAvatarSource(
  value?: string | null
): ImageSourcePropType | null {
  const key = normalizeAvatarKey(value);
  if (!key) return null;
  return AGENT_AVATARS.find((avatar) => avatar.key === key)?.source ?? null;
}
