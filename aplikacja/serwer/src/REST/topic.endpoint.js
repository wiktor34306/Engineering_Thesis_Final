const express = require("express");
const app = express();
import pool from "../../db";
import auth from "../middleware/auth";

const topicEndpoint = (app) => {
  app.post("/adding-topic", auth(["administrator","promotor", "superadministrator"]), async (req, res) => {
    const { id_promotora, id_katedry, temat, status, id_uzytkownika_dodajacego } = req.body;

    try {
      const existingPromotor = await pool.query(
        "SELECT * FROM akademia.promotor WHERE id_promotora = $1",
        [id_promotora]
      );

      if (existingPromotor.rows.length === 0) {
        return res.status(400).json({ error: "Podany identyfikator promotora nie istnieje." });
      }

      const existingKatedra = await pool.query(
        "SELECT * FROM akademia.katedra WHERE id_katedry = $1",
        [id_katedry]
      );

      if (existingKatedra.rows.length === 0) {
        return res.status(400).json({ error: "Podany identyfikator katedry nie istnieje." });
      }

      const existingUser = await pool.query(
        "SELECT * FROM akademia.uzytkownik WHERE id_uzytkownika = $1",
        [id_uzytkownika_dodajacego]
      );

      if (existingUser.rows.length === 0) {
        return res.status(400).json({ error: "Podany identyfikator użytkownika nie istnieje." });
      }

      const addTopicQuery = `
        INSERT INTO akademia.temat (temat, id_promotora, id_katedry, status, id_uzytkownika_dodajacego)
        VALUES ($1, $2, $3, $4, $5) RETURNING id_tematu
      `;

      const addedTopic = await pool.query(addTopicQuery, [temat, id_promotora, id_katedry, status, id_uzytkownika_dodajacego]);

      console.log("Dodano nowy temat do bazy danych:", temat);

      res.status(201).json({ message: "Temat dodany pomyślnie.", id_tematu: addedTopic.rows[0].id_tematu });
    } catch (error) {
      console.error("Błąd przy dodawaniu tematu: ", error);
      res.status(500).json({ error: "Błąd dodawania tematu." });
    }
  });

  app.get("/get-topics", auth(["administrator", "promotor", "superadministrator", "student"]), async (req, res) => {
    try {
      const topics = await pool.query(`
      SELECT
      t.id_tematu,
      t.temat,
      t.status,
      p.stopien_naukowy,
      u.imie AS imie_promotora,
      u.nazwisko AS nazwisko_promotora,
      k.nazwa AS nazwa_katedry,
      s.numer_albumu AS numer_albumu_studenta,
      u_student.imie AS imie_studenta,
      u_student.nazwisko AS nazwisko_studenta
    FROM
      akademia.temat AS t
    INNER JOIN
      akademia.promotor AS p ON t.id_promotora = p.id_promotora
    INNER JOIN
      akademia.uzytkownik AS u ON p.id_uzytkownika = u.id_uzytkownika
    INNER JOIN
      akademia.katedra AS k ON t.id_katedry = k.id_katedry
    LEFT JOIN
      akademia.wybor_studenta AS ws ON t.id_tematu = ws.id_tematu
    LEFT JOIN
      akademia.student AS s ON ws.numer_albumu = s.numer_albumu
    LEFT JOIN
      akademia.uzytkownik AS u_student ON s.id_uzytkownika = u_student.id_uzytkownika;    
      `);
      res.json(topics.rows);
    } catch (error) {
      console.error("Błąd przy pobieraniu tematów prac: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });

  app.get("/get-amount-of-topics",auth(["administrator","promotor", "superadministrator"]), async (req, res) => {
    try {
      const amountTopics = await pool.query("SELECT COUNT(*) FROM akademia.temat;");
      res.json(amountTopics.rows);
    } catch (error) {
      console.error("Błąd przy pobieraniu ilości tematów: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });

  app.get("/get-student-topics/:id",auth(["student"]), async (req, res) => {
    try {
      const { id } = req.params;
  
      const studentInfo = await pool.query(`
      SELECT
      s.id_uzytkownika,
      k.id_katedry,
      k.nazwa AS nazwa_katedry,
      s.id_kierunku,
      t.id_tematu,
      t.temat,
      t.status,
      p.stopien_naukowy,
      u.imie,
      u.nazwisko
  FROM
      akademia.student AS s
  INNER JOIN
      akademia.kierunek_studiow AS ks ON s.id_kierunku = ks.id_kierunku
  INNER JOIN
      akademia.katedra AS k ON ks.id_katedry = k.id_katedry
  INNER JOIN
      akademia.temat AS t ON k.id_katedry = t.id_katedry
  INNER JOIN
      akademia.promotor AS p ON t.id_promotora = p.id_promotora
  INNER JOIN
      akademia.uzytkownik AS u ON p.id_uzytkownika = u.id_uzytkownika
  WHERE
    s.id_uzytkownika = $1;
`, [id]);
  
      res.json(studentInfo.rows);
    } catch (error) {
      console.error("Błąd przy pobieraniu tematów dla studenta: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });

  app.get("/get-supervisor-topics/:id",auth(["promotor"]), async (req, res) => {
    try {
      const { id } = req.params;
      const supervisor = await pool.query(`
        SELECT id_promotora
        FROM akademia.promotor
        WHERE id_uzytkownika = $1
      `, [id]);
      const topics = await pool.query(`
        SELECT
          t.id_tematu,
          t.temat,
          t.status,
          p.stopien_naukowy,
          u.imie,
          u.nazwisko,
          k.nazwa AS nazwa_katedry,
          s.numer_albumu,
          us.imie AS imie_studenta,
          us.nazwisko AS nazwisko_studenta
        FROM
          akademia.temat AS t
        INNER JOIN
          akademia.promotor AS p ON t.id_promotora = p.id_promotora
        INNER JOIN
          akademia.uzytkownik AS u ON p.id_uzytkownika = u.id_uzytkownika
        INNER JOIN
          akademia.katedra AS k ON t.id_katedry = k.id_katedry
        LEFT JOIN
          akademia.wybor_studenta AS ws ON t.id_tematu = ws.id_tematu
        LEFT JOIN
          akademia.student AS s ON ws.numer_albumu = s.numer_albumu
        LEFT JOIN
          akademia.uzytkownik AS us ON s.id_uzytkownika = us.id_uzytkownika
        WHERE
          t.id_promotora = $1
      `, [supervisor.rows[0].id_promotora]);
      res.json(topics.rows);
    } catch (error) {
      console.error("Błąd przy pobieraniu tematów prac: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });

  app.get("/get-supervisor-topic-amount/:id", auth(["promotor"]), async (req, res) => {
    try {
      const { id } = req.params;
      const supervisor = await pool.query(`
        SELECT id_promotora
        FROM akademia.promotor
        WHERE id_uzytkownika = $1
      `, [id]);
      const topicCount = await pool.query(`
        SELECT COUNT(*)
        FROM akademia.temat
        WHERE id_promotora = $1
      `, [supervisor.rows[0].id_promotora]);
      res.json({ topicCount: topicCount.rows[0].count });
    } catch (error) {
      console.error("Błąd przy zliczaniu tematów prac: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });

  app.get("/get-topic-by-student-id/:id", auth(["student"]), async (req, res) => {
    try {
      const { id } = req.params;
      const studentChoice = await pool.query(`
      SELECT 
      t.id_tematu, 
      t.temat, 
      p.stopien_naukowy,
      u.imie AS imie_promotora,
      u.nazwisko AS nazwisko_promotora
    FROM 
      akademia.wybor_studenta AS ws
    INNER JOIN 
      akademia.student AS s ON ws.numer_albumu = s.numer_albumu
    INNER JOIN 
      akademia.uzytkownik AS student ON s.id_uzytkownika = student.id_uzytkownika
    INNER JOIN 
      akademia.temat AS t ON ws.id_tematu = t.id_tematu
    INNER JOIN 
      akademia.promotor AS p ON t.id_promotora = p.id_promotora
    INNER JOIN
      akademia.uzytkownik AS u ON p.id_uzytkownika = u.id_uzytkownika
    WHERE 
      student.id_uzytkownika = $1
      `, [id]);
      res.json(studentChoice.rows[0]);
    } catch (error) {
      console.error("Błąd przy pobieraniu tematu: ", error);
      res.status(500).json({ error: "Błąd pobierania danych" });
    }
  });

  app.put("/update-topic", auth(["administrator", "promotor", "superadministrator"]), async (req, res) => {
    const { id_tematu, nowy_temat } = req.body;
    const id_uzytkownika = req.user.id_uzytkownika;

    try {
      const existingTopic = await pool.query(
        "SELECT * FROM akademia.temat WHERE id_tematu = $1",
        [id_tematu]
      );
  
      if (existingTopic.rows.length === 0) {
        return res.status(400).json({ error: "Podany identyfikator tematu nie istnieje." });
      }
  
      const updateTopicQuery = `
        UPDATE akademia.temat
        SET temat = $1, id_uzytkownika_dodajacego = $2
        WHERE id_tematu = $3
      `;
  
      await pool.query(updateTopicQuery, [nowy_temat, id_uzytkownika, id_tematu]);
  
      console.log("Zaktualizowano temat w bazie danych:", nowy_temat);
  
      res.status(200).json({ message: "Temat zaktualizowany pomyślnie." });
    } catch (error) {
      console.error("Błąd przy aktualizacji tematu: ", error);
      res.status(500).json({ error: "Błąd aktualizacji tematu." });
    }
  });


  app.post("/reserve-topic", auth(["student"]), async (req, res) => {
    const { id_uzytkownika, id_tematu } = req.body;
  
    try {
      const existingStudent = `
        SELECT numer_albumu FROM akademia.student WHERE id_uzytkownika = $1
      `;
      const studentResult = await pool.query(existingStudent, [id_uzytkownika]);
  
      if (studentResult.rows.length === 0) {
        return res.status(400).json({ error: "Podany identyfikator użytkownika nie istnieje lub nie jest studentem." });
      }
  
      const numer_albumu = studentResult.rows[0].numer_albumu;
  
      const existingTopic = await pool.query(
        "SELECT * FROM akademia.temat WHERE id_tematu = $1 AND status = true",
        [id_tematu]
      );
  
      if (existingTopic.rows.length === 0) {
        return res.status(400).json({ error: "Podany identyfikator tematu nie istnieje lub jest już zarezerwowany." });
      }
  
      const reserveTopicQuery = `
        INSERT INTO akademia.wybor_studenta (numer_albumu, id_tematu)
        VALUES ($1, $2) RETURNING id_wyboru
      `;
  
      const reservedTopic = await pool.query(reserveTopicQuery, [numer_albumu, id_tematu]);
  
      const updateTopicStatusQuery = `
        UPDATE akademia.temat SET status = false WHERE id_tematu = $1
      `;
  
      await pool.query(updateTopicStatusQuery, [id_tematu]);
  
      console.log("Temat został zarezerwowany przez studenta:", numer_albumu);
  
      res.status(201).json({ message: "Temat zarezerwowany pomyślnie.", id_wyboru: reservedTopic.rows[0].id_wyboru });
    } catch (error) {
      console.error("Błąd przy rezerwacji tematu: ", error);
      res.status(500).json({ error: "Błąd rezerwacji tematu." });
    }
  });

  app.delete("/cancel-reservation", auth(["student", "administrator", "superadministrator"]), async (req, res) => {
    const { id_uzytkownika, id_tematu } = req.body;
  
    try {
      const existingStudent = `
        SELECT numer_albumu FROM akademia.student WHERE id_uzytkownika = $1
      `;
      const studentResult = await pool.query(existingStudent, [id_uzytkownika]);
  
      if (studentResult.rows.length === 0) {
        return res.status(400).json({ error: "Podany identyfikator użytkownika nie istnieje lub nie jest studentem." });
      }
  
      const numer_albumu = studentResult.rows[0].numer_albumu;
  
      const existingReservation = await pool.query(
        "SELECT * FROM akademia.wybor_studenta WHERE numer_albumu = $1 AND id_tematu = $2",
        [numer_albumu, id_tematu]
      );
  
      if (existingReservation.rows.length === 0) {
        return res.status(400).json({ error: "Podany identyfikator tematu nie istnieje lub nie jest zarezerwowany przez tego studenta." });
      }
  
      const deleteReservationQuery = `
        DELETE FROM akademia.wybor_studenta WHERE numer_albumu = $1 AND id_tematu = $2
      `;
  
      await pool.query(deleteReservationQuery, [numer_albumu, id_tematu]);
  
      const updateTopicStatusQuery = `
        UPDATE akademia.temat SET status = true WHERE id_tematu = $1
      `;
  
      await pool.query(updateTopicStatusQuery, [id_tematu]);
  
      console.log("Rezerwacja tematu została anulowana przez studenta:", numer_albumu);
  
      res.status(200).json({ message: "Rezerwacja tematu anulowana pomyślnie." });
    } catch (error) {
      console.error("Błąd przy anulowaniu rezerwacji tematu: ", error);
      res.status(500).json({ error: "Błąd anulowania rezerwacji tematu." });
    }
});

app.post("/reserve-topic-by-admin", auth(["administrator", "superadministrator"]), async (req, res) => {
  const { id_uzytkownika, id_tematu } = req.body;

  try {
    const existingStudent = `
      SELECT numer_albumu, imie, nazwisko FROM akademia.student 
      JOIN akademia.uzytkownik ON akademia.student.id_uzytkownika = akademia.uzytkownik.id_uzytkownika
      WHERE akademia.student.id_uzytkownika = $1
    `;
    const studentResult = await pool.query(existingStudent, [id_uzytkownika]);

    if (studentResult.rows.length === 0) {
      return res.status(400).json({ error: "Podany identyfikator użytkownika nie istnieje lub nie jest studentem." });
    }

    const numer_albumu = studentResult.rows[0].numer_albumu;
    const imie = studentResult.rows[0].imie;
    const nazwisko = studentResult.rows[0].nazwisko;

    const existingTopic = await pool.query(
      "SELECT temat FROM akademia.temat WHERE id_tematu = $1 AND status = true",
      [id_tematu]
    );

    if (existingTopic.rows.length === 0) {
      return res.status(400).json({ error: "Podany identyfikator tematu nie istnieje lub jest już zarezerwowany." });
    }

    const temat = existingTopic.rows[0].temat;

    const existingReservation = await pool.query(
      "SELECT * FROM akademia.wybor_studenta WHERE numer_albumu = $1",
      [numer_albumu]
    );
    
    if (existingReservation.rows.length > 0) {
      return res.status(400).json({ error: "Student już ma przypisany temat." });
    }

    const reserveTopicQuery = `
      INSERT INTO akademia.wybor_studenta (numer_albumu, id_tematu)
      VALUES ($1, $2) RETURNING id_wyboru
    `;

    const reservedTopic = await pool.query(reserveTopicQuery, [numer_albumu, id_tematu]);

    const updateTopicStatusQuery = `
      UPDATE akademia.temat SET status = false WHERE id_tematu = $1
    `;

    await pool.query(updateTopicStatusQuery, [id_tematu]);

    console.log(`Temat "${temat}" został zarezerwowany dla studenta ${imie} ${nazwisko} (numer albumu: ${numer_albumu})`);

    res.status(201).json({ message: `Temat "${temat}" zarezerwowany pomyślnie dla studenta ${imie} ${nazwisko}.`, id_wyboru: reservedTopic.rows[0].id_wyboru });
  } catch (error) {
    console.error("Błąd przy rezerwacji tematu: ", error);
    res.status(500).json({ error: "Błąd rezerwacji tematu." });
  }
});

app.delete("/delete-topic/:id_tematu", auth(["administrator", "promotor", "superadministrator"]), async (req, res) => {
  try {
    const { id_tematu } = req.params;

    await pool.query("DELETE FROM akademia.wybor_studenta WHERE id_tematu = $1", [id_tematu]);

    await pool.query("DELETE FROM akademia.temat WHERE id_tematu = $1", [id_tematu]);

    console.log(`Usunięto temat o ID ${id_tematu}`);
    res.status(200).json({ message: "Temat został pomyślnie usunięty" });
  } catch (error) {
    console.error("Błąd przy usuwaniu tematu: ", error);
    res.status(500).json({ error: "Błąd usuwania danych" });
  }
});

};

export default topicEndpoint;