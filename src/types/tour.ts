export interface Tour {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  duration: string;
  priceAdult: number;
  priceChild: number;
  priceInfant: number;
  featured: boolean;
  includes: string[];
  rating: number;
  reviews: number;
}

export interface CartItem {
  tour: Tour;
  adults: number;
  children: number;
  infants: number;
  date: string;
}
