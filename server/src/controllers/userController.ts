import { supabase } from '../lib/supabase.js';

export async function getReservationsByEmail(email: string) {
  if (!email) {
    throw new Error('email 쿼리가 필요합니다.');
  }

  const { data, error } = await supabase
    .from('reservations')
    .select(`
      id,
      customer_name,
      customer_email,
      reserved_at,
      seats(
        id,
        row_label,
        seat_number,
        performances(
          id,
          title,
          venue,
          starts_at,
          price
        )
      )
    `)
    .eq('customer_email', email)
    .order('reserved_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((r) => {
    const seat = r.seats as any;

    return {
      reservation_id: r.id,
      customer_name: r.customer_name,
      customer_email: r.customer_email,
      reserved_at: r.reserved_at,

      seat: seat
        ? {
            seat_id: seat.id,
            row_label: seat.row_label,
            seat_number: seat.seat_number,
          }
        : null,

      performance: seat?.performances ?? null,
    };
  });
}
