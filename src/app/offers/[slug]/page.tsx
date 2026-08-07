import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OfferDetailClient } from "@/components/OfferDetailClient";
import { buildOfferDetail, getMockOfferBySlug } from "@/lib/offerDetail";
import { MOCK_OFFERS } from "@/data/mockOffers";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return MOCK_OFFERS.map((o) => ({ slug: o.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const offer = getMockOfferBySlug(slug);
  if (!offer) return { title: "Offer | Nexus" };
  const pct = Math.round(
    ((offer.originalPriceCents - offer.offerPriceCents) /
      offer.originalPriceCents) *
      100,
  );
  return {
    title: `${offer.title} | Nexus Offers`,
    description: `${pct}% off at ${offer.merchantName} in ${offer.city}. ${offer.rating}★ from ${offer.reviewCount} reviews.`,
  };
}

export default async function OfferDetailPage({ params }: Props) {
  const { slug } = await params;
  const offer = getMockOfferBySlug(slug);
  if (!offer) notFound();

  const model = buildOfferDetail(offer);
  return <OfferDetailClient model={model} />;
}
