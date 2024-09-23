const pool = require('../../db');

async function getUserByEmail(email) {
  const query = `SELECT u.id_uzytkownika, u.adres_email, u.rola, h.haslo, u.imie 
                 FROM akademia.uzytkownik u 
                 INNER JOIN akademia.haslo h ON u.id_uzytkownika = h.id_uzytkownika 
                 WHERE u.adres_email = $1`;
  const values = [email];

  try {
    const result = await pool.query(query, values);
    const user = result.rows[0];

    return user;
  } catch (error) {
    console.error('getUserByEmail - Error:', error);
    throw error;
  }
}

async function createNewUser(userData) {
  const query = 'INSERT INTO akademia.uzytkownik (imie, nazwisko, adres_email, rola, aktywny) VALUES ($1, $2, $3, $4, $5) RETURNING id_uzytkownika';
  const values = [
    userData.imie,
    userData.nazwisko,
    userData.adres_email,
    userData.rola,
    userData.aktywny,
  ];

  try {
    const result = await pool.query(query, values);

    const userId = result.rows[0].id_uzytkownika;

    const passwordQuery = 'INSERT INTO akademia.haslo (id_uzytkownika, haslo) VALUES ($1, $2)';
    const passwordValues = [userId, userData.haslo];
    await pool.query(passwordQuery, passwordValues);

    return userId;
  } catch (error) {
    console.error('createNewUser - Error:', error);
    throw error;
  }
}

async function authorize(email, password) {
  const query = 'SELECT u.id_uzytkownika, u.adres_email, u.rola FROM akademia.uzytkownik u INNER JOIN akademia.haslo ON akademia.uzytkownik.id_uzytkownika = akademia.haslo.id_uzytkownika WHERE akademia.uzytkownik.adres_email = $1 AND akademia.haslo.haslo = $2';
  const values = [email, password];

  try {
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    return null;
  } catch (error) {
    console.error('authorize - Error:', error);
    throw error;
  }
}

async function updateUser(userId, userData) {
  const query = 'UPDATE akademia.uzytkownik SET adres_email = $1, rola = $2, aktywny = $3, imie = $4, nazwisko = $5 WHERE id_uzytkownika = $6 RETURNING *';
  const values = [
    userData.email,
    userData.role,
    userData.active,
    userData.first_name,
    userData.second_name,
    userId,
  ];

  try {
    const result = await pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error('updateUser - Error:', error);
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    let query = 'DELETE FROM akademia.haslo WHERE id_uzytkownika = $1';
    let values = [userId];
    await pool.query(query, values);

    query = 'DELETE FROM akademia.uzytkownik WHERE id_uzytkownika = $1';
    values = [userId];
    await pool.query(query, values);
  } catch (error) {
    console.error('deleteUser - Error:', error);
    throw error;
  }
}

module.exports = {
  getUserByEmail,
  createNewUser,
  authorize,
  updateUser,
  deleteUser,
};
