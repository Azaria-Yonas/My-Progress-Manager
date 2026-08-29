// services/notify.ts


import { API_BASE_URL } from "../constants/config";
import { getToken } from "./tokenStorage";

export type NotifyTable =
  | "tasks"
  | "completed_tasks"
  | "streaks"
  | "completed_streaks"
  | "agent";

type Listener = (table: NotifyTable) => void;

const RECONNECT_DELAY_MS = 3000;

const listeners = new Set<Listener>();

let socket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let stopped = false;

async function connect() {
  if (socket || stopped) return;

  const token = await getToken();
  if (!token) return;

  const url = `${API_BASE_URL.replace(/^http/, "ws")}/notify`;

  const ws: WebSocket = new (WebSocket as any)(url, undefined, {
    headers: { Authorization: `Bearer ${token}` },
  });
  socket = ws;

  ws.onmessage = (event) => {
    const raw = typeof event.data === "string" ? event.data : "";
    let parsed: any = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }
    if (!parsed || typeof parsed.table !== "string") return;
    listeners.forEach((listener) => listener(parsed.table));
  };

  ws.onerror = () => {};

  ws.onclose = () => {
    if (socket === ws) socket = null;
    if (stopped || listeners.size === 0) return;
    reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
  };
}

function disconnect() {
  stopped = true;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  const ws = socket;
  socket = null;
  try {
    ws?.close();
  } catch {}
}

export const NotifyService = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    stopped = false;
    connect();

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) disconnect();
    };
  },

  reset() {
    disconnect();
    if (listeners.size > 0) {
      stopped = false;
      connect();
    }
  },
};
