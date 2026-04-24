"use client";

import { useEffect } from "react";

/** Carga el script de AdSense sin next/script para evitar el atributo data-nscript que advierte la consola de Google. */
export default function AdSenseScript() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();

  useEffect(() => {
    if (!clientId) return;
    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, [clientId]);

  return null;
}
