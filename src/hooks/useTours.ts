import { useQuery } from '@tanstack/react-query';
import { toursService } from '@/lib/supabase/tours';
import { Tour } from '@/types/tour';

export const useTours = () => {
  return useQuery<Tour[]>({
    queryKey: ['tours'],
    queryFn: () => toursService.getAll(),
  });
};

export const useTour = (id: string) => {
  return useQuery<Tour | null>({
    queryKey: ['tour', id],
    queryFn: () => toursService.getById(id),
    enabled: !!id,
  });
};

export const useToursByCategory = (category: string) => {
  return useQuery<Tour[]>({
    queryKey: ['tours', 'category', category],
    queryFn: () => toursService.getByCategory(category),
    enabled: !!category && category !== 'Todos',
  });
};

export const useFeaturedTours = () => {
  return useQuery<Tour[]>({
    queryKey: ['tours', 'featured'],
    queryFn: () => toursService.getFeatured(),
  });
};

