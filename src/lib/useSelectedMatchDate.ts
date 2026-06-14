"use client";

import { useMemo, useState } from "react";
import { getDefaultSelectedDate } from "@/lib/matchDate";
import { useClientTime } from "@/lib/useClientOnly";

export function useSelectedMatchDate(dates: string[]) {
  const [userPickedDate, setUserPickedDate] = useState<string | null>(null);
  const { now: clientDate, isReady } = useClientTime();

  const selectedDate = useMemo(() => {
    if (userPickedDate) return userPickedDate;
    if (!isReady) return "";
    return getDefaultSelectedDate(dates, clientDate);
  }, [userPickedDate, isReady, clientDate, dates]);

  return [selectedDate, setUserPickedDate, isReady] as const;
}
