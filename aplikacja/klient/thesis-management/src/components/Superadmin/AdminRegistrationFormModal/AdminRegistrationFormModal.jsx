import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import Button from '@mui/material/Button';
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import "./AdminRegistrationFormModalStyle.css";
import config from '../../../config';

export const AdminRegistrationFormModal = ({ open, handleClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAdress, setEmailAdress] = useState("");
  const [password, setPassword] = useState("");
  const [aktywny, setAktywny] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleRegister = () => {
    if (isRegistering) return;
  
    setErrorMessage("");
    setSuccessMessage("");
    setIsRegistering(true);
  
    if (!firstName || !lastName || !emailAdress || !password) {
      toast.error('Nie uzupełniono wszystkich pól.');
      setIsRegistering(false); 
      return;
    }
  
    if (!isValidEmail(emailAdress)) {
      toast.error("Niepoprawny format adresu e-mail.");
      setIsRegistering(false);
      return;
    }
  
    const registrationData = {
      imie: firstName,
      nazwisko: lastName,
      adres_email: emailAdress,
      rola: 'administrator',
      aktywny: aktywny,
      haslo: password,
    };
  
    fetch(`${config.BASE_URL}/administrator-registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(registrationData),
    })
    .then(async (response) => {
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Błąd autoryzacji: ', response.status);
          localStorage.removeItem('token'); 
          navigate('/'); 
          return;
        }
        if (response.status === 400 && data.error) {
          setErrorMessage(data.error);
        } else {
          console.error("Błąd HTTP: ", response.status);
          toast.error("Błąd rejestracji administratora. Spróbuj ponownie.");
        }
        setIsRegistering(false);
        return;
      }
  
      if (data.message === 'Administrator zarejestrowany pomyślnie.') {
        toast.success(data.message);
        navigate('/viewalluserssuperadmin');
        handleClose(); 
      } else if (data && data.error) {
        toast.error(data.error);
      } else {
        console.error("Nieprawidłowa odpowiedź serwera.");
        toast.error("Błąd rejestracji administratora");
      }
  
      setIsRegistering(false);
    })
    .catch((error) => {
      console.error("Błąd rejestracji: ", error);
      toast.error("Nie udało się dodać administratora");
      setIsRegistering(false);
    });
  
  };
  
  const isValidEmail = (emailAdress) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAdress);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="super-admin-modal-title"
      aria-describedby="super-admin-modal-description"
    >
      <div className="super-admin-registration-form-modal">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <h2>Formularz rejestracji administratora</h2>

        <form className="registration-super-admin-form">
          <TextField
            label="Imię"
            variant="outlined"
            fullWidth
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <TextField
            label="Nazwisko"
            variant="outlined"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <TextField
            label="Adres e-mail"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={emailAdress}
            onChange={(e) => setEmailAdress(e.target.value)}
          />

          <TextField
            label="Hasło"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormControlLabel
            control={<Checkbox checked={aktywny} onChange={() => setAktywny(!aktywny)} color="primary" />}
            label="Aktywny"
          />
          <br></br>

          <div className="messages">
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>

          <Button
            id="super-admin-accept-button"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            Zarejestruj administratora
          </Button>
        </form>
      </div>
    </Modal>
  );
};
