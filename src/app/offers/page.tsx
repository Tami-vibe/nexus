import { OffersHub } from "@/components/OffersHub";

export const metadata = {
  title: "Introductory Offers | Nexus OS",
  description:
    "Command header search, sticky category ribbon, editorial bento discovery, and dense first-visit offer catalogue.",
};

export default function OffersPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <OffersHub />
    </main>
  );
}
