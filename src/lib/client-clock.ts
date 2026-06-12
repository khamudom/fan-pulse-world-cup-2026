import { useSyncExternalStore } from "react";

let clockSnapshot = 0;

export function subscribeToClientClock(onStoreChange: () => void) {
  clockSnapshot = Date.now();
  onStoreChange();

  const timer = window.setInterval(() => {
    clockSnapshot = Date.now();
    onStoreChange();
  }, 1000);

  return () => window.clearInterval(timer);
}

export function getClientClockSnapshot() {
  return clockSnapshot;
}

export function getServerClockSnapshot() {
  return 0;
}

export function useClientClock(): { now: Date; isHydrated: boolean } {
  const timestamp = useSyncExternalStore(
    subscribeToClientClock,
    getClientClockSnapshot,
    getServerClockSnapshot,
  );

  return {
    now: new Date(timestamp),
    isHydrated: timestamp > 0,
  };
}
