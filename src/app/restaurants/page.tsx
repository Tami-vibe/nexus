import { CategoryOffersPage } from "@/components/CategoryOffersPage";

export const metadata = {
  title: "Fine Dining & Gourmet | Nexus OS",
  description:
    "Tasting menus, Michelin partner deals, and chef’s table vouchers near you.",
};

export default function RestaurantsPage() {
  return (
    <CategoryOffersPage
      category="restaurant"
      eyebrow="Fine dining & gourmet"
      title="Tasting menus & chef’s tables"
      description="Michelin partner tasting menus and gourmet trattoria intros — cuisine and price tier on every card."
    />
  );
}
