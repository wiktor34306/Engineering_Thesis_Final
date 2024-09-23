const express = require('express');
const app = express();
const pdf = require('html-pdf');
const path = require('path');
const pdfTemplate = require('../documents/index');
const fs = require('fs');
import pool from "../../db";
import auth from "../middleware/auth";
import moment from 'moment-timezone';

const generatePdfEndpoint = (app) => {
  app.post('/create-pdf', auth(['administrator', 'superadministrator', 'promotor']), async (req, res) => {
  
    const now = moment().tz("Europe/Warsaw");
    const currentDate = now.format('YYYYMMDD');
    const currentTime = now.format('HHmmss');
  
    const fileName = `karta_zgloszenia_tematu_${currentDate}_${currentTime}_${req.body.data.id_uzytkownika}.pdf`;
  
    const relativeFilePath = `../generated_pdf_file/${fileName}`;
    const query = 'INSERT INTO akademia.dokument (nazwa, sciezka, data_utworzenia, id_uzytkownika) VALUES ($1, $2, $3, $4) RETURNING id_dokumentu';
    const values = [fileName, relativeFilePath, now.toDate(), req.body.data.id_uzytkownika];
  
    try {
      const result = await pool.query(query, values);
      const documentId = result.rows[0].id_dokumentu;
  
      pdf.create(pdfTemplate(req.body.data), {}).toFile(path.join(__dirname, relativeFilePath), (err) => {
        if (err) {
          console.error('Błąd generowania pliku PDF:', err);
          return res.status(500).send(Promise.reject());
        }
  
        res.send({ documentId: documentId, fileName: fileName });
      });
    } catch (error) {
      console.error('Błąd zapisu informacji o pliku PDF do bazy danych:', error);
      res.status(500).send(Promise.reject());
    }
  });

  app.get('/fetch-pdf', auth(['administrator', 'superadministrator', 'promotor', 'pracownik']), async (req, res) => {  
    const query = 'SELECT nazwa FROM akademia.dokument WHERE id_dokumentu = $1';
    const values = [req.query.documentId];
  
    try {
      const result = await pool.query(query, values);
      const fileName = result.rows[0].nazwa;
  
      const filePath = path.join(__dirname, `../generated_pdf_file/${fileName}`);
  
      res.sendFile(filePath);
    } catch (error) {
      console.error('Błąd pobierania nazwy pliku PDF z bazy danych:', error);
      res.status(500).send(Promise.reject());
    }
  });
  
  app.get('/get-documents/:id_uzytkownika', auth(['promotor']), async (req, res) => {
    const { id_uzytkownika } = req.params;
    const query = `
      SELECT d.id_dokumentu, d.nazwa, d.sciezka, d.data_utworzenia, u.imie, u.nazwisko
      FROM akademia.dokument d
      JOIN akademia.uzytkownik u ON d.id_uzytkownika = u.id_uzytkownika
      WHERE d.id_uzytkownika = $1
    `;
    const values = [id_uzytkownika];
    try {
      const result = await pool.query(query, values);
      res.send(result.rows);
    } catch (error) {
      console.error('Błąd pobierania dokumentów z bazy danych:', error);
      res.status(500).send(Promise.reject());
    }
  });
  

app.get('/get-all-documents', auth(['administrator', 'superadministrator','pracownik']), async (req, res) => {
  const query = `
    SELECT d.id_dokumentu, d.nazwa, d.sciezka, d.data_utworzenia, u.imie, u.nazwisko
    FROM akademia.dokument d
    JOIN akademia.uzytkownik u ON d.id_uzytkownika = u.id_uzytkownika
  `;
  try {
    const result = await pool.query(query);
    res.send(result.rows);
  } catch (error) {
    console.error('Błąd pobierania dokumentów z bazy danych:', error);
    res.status(500).send(Promise.reject());
  }
});

app.get('/get-count-of-all-documents', auth(['administrator', 'superadministrator','pracownik']), async (req, res) => {
  const query = `
    SELECT COUNT(*) FROM akademia.dokument
  `;
  try {
    const result = await pool.query(query);
    res.send(result.rows);
  } catch (error) {
    console.error('Błąd pobierania ilości dokumentów z bazy danych:', error);
    res.status(500).send(Promise.reject());
  }
});

app.delete('/delete-pdf/:id', auth(['administrator', 'superadministrator', 'promotor']), async (req, res) => {
  const documentId = req.params.id;

  const query = 'SELECT * FROM akademia.dokument WHERE id_dokumentu = $1';
  const values = [documentId];

  try {
    const result = await pool.query(query, values);
    const document = result.rows[0];

    fs.unlink(path.join(__dirname, document.sciezka), (err) => {
      if (err) {
        console.error('Błąd usuwania pliku PDF:', err);
        return res.status(500).send(Promise.reject());
      }

      const deleteQuery = 'DELETE FROM akademia.dokument WHERE id_dokumentu = $1';
      pool.query(deleteQuery, values, (error, result) => {
        if (error) {
          console.error('Błąd usuwania informacji o pliku PDF z bazy danych:', error);
          return res.status(500).send(Promise.reject());
        }

        res.send({ message: 'Dokument został pomyślnie usunięty.' });
      });
    });
  } catch (error) {
    console.error('Błąd pobierania informacji o pliku PDF z bazy danych:', error);
    res.status(500).send(Promise.reject());
  }
});
};

export default generatePdfEndpoint;