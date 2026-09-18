import { getReservationsByEmail } from './controllers/userController.js';

import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import {
    listPerformances,
    getPerformance,
  } from './controllers/performanceController.js';
  
  import {
    createReservation,
    cancelReservation,
  } from './controllers/reservationController.js';
  


const app = express();

app.use(cors());
app.use(express.json());

app.get('/performances', async (_req, res) => {
  try {
    const data = await listPerformances();

    return res.json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: '공연 목록을 불러오지 못했습니다.',
    });
  }
});

app.get('/performances/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
  
      if (!Number.isInteger(id)) {
        return res.status(400).json({
          error: '공연 ID가 올바르지 않습니다.',
        });
      }
  
      const data = await getPerformance(id);
  
      return res.json(data);
    } catch (error) {
      console.error(error);
  
      return res.status(404).json({
        error: '공연을 찾을 수 없습니다.',
      });
    }
  });

  app.post('/reservations', async (req, res) => {
    try {
      const { seatId, customerName, customerEmail } = req.body;
  
      const data = await createReservation({
        seatId: Number(seatId),
        customerName,
        customerEmail,
      });
  
      return res.status(201).json(data);
    } catch (error) {
      console.error(error);
  
      return res.status(400).json({
        error: error instanceof Error ? error.message : '예매에 실패했습니다.',
      });
    }
  });
  
  app.patch('/reservations/:id/cancel', async (req, res) => {
    try {
      const reservationId = Number(req.params.id);
      const { customerEmail } = req.body;
  
      if (!Number.isInteger(reservationId)) {
        return res.status(400).json({
          error: '예약 ID가 올바르지 않습니다.',
        });
      }
  
      const data = await cancelReservation(
        reservationId,
        customerEmail
      );
  
      return res.json(data);
    } catch (error) {
      console.error(error);
  
      return res.status(404).json({
        error:
          error instanceof Error
            ? error.message
            : '예매 취소에 실패했습니다.',
      });
    }
  });
  
  app.get('/reservations', async (req, res) => {
    try {
      const email = String(req.query.email || '');
  
      const data = await getReservationsByEmail(email);
  
      return res.json(data);
    } catch (error) {
      console.error(error);
  
      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : '예매 내역을 불러오지 못했습니다.',
      });
    }
  });
  
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`서버 시작: http://localhost:${PORT}`);
});
