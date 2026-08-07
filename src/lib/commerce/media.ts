import type { Sector } from "@/types";

/** Guaranteed high-res Unsplash fallbacks by sector — never blank gray cards. */
export const SECTOR_HERO_IMAGES: Record<Sector, string> = {
  ARTISAN:
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1600&q=80",
  GYM: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
  SALON:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80",
  CLINIC:
    "https://images.unsplash.com/photo-1666214280557-f1b502e445b7?auto=format&fit=crop&w=1600&q=80",
  DIGITAL:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
  RETAIL:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
  POOL: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=80",
  CONSULTING:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
};

export const SECTOR_OFFER_IMAGES: Record<Sector, string> = {
  ARTISAN:
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80",
  GYM: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
  SALON:
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=80",
  CLINIC:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
  DIGITAL:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  RETAIL:
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=900&q=80",
  POOL: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80",
  CONSULTING:
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
};

export const SECTOR_TRUST_IMAGES: Record<Sector, string> = {
  ARTISAN:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
  GYM: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=900&q=80",
  SALON:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  CLINIC:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
  DIGITAL:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80",
  RETAIL:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80",
  POOL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  CONSULTING:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80",
};

export function merchantHeroImage(input: {
  sector: Sector;
  hero_image_url?: string | null;
  profile_image_url?: string | null;
}) {
  return (
    input.hero_image_url ||
    input.profile_image_url ||
    SECTOR_HERO_IMAGES[input.sector] ||
    SECTOR_HERO_IMAGES.RETAIL
  );
}

export function offerFallbackImage(sector: Sector) {
  return SECTOR_OFFER_IMAGES[sector] || SECTOR_OFFER_IMAGES.RETAIL;
}

export function trustFallbackImage(sector: Sector) {
  return SECTOR_TRUST_IMAGES[sector] || SECTOR_TRUST_IMAGES.RETAIL;
}
