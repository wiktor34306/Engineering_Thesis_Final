const bcrypt = require("bcrypt");
import pool from "../../db";
import auth from "../middleware/auth";

const adminEndpoint = (app) => {
  app.post("/administrator-registration", auth(["superadministrator"]),  async (req, res) => {
    const { imie, nazwisko, adres_email, rola, aktywny, haslo } = req.body;

    try {
      const existingAdmin = await pool.query(
        "SELECT * FROM akademia.uzytkownik WHERE adres_email = $1",
        [adres_email]
      );

      if (existingAdmin.rows.length > 0) {
        return res
          .status(400)
          .json({
            error: "Administrator o podanym adresie e-mail już istnieje.",
          });
      }

      const saltRound = 12;
      const salt = await bcrypt.genSalt(saltRound);
      if (!haslo || !salt) {
        console.error("Brak hasła lub soli do haszowania.");
        return res
          .status(400)
          .json({ error: "Brak hasła lub soli do haszowania." });
      }
      const bcryptPassword = await bcrypt.hash(haslo, salt);

      const adminRegister = await pool.query(
        "INSERT INTO akademia.uzytkownik (imie, nazwisko, adres_email, rola, aktywny) VALUES ($1, $2, $3, $4, $5) RETURNING id_uzytkownika",
        [imie, nazwisko, adres_email, "administrator", aktywny]
      );

      await pool.query(
        "INSERT INTO akademia.haslo (id_uzytkownika, haslo) VALUES ($1, $2) RETURNING *",
        [adminRegister.rows[0].id_uzytkownika, bcryptPassword]
      );

      console.log(
        "Dodano nowego administratora do bazy danych:",
        imie,
        nazwisko
      );

      res.status(201).json({
        message: "Administrator zarejestrowany pomyślnie.",
      });
    } catch (error) {
      console.error("Błąd przy rejestrowaniu: ", error);
      res.status(500).json({
        error:
          "Błąd rejestracji. Sprawdź, czy dane się nie duplikują (adres e-mail musi być unikatowy)",
      });
    }
  });
};

export default adminEndpoint;