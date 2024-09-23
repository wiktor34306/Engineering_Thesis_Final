const express = require("express");
const app = express();
import pool from "../../db";
import auth from "../middleware/auth";

const subjectEndpoint = (app) => {

  app.get("/get-subjects", auth(["administrator","superadministrator", "promotor", "student"]), async (req, res) => {
    try {
      const subjects = await pool.query("SELECT * from akademia.kierunek_studiow ORDER BY nazwa;");
      res.json(subjects.rows);
    } catch (error) {
      console.error("Błąd przy pobieraniu katedr: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });
  
  app.post("/subject-registration", auth(["administrator","superadministrator"]), async (req, res) => {
    const { nazwaKierunku, idWydzialu, idKatedry } = req.body;
  
    try {
      const existingSubject = await pool.query(
        "SELECT id_kierunku FROM akademia.kierunek_studiow WHERE nazwa = $1 AND id_wydzialu = $2 AND id_katedry = $3",
        [nazwaKierunku, idWydzialu, idKatedry]
      );
  
      if (existingSubject.rows.length > 0) {
        return res.status(400).json({
          error: "Kierunek studiów o podanej nazwie już istnieje na tym wydziale i w tej katedrze.",
        });
      }
  
      // Dodaj nowy kierunek studiów do bazy danych.
      const subjectRegister = await pool.query(
        "INSERT INTO akademia.kierunek_studiow (nazwa, id_wydzialu, id_katedry) VALUES ($1, $2, $3) RETURNING id_kierunku",
        [nazwaKierunku, idWydzialu, idKatedry]
      );
  
      console.log("Dodano nowy kierunek studiów do bazy danych:", nazwaKierunku);
  
      res.status(201).json({ message: "Kierunek studiów zarejestrowany pomyślnie." });
    } catch (error) {
      console.error("Błąd przy rejestrowaniu kierunku studiów: ", error);
      res.status(500).json({
        error: "Błąd rejestracji kierunku studiów. " + error.message,
      });
    }
  });
  
  app.put("/update-subject-name", auth(["administrator","superadministrator"]), async (req, res) => {
    const { id_kierunku, new_nazwa } = req.body;
  
    try {
      const existingSubjectName = await pool.query(
        "SELECT id_kierunku FROM akademia.kierunek_studiow WHERE nazwa = $1",
        [new_nazwa]
      );
  
      if (existingSubjectName.rows.length > 0) {
        return res.status(400).json({
          error: "Kierunek studiów o podanej nazwie już istnieje.",
        });
      }
  
      const updateSubjectName = await pool.query(
        "UPDATE akademia.kierunek_studiow SET nazwa = $1 WHERE id_kierunku = $2",
        [new_nazwa, id_kierunku]
      );
  
      console.log(`Zaktualizowano nazwę kierunku studiów o ID ${id_kierunku} na: ${new_nazwa}`);
  
      res.status(200).json({ message: "Nazwa kierunku studiów zaktualizowana pomyślnie." });
    } catch (error) {
      console.error("Błąd przy aktualizacji nazwy kierunku studiów: ", error);
      res.status(500).json({
        error: "Błąd aktualizacji nazwy kierunku studiów.",
      });
    }
  });

  app.delete("/delete-subject", auth(["administrator","superadministrator"]), async (req, res) => {
    const { id_kierunku } = req.body;
  
    try {
      await pool.query(
        "DELETE FROM akademia.student WHERE id_kierunku = $1",
        [id_kierunku]
      );
      
      await pool.query(
        "DELETE FROM akademia.kierunek_studiow WHERE id_kierunku = $1",
        [id_kierunku]
      );
  
      console.log(`Usunięto kierunek studiów o ID ${id_kierunku}`);
  
      res.status(200).json({ message: "Kierunek studiów usunięty pomyślnie." });
    } catch (error) {
      console.error("Błąd przy usuwaniu kierunku studiów: ", error);
      res.status(500).json({
        error: "Błąd usuwania kierunku studiów.",
      });
    }
  });
  

};

export default subjectEndpoint;
