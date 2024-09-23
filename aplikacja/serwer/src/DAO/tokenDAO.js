import jwt from 'jsonwebtoken';
import config from '../config';
const momentWrapper = require('../service/momentWrapper');
const applicationException = require('../service/applicationException');
const pool = require('../../db');

async function createToken(user) {
  if (!config.JwtSecret) {
    throw new Error('Secret key is missing');
  }

  const payload = {
    id_uzytkownika: user.id_uzytkownika,
    rola: user.rola,
    imie: user.imie
  };

  const token = jwt.sign(payload, config.JwtSecret, { expiresIn: '1h' });
  const date = new Date();
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offset);
  const tokenRegister = await pool.query(
    `INSERT INTO akademia.token (id_uzytkownika, data_utworzenia, typ, wartosc) 
    VALUES ($1, $2, $3, $4) 
    `,
    [payload.id_uzytkownika, date.toISOString(),'authorization',token]
  );
  return token;
}

function verifyToken(token) {
  try {
    if (!config.JwtSecret) {
      throw new Error('Secret key is missing');
    }

    const payload = jwt.verify(token, config.JwtSecret);
    return payload;
  } catch (error) {
    throw applicationException.new(applicationException.UNAUTHORIZED, 'Invalid token');
  }
}

function generateToken(user) {
  if (!config.JwtSecret) {
    throw applicationException.new(applicationException.UNAUTHORIZED, 'Secret key is missing');
  }

  const payload = {
    id: user.id,
    rola: user.rola,
  };

  const token = jwt.sign(payload, config.SECRET_KEY, { expiresIn: '1h' });
  return token;
}

async function remove(id_uzytkownika) {
  const removeToken = await pool.query(
    "DELETE FROM akademia.token WHERE id_uzytkownika = $1",
    [id_uzytkownika]
  );
}

module.exports = {
  createToken,
  verifyToken,
  generateToken,
  remove
};