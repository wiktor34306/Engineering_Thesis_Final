const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
import pool from "../../db";
import auth from "../middleware/auth";


const supervisorEndpoint = (app) => {

  app.get("/get-supervisors", auth(["administrator","superadministrator", "promotor"]), async (req, res) => {
    try {
      const supervisors = await pool.query(
      `
      SELECT
        p.id_promotora,
        p.id_uzytkownika,
        p.stopien_naukowy,
        u.imie,
        u.nazwisko
      FROM
        akademia.promotor p
      INNER JOIN
        akademia.uzytkownik u ON p.id_uzytkownika = u.id_uzytkownika
      WHERE
        u.rola = 'promotor';
      `);
      res.json(supervisors.rows);
    } catch (error) {
      console.error("Błąd przy pobieraniu promotorów: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });

  app.get("/get-amount-of-supervisors", auth(["administrator","superadministrator"]), async (req, res) => {
    try {
      const amountSupervisors = await pool.query("SELECT COUNT(*) FROM akademia.uzytkownik WHERE akademia.uzytkownik.rola='promotor';");
      res.json(amountSupervisors.rows);
    } catch (error) {
      console.error("Błąd przy pobieraniu liczby promotorów: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });

  app.post("/supervisor-registration", auth(["administrator","superadministrator"]), async (req, res) => {
    const { imie, nazwisko, adres_email, stopien_naukowy, haslo, rola, aktywny } = req.body;

    try {
      const existingUser = await pool.query('SELECT * FROM akademia.uzytkownik WHERE adres_email = $1', [adres_email]);

      if (existingUser.rows.length > 0) {
        console.log("Promotor o podanym adresie e-mail już istnieje");
        return res.status(400).json({ error: 'Promotor o podanym adresie e-mail już istnieje.' });
      }

      const saltRound = 12;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(haslo, salt);

      const supervisorRegister = await pool.query(
        "INSERT INTO akademia.uzytkownik (imie, nazwisko, adres_email, rola, aktywny) VALUES ($1, $2, $3, $4, $5) RETURNING id_uzytkownika",
        [imie, nazwisko, adres_email, 'promotor', aktywny]
      );

      await pool.query(
        "INSERT INTO akademia.haslo (id_uzytkownika, haslo) VALUES ($1, $2) RETURNING *",
        [supervisorRegister.rows[0].id_uzytkownika, bcryptPassword]
      );

      await pool.query(
        "INSERT INTO akademia.promotor (stopien_naukowy, id_uzytkownika) VALUES ($1, $2) RETURNING *",
        [stopien_naukowy, supervisorRegister.rows[0].id_uzytkownika]
      );

      console.log("Dodano nowego promotora do bazy danych:", imie, nazwisko);

      res.status(201).json({ message: "Promotor zarejestrowany pomyślnie." });
    } catch (error) {
      console.error("Błąd przy rejestrowaniu: ", error);
      res.status(500).json({ error: "Błąd rejestracji. Sprawdź, czy dane się nie duplikują (adres e-mail musi być unikatowy)" });
    }
  });

  app.get('/get-supervisor-id-by-user-id/:userId', auth(["administrator","superadministrator","promotor"]), async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const result = await pool.query('SELECT id_promotora FROM akademia.promotor WHERE id_uzytkownika = $1', [userId]);
  
      if (result.rows.length > 0) {
        res.json({ id_promotora: result.rows[0].id_promotora });
      } else {
        res.json({ id_promotora: null });
      }
    } catch (error) {
      console.error('Błąd podczas pobierania id_promotora:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

};

export default supervisorEndpoint;
