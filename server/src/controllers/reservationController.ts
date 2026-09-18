import { supabase } from '../lib/supabase.js';

export async function createReservation({
  seatId,
  customerName,
  customerEmail,
}: {
  seatId: number;
  customerName: string;
  customerEmail: string;
}) {
  if (!seatId || !customerName || !customerEmail) {
    throw new Error(
      'seatId, customerName, customerEmail이 필요합니다.'
    );
  }

  const { data, error } = await supabase.rpc('reserve_seat', {
    p_seat_id: seatId,
    p_customer_name: customerName,
    p_customer_email: customerEmail,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    reservation_id: data?.[0]?.reservation_id,
    message: '예매 완료',
  };
}

export async function cancelReservation(
  reservationId: number,
  customerEmail: string
) {
  if (!reservationId || !customerEmail) {
    throw new Error(
      'reservationId와 customerEmail이 필요합니다.'
    );
  }

  const { data, error } = await supabase.rpc('cancel_reservation', {
    p_reservation_id: reservationId,
    p_customer_email: customerEmail,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    reservation_id: data?.[0]?.reservation_id,
    message: '예매가 취소되었습니다.',
  };
}
