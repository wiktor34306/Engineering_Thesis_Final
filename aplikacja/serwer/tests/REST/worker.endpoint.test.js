import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import workerEndpoint from '../../src/REST/worker.endpoint';
import pool from '../../db';
import bcrypt from 'bcrypt';

jest.mock('../../db');
jest.mock('bcrypt');

dotenv.config({ path: '../.env' });

const app = express();
app.use(express.json());

function generateToken(userId, role, name) {
  const payload = {
    id_uzytkownika: userId,
    rola: role,
    imie: name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
  };

  return jwt.sign(payload, process.env.SECRET_KEY);
}

workerEndpoint(app);

describe('POST /worker-registration', () => {
  it('powinien zarejestrować nowego pracownika', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    pool.query.mockResolvedValueOnce({ rows: [{ id_uzytkownika: 1 }] });
    pool.query.mockResolvedValueOnce({});
    bcrypt.genSalt.mockResolvedValue('randomSalt');
    bcrypt.hash.mockResolvedValue('hashedPassword');

    const token = generateToken(1, 'superadministrator');

    const res = await request(app)
      .post('/worker-registration')
      .set('Authorization', token)
      .send({
        imie: 'Jan',
        nazwisko: 'Kowalski',
        adres_email: 'jan.kowalski@example.com',
        haslo: 'password123',
        rola: 'pracownik',
        aktywny: true
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Pracownik zarejestrowany pomyślnie.');
  }, 10000);
});