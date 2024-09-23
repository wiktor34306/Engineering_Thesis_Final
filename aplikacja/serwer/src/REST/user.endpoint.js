const express = require("express");
const app = express();
import pool from "../../db";
import admin from '../middleware/admin';
import auth from "../middleware/auth";

const userEndpoint = (app) => {
  app.get("/get-users", auth(["administrator","superadministrator"]),  async (req, res) => {
    try {
      const users = await pool.query("SELECT * FROM akademia.uzytkownik;");
      res.json(users.rows);
    } catch (error) {
      console.error("Błąd przy pobieraniu użytkowników: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });


  app.get("/get-amount-of-users", auth(["administrator","superadministrator"]), async (req, res) => {
    try {
      const users = await pool.query("SELECT COUNT(*) FROM akademia.uzytkownik;");
      res.json(users.rows);
    } catch (error) {
      console.error("Błąd przy pobieraniu użytkowników: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });

  app.get("/get-user/:id_uzytkownika", auth(["administrator","superadministrator", "pracownik", "promotor", "student"]),  async (req, res) => {
    try {
      const { id_uzytkownika } = req.params;
      const user = await pool.query(`
        SELECT uzytkownik.*, student.numer_albumu, promotor.stopien_naukowy 
        FROM akademia.uzytkownik 
        LEFT JOIN akademia.student ON uzytkownik.id_uzytkownika = student.id_uzytkownika
        LEFT JOIN akademia.promotor ON uzytkownik.id_uzytkownika = promotor.id_uzytkownika
        WHERE uzytkownik.id_uzytkownika = $1
      `, [id_uzytkownika]);
      
      let userRole = user.rows[0].rola;
      let response = {};
  
      switch(userRole) {
        case 'student':
          response = {
            id_uzytkownika: user.rows[0].id_uzytkownika,
            imie: user.rows[0].imie,
            nazwisko: user.rows[0].nazwisko,
            adres_email: user.rows[0].adres_email,
            rola: user.rows[0].rola,
            aktywny: user.rows[0].aktywny,
            numer_albumu: user.rows[0].numer_albumu
          };
          break;
        case 'promotor':
          response = {
            id_uzytkownika: user.rows[0].id_uzytkownika,
            imie: user.rows[0].imie,
            nazwisko: user.rows[0].nazwisko,
            adres_email: user.rows[0].adres_email,
            rola: user.rows[0].rola,
            aktywny: user.rows[0].aktywny,
            stopien_naukowy: user.rows[0].stopien_naukowy
          };
          break;
        default:
          response = {
            id_uzytkownika: user.rows[0].id_uzytkownika,
            imie: user.rows[0].imie,
            nazwisko: user.rows[0].nazwisko,
            adres_email: user.rows[0].adres_email,
            rola: user.rows[0].rola,
            aktywny: user.rows[0].aktywny
          };
      }
  
      res.status(200).json(response);
    } catch (error) {
      console.error("Błąd przy pobieraniu użytkownika: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });

  app.delete("/delete-user/:id", auth(["superadministrator", "administrator"]), async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await pool.query("SELECT * FROM akademia.uzytkownik WHERE id_uzytkownika = $1", [id]);
  
      if (user.rows.length === 0) {
        return res.status(400).json({ error: "Nie znaleziono użytkownika o podanym ID." });
      }
  
      await pool.query("DELETE FROM akademia.haslo WHERE id_uzytkownika = $1", [id]);
  
      await pool.query("DELETE FROM akademia.uzytkownik WHERE id_uzytkownika = $1", [id]);
  
      console.log(`Usunięto użytkownika o ID: ${id}`);
      res.json({ message: "Użytkownik został usunięty." });
    } catch (error) {
      console.error("Błąd przy usuwaniu użytkownika: ", error);
      res.status(500).json({ error: "Błąd serwera." });
    }
  });

};



export default userEndpoint;
