import pool from "../../db";
const express = require('express');
const app = express();
import { userManager } from '../business/user.manager';


const loginEndpoint = (app) => {
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await userManager.authenticate(email, password);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Błąd logowania:', error);
    res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
  }
});

  app.delete('/logout/:id', async (req, res) => {
    const id_uzytkownika  = req.params.id;
    try {
      const token = await userManager.removeHashSession(id_uzytkownika);
      
      res.status(202).json(token)
    } catch (error) {
      console.error("Błąd usuwania tokena:",error);
      res.status(401).json({error})
    }
  })
}

export default loginEndpoint;
