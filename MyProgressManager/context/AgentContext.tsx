// context/AgentContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { ImageSourcePropType } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "./AuthProvider";
import {
  AgentService,
  AgentConfig,
  AgentConfigInput,
  normalizeAgentConfig,
} from "../services/agent";
import {
  DEFAULT_AGENT_NAME,
  getAgentAvatarSource,
  normalizeAvatarKey,
} from "../constants/agentAvatars";
import AgentSetup from "../components/AgentSetup";
import { AgentFabPosition, snapFabPosition } from "../styles/AgentChatStyles";

interface AgentContextType {
  config: AgentConfig | null;
  configured: boolean;
  loading: boolean;
  syncError: string | null;
  agentName: string;
  avatarKey: string | null;
  avatarSource: ImageSourcePropType | null;
  behavior: Record<string, string>;
  fabPosition: AgentFabPosition | null;
  setFabPosition: (position: AgentFabPosition) => void;
  openSetup: () => void;
  refresh: () => Promise<void>;
}

const AgentContext = createContext<AgentContextType | null>(null);

const configKey = (userId: string) => `agent_config:${userId}`;
const skipKey = (userId: string) => `agent_setup_skipped:${userId}`;
const FAB_POSITION_KEY = "agent_fab_position";

function hasContent(config: AgentConfig | null): boolean {
  if (!config) return false;
  return Boolean(
    config.name || config.avatar || Object.keys(config.behavior).length > 0
  );
}

export function AgentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [setupVisible, setSetupVisible] = useState(false);
  const [fabPosition, setFabPositionState] = useState<AgentFabPosition | null>(null);

  const existsRemoteRef = useRef(false);
  const requestRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(FAB_POSITION_KEY);
        if (cancelled || !raw) return;
        const parsed = JSON.parse(raw);
        if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
          setFabPositionState(snapFabPosition(parsed.x, parsed.y));
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setFabPosition = useCallback((position: AgentFabPosition) => {
    setFabPositionState(position);
    AsyncStorage.setItem(FAB_POSITION_KEY, JSON.stringify(position)).catch(() => {});
  }, []);

  const readCache = useCallback(async (id: string): Promise<AgentConfig | null> => {
    try {
      const raw = await AsyncStorage.getItem(configKey(id));
      if (!raw) return null;
      const parsed = normalizeAgentConfig(JSON.parse(raw));
      return hasContent(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }, []);

  const writeCache = useCallback(async (id: string, value: AgentConfig) => {
    try {
      await AsyncStorage.setItem(configKey(id), JSON.stringify(value));
    } catch {}
  }, []);

  const load = useCallback(
    async (id: string, promptIfMissing: boolean) => {
      requestRef.current += 1;
      const requestId = requestRef.current;
      const isStale = () => requestRef.current !== requestId;

      setLoading(true);

      const cached = await readCache(id);
      if (isStale()) return;
      if (cached) setConfig(cached);

      try {
        const remote = await AgentService.getConfig();
        if (isStale()) return;
        existsRemoteRef.current = true;
        setConfig(remote);
        setSyncError(null);
        await writeCache(id, remote);
      } catch {
        if (isStale()) return;
        existsRemoteRef.current = false;
        if (!cached) {
          setConfig(null);
          if (promptIfMissing) {
            const skipped = await AsyncStorage.getItem(skipKey(id));
            if (!isStale() && !skipped) setSetupVisible(true);
          }
        }
      } finally {
        if (!isStale()) setLoading(false);
      }
    },
    [readCache, writeCache]
  );

  useEffect(() => {
    if (!userId) {
      requestRef.current += 1;
      setConfig(null);
      setSetupVisible(false);
      setSyncError(null);
      setLoading(false);
      existsRemoteRef.current = false;
      return;
    }

    load(userId, true);
  }, [userId, load]);

  const refresh = useCallback(async () => {
    if (!userId) return;
    await load(userId, false);
  }, [userId, load]);

  const openSetup = useCallback(() => setSetupVisible(true), []);

  const handleDismiss = useCallback(async () => {
    setSetupVisible(false);
    if (userId && !hasContent(config)) {
      try {
        await AsyncStorage.setItem(skipKey(userId), "1");
      } catch {}
    }
  }, [userId, config]);

  const handleSave = useCallback(
    async (input: AgentConfigInput) => {
      const next: AgentConfig = {
        name: input.name,
        avatar: normalizeAvatarKey(input.avatar),
        behavior: input.behavior,
      };

      let remoteError: string | null = null;
      try {
        if (existsRemoteRef.current) await AgentService.update(input);
        else await AgentService.configure(input);
        existsRemoteRef.current = true;
      } catch (err: any) {
        remoteError = err?.message
          ? `Saved on this device. Sync failed: ${err.message}`
          : "Saved on this device. We could not sync it to the server yet.";
      }

      setConfig(next);
      setSyncError(remoteError);
      if (userId) {
        await writeCache(userId, next);
        try {
          await AsyncStorage.removeItem(skipKey(userId));
        } catch {}
      }
      setSetupVisible(false);
    },
    [userId, writeCache]
  );

  const avatarKey = normalizeAvatarKey(config?.avatar);

  return (
    <AgentContext.Provider
      value={{
        config,
        configured: hasContent(config),
        loading,
        syncError,
        agentName: config?.name || DEFAULT_AGENT_NAME,
        avatarKey,
        avatarSource: getAgentAvatarSource(avatarKey),
        behavior: config?.behavior ?? {},
        fabPosition,
        setFabPosition,
        openSetup,
        refresh,
      }}
    >
      {children}

      <AgentSetup
        visible={setupVisible}
        mode={hasContent(config) ? "edit" : "onboarding"}
        initialConfig={config}
        onDismiss={handleDismiss}
        onSave={handleSave}
      />
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used inside AgentProvider");
  return ctx;
}
