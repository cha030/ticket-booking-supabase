import { supabase } from '../lib/supabase.js';

export async function listPerformances() {
  const { data, error } = await supabase
    .from('performances')
    .select(
      'id, title, venue, starts_at, price, seats(id, row_label, seat_number, is_available)'
    )
    .order('id', { ascending: true });

  if (error) {
    throw error;
  }

  return data.map((p) => {
    const seats = p.seats ?? [];

    return {
      id: p.id,
      title: p.title,
      venue: p.venue,
      starts_at: p.starts_at,
      price: p.price,
      seats,
      available_count: seats.filter((s) => s.is_available).length,
      total_count: seats.length,
    };
  });
}

export async function getPerformance(id: number) {
    const { data, error } = await supabase
      .from('performances')
      .select(
        'id, title, venue, starts_at, price, seats(id, row_label, seat_number, is_available)'
      )
      .eq('id', id)
      .single();
  
    if (error || !data) {
      throw new Error('공연을 찾을 수 없습니다.');
    }
  
    const seats = data.seats ?? [];
  
    return {
      id: data.id,
      title: data.title,
      venue: data.venue,
      starts_at: data.starts_at,
      price: data.price,
      seats,
      available_count: seats.filter((s) => s.is_available).length,
      total_count: seats.length,
    };
  }
  