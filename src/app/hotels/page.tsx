import { CategoryOffersPage } from "@/components/CategoryOffersPage";

export const metadata = {
  title: "Hotels & Stays | Nexus OS",
  description:
    "Boutique stays, spa resorts, and weekend escapes — first-visit hospitality rates.",
};

export default function HotelsPage() {
  return (
    <CategoryOffersPage
      category="hotel"
      eyebrow="Hotels & stays"
      title="Boutique stays & weekend escapes"
      description="Top lake resorts, design hotels, and spa getaways — stay duration and room type on every card."
    />
  );
}
