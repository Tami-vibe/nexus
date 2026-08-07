/** Canonical offer categories — hospitality + local services. */
export type OfferCategory =
  | "clinic"
  | "beauty"
  | "fitness"
  | "hotel"
  | "restaurant"
  | "legal";

export type RestaurantPriceTier = "€" | "€€" | "€€€" | "€€€€";

export interface HotelDetails {
  stars: number;
  nights: number;
  roomType: string;
  perks: string[]; // e.g. ["Breakfast Included", "Spa Pass"]
}

export interface RestaurantDetails {
  cuisine: string;
  menuType: string; // e.g. "5-Course Tasting Menu"
  priceTier: RestaurantPriceTier;
}

export interface Offer {
  id: string;
  title: string;
  category: OfferCategory;
  merchantName: string;
  location: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  /** Display major units (e.g. 180 = €180) */
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  image: string;
  isFavorite?: boolean;
  hotelDetails?: HotelDetails;
  restaurantDetails?: RestaurantDetails;
}
