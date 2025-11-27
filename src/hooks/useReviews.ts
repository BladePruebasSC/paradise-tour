import { useQuery } from '@tanstack/react-query';
import { reviewsService, Review } from '@/lib/supabase/reviews';

export const useReviews = () => {
  return useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: () => reviewsService.getAll(),
  });
};

export const useReviewsByTour = (tourId: string) => {
  return useQuery<Review[]>({
    queryKey: ['reviews', 'tour', tourId],
    queryFn: () => reviewsService.getByTourId(tourId),
    enabled: !!tourId,
  });
};

export const useVerifiedReviews = () => {
  return useQuery<Review[]>({
    queryKey: ['reviews', 'verified'],
    queryFn: () => reviewsService.getVerified(),
  });
};

