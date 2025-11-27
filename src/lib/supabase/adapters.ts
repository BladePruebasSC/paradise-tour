import { Tour } from '@/types/tour';
import { Combo } from './combos';

// Adaptador para convertir datos de Supabase al formato esperado por los componentes
export const adaptTourFromSupabase = (tour: any): Tour => {
  return {
    id: tour.id,
    title: tour.title,
    description: tour.description,
    category: tour.category,
    image: tour.image,
    duration: tour.duration,
    priceAdult: tour.price_adult || tour.priceAdult,
    priceChild: tour.price_child || tour.priceChild,
    priceInfant: tour.price_infant || tour.priceInfant,
    featured: tour.featured,
    includes: Array.isArray(tour.includes) ? tour.includes : (tour.includes ? JSON.parse(tour.includes) : []),
    rating: tour.rating || 0,
    reviews: tour.reviews || 0,
  };
};

// Adaptador para convertir combos de Supabase
export const adaptComboFromSupabase = (combo: any): Combo => {
  return {
    id: combo.id,
    title: combo.title,
    description: combo.description,
    tour_ids: combo.tour_ids || combo.tourIds || [],
    original_price: combo.original_price || combo.originalPrice,
    discounted_price: combo.discounted_price || combo.discountedPrice,
    discount: combo.discount,
    image: combo.image,
    created_at: combo.created_at,
  };
};

