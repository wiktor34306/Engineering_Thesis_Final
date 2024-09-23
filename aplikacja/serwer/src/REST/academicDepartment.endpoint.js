const express = require("express");
const app = express();
import pool from "../../db";
import auth from "../middleware/auth";

const academicDepartmentEndpoint = (app) => {

  app.get("/get-academic-departments",auth(["administrator","superadministrator","promotor","student"]), async (req, res) => {
    try {
      const academicDepartments = await pool.query("SELECT * from akademia.katedra ORDER BY nazwa;");
      res.json(academicDepartments.rows);
    } catch (error) {
      console.error("Błąd przy pobieraniu katedr: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });
  
  app.post("/academic-department-registration",auth(["administrator","superadministrator"]), async (req, res) => {
    const { nazwaKatedry, idWydzialu } = req.body;
  
    try {
      const existingDepartment = await pool.query(
        "SELECT id_katedry FROM akademia.katedra WHERE nazwa = $1 AND id_wydzialu = $2",
        [nazwaKatedry, idWydzialu]
      );
  
      if (existingDepartment.rows.length > 0) {
        return res.status(400).json({
          error: "Katedra o podanej nazwie już istnieje na tym wydziale.",
        });
      }
  
      const departmentRegister = await pool.query(
        "INSERT INTO akademia.katedra (nazwa, id_wydzialu) VALUES ($1, $2) RETURNING id_katedry",
        [nazwaKatedry, idWydzialu]
      );
  
      console.log("Dodano nową katedrę do bazy danych:", nazwaKatedry);
  
      res.status(201).json({ message: "Katedra zarejestrowana pomyślnie." });
    } catch (error) {
      console.error("Błąd przy rejestrowaniu katedry: ", error);
      res.status(500).json({
        error: "Błąd rejestracji katedry. " + error.message,
      });
    }
  });

  app.put("/update-academic-department-name", auth(["administrator","superadministrator"]), async (req, res) => {
    const { id_katedry, new_nazwa } = req.body;
  
    try {
      const existingAcademicDepartment = await pool.query(
        "SELECT id_katedry FROM akademia.katedra WHERE nazwa = $1",
        [new_nazwa]
      );
  
      if (existingAcademicDepartment.rows.length > 0) {
        return res.status(400).json({
          error: "Katedra o podanej nazwie już istnieje.",
        });
      }
  
      const updateAcademicDepartmentName = await pool.query(
        "UPDATE akademia.katedra SET nazwa = $1 WHERE id_katedry = $2",
        [new_nazwa, id_katedry]
      );
  
      console.log(`Zaktualizowano nazwę katedry o ID ${id_katedry} na: ${new_nazwa}`);
  
      res.status(200).json({ message: "Nazwa katedry zaktualizowana pomyślnie." });
    } catch (error) {
      console.error("Błąd przy aktualizacji nazwy katedry: ", error);
      res.status(500).json({
        error: "Błąd aktualizacji nazwy katedry.",
      });
    }
  });

  app.delete("/delete-academic-department", auth(["administrator","superadministrator"]), async (req, res) => {
    const { id_katedry } = req.body;
  
    try {
      await pool.query(
        "DELETE FROM akademia.temat WHERE id_katedry = $1",
        [id_katedry]
      );
  
      await pool.query(
        "DELETE FROM akademia.kierunek_studiow WHERE id_katedry = $1",
        [id_katedry]
      );
  
      await pool.query(
        "DELETE FROM akademia.katedra WHERE id_katedry = $1",
        [id_katedry]
      );
  
      console.log(`Usunięto katedrę o ID ${id_katedry}`);
  
      res.status(200).json({ message: "Katedra usunięta pomyślnie." });
    } catch (error) {
      console.error("Błąd przy usuwaniu katedry: ", error);
      res.status(500).json({
        error: "Błąd usuwania katedry.",
      });
    }
  });
  
};

export default academicDepartmentEndpoint;
