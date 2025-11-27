import { supabase } from '../supabase';

export interface Review {
  id: string;
  tour_id: string | null;
  name: string;
  email: string | null;
  rating: number;
  comment: string;
  verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export const reviewsService = {
  // Obtener todas las reseñas
  async getAll(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }

    return data || [];
  },

  // Obtener reseñas de un tour específico
  async getByTourId(tourId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('tour_id', tourId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews by tour:', error);
      throw error;
    }

    return data || [];
  },

  // Obtener reseñas verificadas
  async getVerified(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('verified', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching verified reviews:', error);
      throw error;
    }

    return data || [];
  },

  // Crear una nueva reseña
  async create(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      throw error;
    }

    return data;
  },

  // Actualizar una reseña
  async update(id: string, updates: Partial<Review>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating review:', error);
      throw error;
    }

    return data;
  },

  // Aceptar una reseña (marcar como verificada)
  async approve(id: string): Promise<Review> {
    return this.update(id, { verified: true });
  },

  // Rechazar una reseña (marcar como no verificada)
  async reject(id: string): Promise<Review> {
    return this.update(id, { verified: false });
  },

  // Eliminar una reseña
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
};

