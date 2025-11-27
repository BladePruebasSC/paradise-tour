import { supabase } from '../supabase';
import { adaptComboFromSupabase } from './adapters';

export interface Combo {
  id: string;
  title: string;
  description: string;
  tour_ids: string[];
  original_price: number;
  discounted_price: number;
  discount: number;
  image: string;
  created_at?: string;
}

// Tipo para compatibilidad con componentes existentes
export interface ComboForComponent {
  id: string;
  title: string;
  description: string;
  tourIds: string[];
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  image: string;
}

export const combosService = {
  // Obtener todos los combos
  async getAll(): Promise<Combo[]> {
    const { data, error } = await supabase
      .from('combos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching combos:', error);
      throw error;
    }

    return (data || []).map(adaptComboFromSupabase);
  },

  // Obtener un combo por ID
  async getById(id: string): Promise<Combo | null> {
    const { data, error } = await supabase
      .from('combos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching combo:', error);
      return null;
    }

    return data ? adaptComboFromSupabase(data) : null;
  },
};

