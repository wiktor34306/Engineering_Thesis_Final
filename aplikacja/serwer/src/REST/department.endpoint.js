const express = require("express");
const app = express();
import pool from "../../db";
import auth from "../middleware/auth";

const departmentEndpoint = (app) => {

  app.get("/get-departments", auth(["administrator","superadministrator","promotor"]), async (req, res) => {
    try {
      const departments = await pool.query("SELECT * FROM akademia.wydzial ORDER BY nazwa;");
      res.json(departments.rows);
    } catch (error) {
      console.error("Błąd przy pobieraniu wydziałów: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });

  
  app.post("/department-registration", auth(["administrator","superadministrator"]), async (req, res) => {
    const { nazwa } = req.body;
  
    try {
      const existingDepartment = await pool.query(
        "SELECT id_wydzialu FROM akademia.wydzial WHERE nazwa = $1",
        [nazwa]
      );
  
      if (existingDepartment.rows.length > 0) {
        return res.status(400).json({
          error: "Wydział o podanej nazwie już istnieje.",
        });
      }
  
      const departmentRegister = await pool.query(
        "INSERT INTO akademia.wydzial (nazwa) VALUES ($1) RETURNING id_wydzialu",
        [nazwa]
      );
  
      console.log("Dodano nowy wydział do bazy danych:", nazwa);
  
      res.status(201).json({ message: "Wydział zarejestrowany pomyślnie." });
    } catch (error) {
      console.error("Błąd przy rejestrowaniu: ", error);
      res.status(500).json({
        error: "Błąd rejestracji. Sprawdź, czy dane się nie duplikują.",
      });
    }
  });

  app.put("/update-department-name", auth(["administrator","superadministrator"]), async (req, res) => {
    const { id_wydzialu, new_nazwa } = req.body;
  
    try {
      const existingDepartment = await pool.query(
        "SELECT id_wydzialu FROM akademia.wydzial WHERE nazwa = $1",
        [new_nazwa]
      );
  
      if (existingDepartment.rows.length > 0) {
        return res.status(400).json({
          error: "Wydział o podanej nazwie już istnieje.",
        });
      }
  
      const updateDepartmentName = await pool.query(
        "UPDATE akademia.wydzial SET nazwa = $1 WHERE id_wydzialu = $2",
        [new_nazwa, id_wydzialu]
      );
  
      console.log(`Zaktualizowano nazwę wydziału o ID ${id_wydzialu} na: ${new_nazwa}`);
  
      res.status(200).json({ message: "Nazwa wydziału zaktualizowana pomyślnie." });
    } catch (error) {
      console.error("Błąd przy aktualizacji nazwy wydziału: ", error);
      res.status(500).json({
        error: "Błąd aktualizacji nazwy wydziału.",
      });
    }
  });

  app.delete("/delete-department", auth(["administrator","superadministrator"]), async (req, res) => {
    const { id_wydzialu } = req.body;
  
    try {
      await pool.query(
        "DELETE FROM akademia.katedra WHERE id_wydzialu = $1",
        [id_wydzialu]
      );
  
      await pool.query(
        "DELETE FROM akademia.kierunek_studiow WHERE id_wydzialu = $1",
        [id_wydzialu]
      );
  
      await pool.query(
        "DELETE FROM akademia.wydzial WHERE id_wydzialu = $1",
        [id_wydzialu]
      );
  
      console.log(`Usunięto wydział o ID ${id_wydzialu}`);
  
      res.status(200).json({ message: "Wydział usunięty pomyślnie." });
    } catch (error) {
      console.error("Błąd przy usuwaniu wydziału: ", error);
      res.status(500).json({
        error: "Błąd usuwania wydziału.",
      });
    }
  });
  
};

export default departmentEndpoint;
