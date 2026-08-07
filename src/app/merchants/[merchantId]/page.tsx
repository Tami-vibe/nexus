import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OfferCard } from "@/components/OfferCard";
import {
  getOffersByMerchantId,
  merchantIdFromName,
} from "@/lib/offerDetail";
import { MOCK_OFFERS } from "@/data/mockOffers";

type Props = {
  params: Promise<{ merchantId: string }>;
};

export function generateStaticParams() {
  const ids = new Set(
    MOCK_OFFERS.map((o) => merchantIdFromName(o.merchantName)),
  );
  return [...ids].map((merchantId) => ({ merchantId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { merchantId } = await params;
  const offers = getOffersByMerchantId(merchantId);
  if (!offers.length) return { title: "Merchant | Nexus" };
  return {
    title: `${offers[0].merchantName} | Nexus Merchants`,
    description: `Browse verified offers from ${offers[0].merchantName} on Nexus.`,
  };
}

export default async function MerchantStorefrontPage({ params }: Props) {
  const { merchantId } = await params;
  const offers = getOffersByMerchantId(merchantId);
  if (!offers.length) notFound();

  const name = offers[0].merchantName;
  const city = offers[0].city;

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-2 text-xs text-zinc-500">
          <Link href="/offers" className="hover:text-zinc-800">
            Offers
          </Link>
          <span className="mx-1.5">/</span>
          <span className="font-semibold text-zinc-900">{name}</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">
          {name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Nexus-hosted merchant storefront · {city} · {offers.length} live{" "}
          {offers.length === 1 ? "offer" : "offers"}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </div>
  );
}
