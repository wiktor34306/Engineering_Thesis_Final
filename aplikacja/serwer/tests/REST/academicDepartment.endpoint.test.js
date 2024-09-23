import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
const app = express();
import academicDepartmentEndpoint from '../../src/REST/academicDepartment.endpoint';
import pool from '../../db';
jest.mock('../../db');
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

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

academicDepartmentEndpoint(app);

describe('GET /get-academic-departments', () => {
  it('powinien zwrócić listę katedr', async () => {
    pool.query.mockResolvedValue({
      rows: [
        {
          id: 1,
          nazwa: 'Katedra Informatyki',
        },
        {
          id: 2,
          nazwa: 'Katedra Matematyki',
        },
      ]
    });

    const token = generateToken(1, 'superadministrator');

    const res = await request(app)
      .get('/get-academic-departments')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('nazwa');
  });
});