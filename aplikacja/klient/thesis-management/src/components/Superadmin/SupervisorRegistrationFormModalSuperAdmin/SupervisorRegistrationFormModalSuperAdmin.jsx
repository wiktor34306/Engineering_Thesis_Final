import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import './SupervisorRegistrationFormModalSuperAdminStyle.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

export const SupervisorRegistrationFormModalSuperAdmin = ({ open, handleClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAdress, setEmailAdress] = useState('');
  const [academicDegree, setAcademicDegree] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegisterSupervisor = async (e) => {
    e.preventDefault();
  
    if (isRegistering) return;
  
    if (!firstName || !lastName || !emailAdress || !academicDegree || !password) {
      toast.error('Nie uzupełniono wszystkich pól.');
      return;
    }

  const isValidEmail = (emailAdress) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAdress);
  };

   if (!isValidEmail(emailAdress)) {
    toast.error("Niepoprawny format adresu e-mail.");
    return;
  }
    setIsRegistering(true);

    const supervisorData = {
      imie: firstName,
      nazwisko: lastName,
      adres_email: emailAdress,
      stopien_naukowy: academicDegree,
      haslo: password,
      rola: 'promotor',
      aktywny: isActive,
    };

    try {
      const response = await fetch(`${config.BASE_URL}/supervisor-registration`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(supervisorData),
      });

      const data = await response.json();

      if (response.ok) {

        if (data.message === 'Promotor zarejestrowany pomyślnie.') {
          setSuccessMessage(data.message);
          toast.success(data.message);
          navigate('/viewalluserssuperadmin');
          handleClose();
        } 
        else if (data && data.error) {
          setErrorMessage(data.error);
          toast.error(data.error);
          
        } else {
          console.error('Nieprawidłowa odpowiedź serwera.');
          setErrorMessage('Błąd rejestracji promotora.');
          toast.error('Błąd rejestracji promotora.');
        }
      } else {
        if (response.status === 400 && data.error) {
          setErrorMessage(data.error);
        } 
        
        else {
          console.error('Błąd HTTP: ', response.status);
          setErrorMessage('Błąd rejestracji promotora. Spróbuj ponownie.');
          toast.error('Błąd rejestracji promotora. Spróbuj ponownie.');
        }
      }

    } catch (error) {
      console.error('Błąd rejestracji promotora: ', error);
      setErrorMessage('Nie udało się zarejestrować promotora. Spróbuj ponownie.');
      toast.error('Nie udało się zarejestrować promotora. Spróbuj ponownie.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleModalClose = () => {
    if (!firstName || !lastName || !emailAdress || !academicDegree || !password) {
      toast.error('Nie wszystkie pola zostały uzupełnione.');
    } else {
      handleClose();
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [successMessage, errorMessage]);

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="super-admin-modal-title"
      aria-describedby="super-admin-modal-description"
    >
      <Box className="supervisor-registration-form-modal">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <h2>Formularz rejestracji promotora</h2>

        <form className="adding-topic-super-admin">
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
            variant="outlined"
            fullWidth
            margin="normal"
            value={emailAdress}
            onChange={(e) => setEmailAdress(e.target.value)}
          />

          <TextField
            label="Stopień naukowy"
            variant="outlined"
            fullWidth
            margin="normal"
            value={academicDegree}
            onChange={(e) => setAcademicDegree(e.target.value)}
          />

          <TextField
            label="Hasło"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormControlLabel
            control={<Checkbox checked={isActive} onChange={() => setIsActive(!isActive)} color="primary" />}
            label="Aktywny"
          />
          <br />

          <Button id="supervisor-accept-button" type="submit" onClick={handleRegisterSupervisor}>
            Zarejestruj promotora
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
