"use client";

import { useState } from "react";
import type { Sector } from "@/types";
import { offerFallbackImage } from "@/lib/commerce/media";

type Aspect = "video" | "4/3" | "square" | "fill";

/**
 * Apple-grade media frame — fixed aspect + object-cover, never warps layout.
 */
export function OfferImage({
  src,
  sector,
  className,
  alt = "",
  aspect = "4/3",
}: {
  src?: string | null;
  sector: Sector;
  className?: string;
  alt?: string;
  aspect?: Aspect;
}) {
  const fallback = offerFallbackImage(sector);
  const initial = src && src.trim().length > 8 ? src : fallback;
  const [url, setUrl] = useState(initial);

  const aspectClass =
    aspect === "video"
      ? "aspect-video"
      : aspect === "square"
        ? "aspect-square"
        : aspect === "fill"
          ? "h-full w-full"
          : "aspect-[4/3]";

  return (
    <div
      className={`nx-media-frame ${aspectClass} ${className ?? ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => {
          if (url !== fallback) setUrl(fallback);
        }}
      />
    </div>
  );
}
