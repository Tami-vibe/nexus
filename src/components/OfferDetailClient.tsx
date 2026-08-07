"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Car,
  CheckCircle2,
  Clock,
  ExternalLink,
  Gift,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  Train,
  X,
  Zap,
} from "lucide-react";
import { MerchantAndTermsSection } from "@/components/MerchantAndTermsSection";
import { OfferDetailsTabbedSection } from "@/app/offers/[slug]/components/OfferDetailsTabbedSection";
import type { OfferDetailModel, OfferReview } from "@/lib/offerDetail";

type Props = {
  model: OfferDetailModel;
};

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

function useCountdown(hours = 7, minutes = 39, seconds = 7) {
  const [remaining, setRemaining] = useState(
    hours * 3600 + minutes * 60 + seconds,
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ReviewCard({ rev }: { rev: OfferReview }) {
  return (
    <div className="space-y-2 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-zinc-900">{rev.author}</span>
          {rev.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              <BadgeCheck className="h-3 w-3" aria-hidden />
              Verified purchase
            </span>
          ) : null}
        </div>
        <span className="shrink-0 text-xs text-zinc-400">{rev.date}</span>
      </div>
      <div className="flex items-center gap-1 text-amber-400" aria-label={`${rev.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-300"
            }`}
            aria-hidden
          />
        ))}
      </div>
      <p className="text-[11px] font-medium text-zinc-500">
        Option: {rev.optionBought}
      </p>
      <p className="text-xs leading-relaxed text-zinc-700">{rev.comment}</p>
      <div className="flex items-center gap-1.5 pt-1 text-[11px] font-semibold text-zinc-500">
        <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
        {rev.helpfulCount} found helpful
      </div>
    </div>
  );
}

