import { useQuery } from '@tanstack/react-query';
import { combosService, Combo, ComboForComponent } from '@/lib/supabase/combos';

// Función helper para convertir Combo a ComboForComponent
const convertCombo = (combo: Combo): ComboForComponent => ({
  id: combo.id,
  title: combo.title,
  description: combo.description,
  tourIds: combo.tour_ids,
  originalPrice: combo.original_price,
  discountedPrice: combo.discounted_price,
  discount: combo.discount,
  image: combo.image,
});

export const useCombos = () => {
  return useQuery<ComboForComponent[]>({
    queryKey: ['combos'],
    queryFn: async () => {
      const combos = await combosService.getAll();
      return combos.map(convertCombo);
    },
  });
};

export const useCombo = (id: string) => {
  return useQuery<ComboForComponent | null>({
    queryKey: ['combo', id],
    queryFn: async () => {
      const combo = await combosService.getById(id);
      return combo ? convertCombo(combo) : null;
    },
    enabled: !!id,
  });
};

