
export type IntervalEvent = "hit" | "miss" | "fail" | "restart";

export interface IntervalEntry {
  index: number;
  status: IntervalEvent;
}

export interface StreakHistoryState {
  intervals: IntervalEntry[];
  lastCooldownEndUnix: number | null;
  lastTapUnix: number | null;
}


export function initHistory(): StreakHistoryState {
  return {
    intervals: [],
    lastCooldownEndUnix: null,
    lastTapUnix: null,
  };
}


export function recordTap(
  state: StreakHistoryState,
  nowUnix: number,
  durationSeconds: number
): StreakHistoryState {
  const newState = { ...state };
  const lastCool = state.lastCooldownEndUnix;
  const lastTap = state.lastTapUnix;

  const index = newState.intervals.length + 1;

  if (!lastTap) {
    newState.intervals.push({ index, status: "hit" });
    newState.lastTapUnix = nowUnix;
    newState.lastCooldownEndUnix = nowUnix + durationSeconds;
    return newState;
  }

  if (nowUnix < lastCool!) {
    return newState;
  }

  if (nowUnix >= lastCool! + durationSeconds) {
    newState.intervals.push({ index, status: "restart" });
    newState.lastTapUnix = nowUnix;
    newState.lastCooldownEndUnix = nowUnix + durationSeconds;
    return newState;
  }

  newState.intervals.push({ index, status: "hit" });
  newState.lastTapUnix = nowUnix;
  newState.lastCooldownEndUnix = nowUnix + durationSeconds;
  return newState;
}

export function recordFail(state: StreakHistoryState): StreakHistoryState {
  const index = state.intervals.length + 1;
  return {
    ...state,
    intervals: [...state.intervals, { index, status: "fail" }],
  };
}


export function exportCalendarData(state: StreakHistoryState) {
  const out: any = {};
  for (const entry of state.intervals) {
    out[String(entry.index)] = {
      status: entry.status,
      index: entry.index,
    };
  }
  return out;
}