export function OfferDetailClient({ model }: Props) {
  const { offer, packages, gallery, insightTags, reviews, summaryText } =
    model;
  const [selectedOption, setSelectedOption] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [checkoutQty, setCheckoutQty] = useState(1);
  const [liveTotal, setLiveTotal] = useState<number | null>(null);
  const [liveUnit, setLiveUnit] = useState<number | null>(null);
  const countdown = useCountdown();

  const selected = packages[selectedOption] ?? packages[0];
  const unitPrice = liveUnit ?? selected.price;
  const displayTotal = liveTotal ?? selected.price * checkoutQty;
  const offerPriceBeforePromo =
    (selected.price + model.promoAmount) * checkoutQty;
  const savings = selected.original * checkoutQty - displayTotal;
  const savingsPct =
    selected.original > 0
      ? Math.round((savings / (selected.original * checkoutQty)) * 100)
      : 0;

  const breadcrumbCategory = useMemo(() => {
    if (offer.category === "hotel") return "Hotels";
    if (offer.category === "restaurant") return "Restaurants";
    if (offer.category === "legal") return "Professional Services";
    if (offer.category === "clinic") return "Health";
    if (offer.category === "beauty") return "Beauty & Spas";
    return "Local Offers";
  }, [offer.category]);

  const scrollToReviews = () => {
    const el = document.getElementById("reviews-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openReviewsModal = () => setIsReviewsModalOpen(true);

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-28 lg:pb-16">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-800">
          Home
        </Link>
        <span>/</span>
        <Link href="/offers" className="hover:text-zinc-800">
          Offers
        </Link>
        <span>/</span>
        <span>{breadcrumbCategory}</span>
        <span>/</span>
        <span className="font-semibold text-zinc-900">{offer.merchantName}</span>
      </div>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pt-2 lg:grid-cols-12">
        {/* Left ~60% */}
        <div className="space-y-6 lg:col-span-7">
          {/* Gallery */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-900 shadow-md">
            <Image
              src={gallery[activeImage] ?? offer.image}
              alt={offer.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-black uppercase tracking-wider text-zinc-950 shadow">
                <Sparkles className="h-3 w-3" aria-hidden />
                Best Seller
              </span>
              <span className="rounded-full bg-zinc-900/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                Verified Merchant
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-zinc-900">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                {offer.rating.toFixed(1)} ★
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-zinc-900 shadow hover:bg-white"
            >
              View All Photos
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {gallery.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                  activeImage === i
                    ? "border-[#FF5E1A]"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="96px" />
              </button>
            ))}
          </div>

          {/* Title + clickable rating */}
          <div>
            <h1 className="text-2xl font-black leading-tight tracking-tight text-zinc-900 sm:text-3xl">
              {offer.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <button
                type="button"
                onClick={scrollToReviews}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-bold text-amber-700 transition-all hover:bg-amber-100"
              >
                <Star
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                  aria-hidden
                />
                <span>{offer.rating.toFixed(1)}</span>
                <span className="font-normal text-amber-800/70">
                  ({offer.reviewCount.toLocaleString()}+ verified reviews)
                </span>
              </button>
              <div className="flex items-center gap-1 font-medium text-zinc-600">
                <MapPin className="h-4 w-4 text-zinc-400" aria-hidden />
                <span>
                  {offer.city} ({model.distanceMi} mi)
                </span>
              </div>
            </div>
          </div>

          {/* Select Plan · What's Included · Fine Print (AdaptiveContainer) */}
          <OfferDetailsTabbedSection
            merchantName={offer.merchantName}
            packages={packages}
            inclusions={model.inclusions}
            upsell={model.upsell}
            terms={model.terms}
            selectedPlanId={selectedOption}
            onSelectPlan={(id) => {
              setSelectedOption(id);
              setLiveTotal(null);
              setLiveUnit(null);
              setCheckoutQty(1);
            }}
            onEnableGift={() => setIsGift(true)}
            categoryLookup={{
              category: offer.category,
              id: offer.id,
              title: offer.title,
            }}
            promoCode={model.promoCode}
            promoAmount={model.promoAmount}
            redeemedLabel={model.redeemedLabel}
            onCheckoutStateChange={(state) => {
              setCheckoutQty(state.quantity);
              setLiveTotal(state.totalPrice);
              setLiveUnit(state.unitPrice);
              if (state.isGift) setIsGift(true);
            }}
          />

          {/* Map & merchant */}
          <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900">Location & Hours</h2>
            <div className="overflow-hidden rounded-xl border border-zinc-200">
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                <div className="text-center">
                  <MapPin className="mx-auto h-8 w-8 text-[#FF5E1A]" aria-hidden />
                  <p className="mt-2 text-sm font-semibold text-zinc-800">
                    {model.address}
                  </p>
                  <a
                    href={model.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#FF5E1A] hover:underline"
                  >
                    Open in Maps
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                  Hours
                </div>
                <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                  {model.hours.map((h) => (
                    <li key={h} className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 content-start">
                <a
                  href={model.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-800 hover:border-zinc-300"
                >
                  <Car className="h-3.5 w-3.5" aria-hidden />
                  Parking directions
                </a>
                <a
                  href={model.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-800 hover:border-zinc-300"
                >
                  <Train className="h-3.5 w-3.5" aria-hidden />
                  Transit directions
                </a>
              </div>
            </div>
          </div>

          <MerchantAndTermsSection
            merchant={model.merchant}
            mapsUrl={model.mapsUrl}
          />

          {/* Reviews + AI insights */}
          <div
            id="reviews-section"
            className="scroll-mt-24 space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-zinc-900">
                Verified Reviews & Insights
              </h2>
              <button
                type="button"
                onClick={openReviewsModal}
                className="shrink-0 text-xs font-bold text-[#FF5E1A] hover:underline"
              >
                See All {offer.reviewCount.toLocaleString()} Reviews →
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {insightTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {model.reviewPhotos.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => {
                    setActiveImage(Math.min(i, gallery.length - 1));
                    setLightboxOpen(true);
                  }}
                  className="relative aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100"
                >
                  <Image
                    src={src}
                    alt={`${offer.merchantName} photo ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </button>
              ))}
            </div>

            <p className="text-sm leading-relaxed text-zinc-600">{summaryText}</p>

            <div className="space-y-4 border-t border-zinc-100 pt-4">
              {reviews.slice(0, 2).map((rev) => (
                <ReviewCard key={rev.id} rev={rev} />
              ))}
            </div>

            <button
              type="button"
              onClick={openReviewsModal}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 text-sm font-bold text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-white"
            >
              Read All Verified Reviews
            </button>
          </div>
        </div>

        {/* Right sticky checkout ~40% */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-3 text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 fill-white" aria-hidden />
                Sale ends in
              </span>
              <span className="rounded-md bg-black/20 px-2.5 py-1 font-mono tabular-nums">
                {countdown}
              </span>
            </div>

            <div className="space-y-2 border-b border-zinc-100 pb-4">
              <div className="flex justify-between text-sm text-zinc-500">
                <span>Original Value{checkoutQty > 1 ? ` × ${checkoutQty}` : ""}</span>
                <span className="line-through">
                  {formatMoney(selected.original * checkoutQty)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-zinc-500">
                <span>Special Offer Price</span>
                <span>{formatMoney(offerPriceBeforePromo)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-emerald-600">
                <span>Promo Code ({model.promoCode}) Applied</span>
                <span>-{formatMoney(model.promoAmount * checkoutQty)}</span>
              </div>
              {checkoutQty >= 2 ? (
                <div className="flex justify-between text-sm font-bold text-emerald-700">
                  <span>Multi-Pack Bonus (10%)</span>
                  <span>Applied</span>
                </div>
              ) : null}
              <div className="flex items-end justify-between border-t border-zinc-100 pt-3">
                <div>
                  <div className="text-xl font-black text-zinc-900">
                    Total Due Now
                  </div>
                  <div className="text-xs font-semibold text-emerald-700">
                    Save {formatMoney(savings)} · {savingsPct}% OFF
                    {checkoutQty > 1
                      ? ` · ${formatMoney(unitPrice)}/ea`
                      : ""}
                  </div>
                </div>
                <span className="text-2xl font-black text-[#FF5E1A]">
                  {formatMoney(displayTotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5E1A] py-4 text-lg font-black text-white shadow-lg transition-all hover:bg-[#E04E0E] hover:shadow-orange-500/25"
            >
              {isGift ? "Send Gift Voucher" : "Grab This Deal Now"}
            </button>

            {/* Gift toggle */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                <Gift className="h-4 w-4 text-violet-600" aria-hidden />
                Send as digital gift
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={isGift}
                aria-label="Send as digital gift"
                onClick={() => setIsGift((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  isGift ? "bg-[#FF5E1A]" : "bg-zinc-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    isGift ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            {isGift ? (
              <p className="text-xs text-zinc-500">
                Personalized gift card with scheduled email delivery. Recipient
                gets a branded voucher — you choose the send date.
              </p>
            ) : null}

            <div className="space-y-2 border-t border-zinc-100 pt-4 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden />
                100% Price Match Guarantee
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#FF5E1A]" aria-hidden />
                Instant Voucher Delivery
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
                {offer.refundNote ?? "Easy 14-Day Refunds"}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile floating CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-lg font-black text-[#FF5E1A]">
              {formatMoney(displayTotal)}
            </div>
            <div className="truncate text-[11px] font-semibold text-zinc-500">
              Ends in {countdown} · Qty {checkoutQty}
              {isGift ? " · Gift" : ""}
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-xl bg-[#FF5E1A] px-5 py-3.5 text-sm font-black text-white shadow-lg hover:bg-[#E04E0E]"
          >
            {isGift ? "Send Gift" : "Grab This Deal Now"}
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-[70vh] w-full max-w-4xl">
            <Image
              src={gallery[activeImage] ?? offer.image}
              alt={offer.title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <div className="absolute bottom-6 flex gap-2">
            {gallery.map((src, i) => (
              <button
                key={`lb-${src}`}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`h-2 w-2 rounded-full ${
                  activeImage === i ? "bg-[#FF5E1A]" : "bg-white/40"
                }`}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Full reviews modal */}
      {isReviewsModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Customer reviews for ${offer.merchantName}`}
          onClick={() => setIsReviewsModalOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl space-y-6 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">
                  Customer Reviews for {offer.merchantName}
                </h3>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
                  <Star
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    aria-hidden
                  />
                  {offer.rating.toFixed(1)} average ·{" "}
                  {offer.reviewCount.toLocaleString()} verified purchases
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewsModalOpen(false)}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100"
                aria-label="Close reviews"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {insightTags.map((tag) => (
                <span
                  key={`modal-${tag}`}
                  className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <ReviewCard key={`modal-${rev.id}`} rev={rev} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
