const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
import pool from "../../db";
import auth from "../middleware/auth";


const studentEndpoint = (app) => {

  app.get("/get-students", auth(["administrator","superadministrator","promotor"]), async (req, res) => {
    try {
      const students = await pool.query("SELECT * FROM akademia.uzytkownik WHERE akademia.uzytkownik.rola='student';");
      res.json(students.rows);
    } catch (error) {
      console.error("Błąd przy pobieraniu studentów: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });

  app.get("/lists-of-students", auth(["administrator","superadministrator"]), async (req, res) => {
    try {
      const studentsQuery = `
        SELECT akademia.uzytkownik.id_uzytkownika, numer_albumu, imie, nazwisko FROM akademia.student 
        JOIN akademia.uzytkownik ON akademia.student.id_uzytkownika = akademia.uzytkownik.id_uzytkownika
      `;
      const studentsResult = await pool.query(studentsQuery);
  
      if (studentsResult.rows.length === 0) {
        return res.status(400).json({ error: "Nie znaleziono żadnych studentów." });
      }
    
      res.status(200).json({ students: studentsResult.rows });
    } catch (error) {
      console.error("Błąd przy pobieraniu listy studentów: ", error);
      res.status(500).json({ error: "Błąd przy pobieraniu listy studentów." });
    }
  });

  app.get("/get-amount-of-students",auth(["administrator","superadministrator","promotor"]), async (req, res) => {
    try {
      const amountStudents = await pool.query("SELECT COUNT(*) FROM akademia.uzytkownik WHERE akademia.uzytkownik.rola='student';");
      res.json(amountStudents.rows);
    } catch (error) {
      console.error("Błąd przy pobieraniu liczby studentów: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });

  app.post("/student-registration",auth(["administrator","superadministrator"]), async (req, res) => {
    const { imie, nazwisko, adres_email, numer_albumu, kierunek, haslo, rola, aktywny } = req.body;

    try {

      const existingStudent = await pool.query(
        "SELECT * FROM akademia.uzytkownik WHERE adres_email = $1",
        [adres_email]
      );

      if (existingStudent.rows.length > 0) {
        return res.status(400).json({ error: "Student o podanym adresie e-mail już istnieje." });
      }

      const saltRound = 12;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(haslo, salt);

      const adminRegister = await pool.query(
        "INSERT INTO akademia.uzytkownik (imie, nazwisko, adres_email, rola, aktywny) VALUES ($1, $2, $3, $4, $5) RETURNING id_uzytkownika",
        [imie, nazwisko, adres_email, 'student', aktywny]
      );

      await pool.query(
        "INSERT INTO akademia.haslo (id_uzytkownika, haslo) VALUES ($1, $2) RETURNING *",
        [adminRegister.rows[0].id_uzytkownika, bcryptPassword]
      );

      await pool.query(
        "INSERT INTO akademia.student (numer_albumu, id_uzytkownika, id_kierunku) VALUES ($1, $2, $3)",
        [numer_albumu, adminRegister.rows[0].id_uzytkownika, kierunek]
      );

      console.log("Dodano nowego studenta do bazy danych:", imie, nazwisko);

      res.status(201).json({ message: "Student zarejestrowany pomyślnie." });
    } catch (error) {
      console.error("Błąd przy rejestrowaniu: ", error);
      res.status(500).json({ error: "Błąd rejestracji. Sprawdź, czy dane się nie duplikują (adres e-mail musi być unikatowy)" });
    }
  });

  app.get("/get-department-and-academic-department-by-student-id/:id", auth(["student"]), async (req, res) => {
    try {
      const { id } = req.params;
  
      const studyInfo = await pool.query(`
      SELECT
        s.id_uzytkownika,
        k.nazwa AS katedra,
         ks.nazwa AS kierunek
       FROM
         akademia.student AS s
       INNER JOIN
         akademia.kierunek_studiow AS ks ON s.id_kierunku = ks.id_kierunku
       INNER JOIN
         akademia.katedra AS k ON ks.id_katedry = k.id_katedry
        WHERE
          s.id_uzytkownika = $1;
      `, [id]);
  
      res.json(studyInfo.rows[0]);
    } catch (error) {
      console.error("Błąd przy pobieraniu informacji o studiach użytkownika: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });
};

export default studentEndpoint;
