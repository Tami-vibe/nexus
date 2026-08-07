"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";

type StoryKind = "product" | "slot";

type Props = {
  vat: string;
  businessName: string;
  products: Array<{ product_name: string | null }>;
  appointments: Array<{ service_name: string | null }>;
  hotLeadCount: number;
};

export function BroadcastEngine({
  vat,
  businessName,
  products,
  appointments,
  hotLeadCount,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [kind, setKind] = useState<StoryKind>("slot");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const headline = useMemo(() => {
    if (kind === "product") {
      const name = products[0]?.product_name || "Featured offer";
      return name;
    }
    const svc = appointments[0]?.service_name || "Open appointment";
    return svc;
  }, [kind, products, appointments]);

  const deepLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/${vat}${kind === "product" ? "#products" : "#services"}`
      : `/${vat}`;

  useEffect(() => {
    drawStory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, headline, businessName, deepLink]);

  const drawStory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 1080;
    const h = 1920;
    canvas.width = w;
    canvas.height = h;

    // Obsidian → Clementine anti-PPC story frame
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#09090B");
    grad.addColorStop(0.55, "#18181B");
    grad.addColorStop(1, "#FF5E1A");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 42px Helvetica Neue, Arial, sans-serif";
    ctx.fillText("NEXUS OS", 80, 140);

    ctx.font = "500 28px Helvetica Neue, Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("Verified human demand — not PPC", 80, 190);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "600 64px Georgia, Times New Roman, serif";
    wrapText(ctx, businessName, 80, 360, w - 160, 72);

    ctx.font = "500 52px Georgia, Times New Roman, serif";
    ctx.fillStyle = "#FF5E1A";
    const label =
      kind === "slot" ? "OPEN SLOT TODAY" : "AVAILABLE NOW";
    ctx.fillText(label, 80, 620);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "600 56px Georgia, Times New Roman, serif";
    wrapText(ctx, headline, 80, 720, w - 160, 68);

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "400 34px Helvetica Neue, Arial, sans-serif";
    wrapText(ctx, deepLink, 80, 980, w - 160, 44);

    // CTA pill
    ctx.fillStyle = "#FFFFFF";
    roundRect(ctx, 80, 1600, 520, 100, 50);
    ctx.fill();
    ctx.fillStyle = "#09090B";
    ctx.font = "700 36px Helvetica Neue, Arial, sans-serif";
    ctx.fillText(kind === "slot" ? "Book in 1 tap" : "Shop now", 150, 1665);
  };

  const download = () => {
    drawStory();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `nexus-${kind}-story-${vat}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    setStatus("Story graphic downloaded (1080×1920)");
  };

  const broadcast = () => {
    setStatus(null);
    startTransition(async () => {
      const res = await fetch("/api/crm/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vat, force: false }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus(data.error || "Broadcast failed");
        return;
      }
      if (!data.broadcast) {
        setStatus(
          `No ping — ${data.spots_open} spots still open (auto-broadcast fires below 3).`,
        );
        return;
      }
      setStatus(
        `Broadcast queued to ${data.recipients} hot leads · ${data.spots_open} spots left`,
      );
    });
  };

  return (
    <section className="rounded-3xl border border-[var(--line)] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="nx-eyebrow">Social & CRM broadcast</p>
          <h2 className="mt-2 text-lg font-semibold">
            Anti-PPC demand engine
          </h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Generate Instagram/TikTok story graphics with deep-links, or ping{" "}
            {hotLeadCount} hot leads when same-day capacity drops below 3.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={`nx-tab ${kind === "slot" ? "nx-tab-active" : "nx-tab-idle"}`}
            onClick={() => setKind("slot")}
          >
            Open slot
          </button>
          <button
            type="button"
            className={`nx-tab ${kind === "product" ? "nx-tab-active" : "nx-tab-idle"}`}
            onClick={() => setKind("product")}
          >
            Product
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[180px_1fr]">
        <canvas
          ref={canvasRef}
          className="h-auto w-full max-w-[180px] rounded-2xl border border-[var(--line)] bg-[var(--ink)]"
          width={1080}
          height={1920}
        />
        <div className="flex flex-col justify-center gap-3">
          <p className="text-sm text-[var(--ink-soft)]">
            Preview: <strong>{headline}</strong>
          </p>
          <p className="break-all text-xs text-[var(--muted)]">{deepLink}</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="nx-btn nx-btn-accent !py-2.5 text-sm"
              onClick={() => {
                drawStory();
                download();
              }}
            >
              1-Click Story Generator
            </button>
            <button
              type="button"
              className="nx-btn nx-btn-ghost !py-2.5 text-sm"
              disabled={pending}
              onClick={broadcast}
            >
              {pending ? "Broadcasting…" : "Open Slot Broadcast"}
            </button>
            <button
              type="button"
              className="nx-btn nx-btn-ghost !py-2.5 text-sm"
              onClick={drawStory}
            >
              Refresh preview
            </button>
          </div>
          {status ? (
            <p className="rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm font-medium text-[var(--accent-deep)]">
              {status}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
