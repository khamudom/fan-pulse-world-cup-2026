"use client";

import { useState } from "react";
import {
  Banner,
  BannerDescription,
  BannerTitle,
} from "@lumen-ui/react";
import {
  isApiPreviewMode,
  USE_MOCK_FALLBACKS,
  USE_PROTOTYPE_DATA,
} from "@/config/dataSource";

export function ApiPreviewBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!isApiPreviewMode || dismissed) return null;

  const notes = [
    !USE_MOCK_FALLBACKS && "API mock fallbacks disabled",
    !USE_PROTOTYPE_DATA && "prototype sections hidden",
  ].filter(Boolean);

  return (
    <Banner variant="warning" onDismiss={() => setDismissed(true)}>
      <BannerTitle>API preview mode</BannerTitle>
      {notes.length > 0 && (
        <BannerDescription>{notes.join(" · ")}</BannerDescription>
      )}
      <BannerDescription>
        Green &quot;Live API&quot; badges mark real World Cup API data. Toggle
        flags in <code>src/config/dataSource.ts</code>.
      </BannerDescription>
    </Banner>
  );
}
