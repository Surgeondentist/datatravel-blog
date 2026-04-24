"use client";

import { useEffect, useRef } from "react";

type AdUnitProps = {
  slot?: string;
  format?: string;
  layout?: string;
  fullWidthResponsive?: boolean;
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdUnit({
  slot,
  format = "auto",
  layout,
  fullWidthResponsive = true,
  className = "",
}: AdUnitProps) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
  const resolvedSlot = (slot?.trim() || process.env.NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT?.trim()) ?? "";

  useEffect(() => {
    if (!clientId || !resolvedSlot) return;
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense no disponible o bloqueado */
    }
  }, [clientId, resolvedSlot]);

  if (!clientId || !resolvedSlot.trim()) return null;

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: layout ? "block" : "block", textAlign: layout ? "center" : undefined }}
        data-ad-client={clientId}
        data-ad-slot={resolvedSlot}
        data-ad-format={format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        {...(fullWidthResponsive && !layout ? { "data-full-width-responsive": "true" } : {})}
      />
    </div>
  );
}
