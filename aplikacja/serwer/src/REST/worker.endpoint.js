const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
import pool from "../../db";
import auth from "../middleware/auth";


const workerEndpoint = (app) => {
  app.post("/worker-registration", auth(["administrator", "superadministrator"]),  async (req, res) => {
    const { imie, nazwisko, adres_email, haslo, rola, aktywny } = req.body;

    try {
      const existingWorker = await pool.query(
        "SELECT * FROM akademia.uzytkownik WHERE adres_email = $1",
        [adres_email]
      );

      if (existingWorker.rows.length > 0) {
        return res.status(400).json({ error: "Pracownik o podanym adresie e-mail już istnieje." });
      }
      const saltRound = 12;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(haslo, salt);

      const workerRegister = await pool.query(
        "INSERT INTO akademia.uzytkownik (imie, nazwisko, adres_email, rola, aktywny) VALUES ($1, $2, $3, $4, $5) RETURNING id_uzytkownika",
        [imie, nazwisko, adres_email, 'pracownik', aktywny]
      );

      await pool.query(
        "INSERT INTO akademia.haslo (id_uzytkownika, haslo) VALUES ($1, $2) RETURNING *",
        [workerRegister.rows[0].id_uzytkownika, bcryptPassword]
      );

      console.log("Dodano nowego pracownika do bazy danych:", imie, nazwisko);

      res.status(201).json({ message: "Pracownik zarejestrowany pomyślnie." });
    } catch (error) {
      console.error("Błąd przy rejestrowaniu: ", error);
      res.status(500).json({ error: "Błąd rejestracji. Sprawdź, czy dane się nie duplikują (adres e-mail musi być unikatowy)" });
    }
  });
};

export default workerEndpoint;
