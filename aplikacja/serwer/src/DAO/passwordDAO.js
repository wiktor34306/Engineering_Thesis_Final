const pool = require("../../db")
const bcrypt = require('bcrypt');


async function createPassword(userInfo, hashedPassword) {
  try {
    const addUserQuery = 'INSERT INTO akademia.uzytkownik (imie, nazwisko, adres_email, rola, aktywny) VALUES ($1, $2, $3, $4, $5) RETURNING id_uzytkownika';
    const addUserValues = [userInfo.imie, userInfo.nazwisko, userInfo.adres_email, userInfo.rola, userInfo.aktywny];
    const userResult = await pool.query(addUserQuery, addUserValues);
    const userId = userResult.rows[0].id_uzytkownika;

    const addPasswordQuery = 'INSERT INTO akademia.haslo (id_uzytkownika, haslo) VALUES ($1, $2) RETURNING *';
    const addPasswordValues = [userId, hashedPassword];
    const passwordResult = await pool.query(addPasswordQuery, addPasswordValues);

    return { user: userResult.rows[0], password: passwordResult.rows[0] };
  } catch (error) {

    console.error('Error creating user and password:', error);
    throw error;
  }
}

async function authorize(userId, hashedPassword) {
  const query = 'SELECT id_hasla FROM akademia.haslo WHERE id_uzytkownika = $1 AND haslo = $2';
  const values = [userId, hashedPassword];
  const result = await pool.query(query, values);
  
  if (result.rows.length > 0) {
    return true;
  }
  
  return false;
}

async function verifyPassword(userId, providedPassword) {
  const query = 'SELECT haslo FROM akademia.haslo WHERE id_uzytkownika = $1';
  const values = [userId];
  const result = await pool.query(query, values);

  if (result.rows.length > 0) {
    const storedHashedPassword = result.rows[0].haslo;
    const isPasswordValid = await bcrypt.compare(providedPassword, storedHashedPassword);
    return isPasswordValid;
  }

  return false;
}


module.exports = {
  createPassword,
  authorize,
  verifyPassword,
};
