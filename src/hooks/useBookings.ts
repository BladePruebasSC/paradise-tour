import { useQuery } from '@tanstack/react-query';
import { bookingsService, Booking } from '@/lib/supabase/bookings';

export const useBookings = () => {
  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: () => bookingsService.getAll(),
  });
};

export const useBooking = (id: string) => {
  return useQuery<Booking | null>({
    queryKey: ['booking', id],
    queryFn: () => bookingsService.getById(id),
    enabled: !!id,
  });
};

