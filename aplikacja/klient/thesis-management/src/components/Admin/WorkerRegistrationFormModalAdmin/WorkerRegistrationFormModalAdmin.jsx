import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import './WorkerRegistrationFormModalAdminStyle.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

export const WorkerRegistrationFormModalAdmin = ({ open, handleClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAdress, setEmailAdress] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleWorkerSupervisor = async (e) => {
    e.preventDefault();

    if (isRegistering) return;

    setErrorMessage('');
    setSuccessMessage('');
    setIsRegistering(true);

    if (!firstName || !lastName || !emailAdress || !password) {
      toast.error('Nie uzupełniono wszystkich pól.');
      setIsRegistering(false);
      return;
    }

    if (!isValidEmail(emailAdress)) {
      toast.error('Niepoprawny format adresu e-mail.');
      setIsRegistering(false);
      return;
    }

    try {
      const response = await fetch(`${config.BASE_URL}/worker-registration`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          imie: firstName,
          nazwisko: lastName,
          adres_email: emailAdress,
          haslo: password,
          rola: 'pracownik',
          aktywny: isActive,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === 'Pracownik zarejestrowany pomyślnie.') {
          toast.success(data.message);
          navigate('/viewallusersadmin');
          handleClose();
        } else if (data && data.error) {
          toast.error(data.error);
        } else {
          console.error('Nieprawidłowa odpowiedź serwera.');
          toast.error('Błąd rejestracji pracownika');
        }
      } else {
        if (response.status === 400 && data.error) {
          toast.error(data.error);
        } else {
          console.error('Błąd HTTP:', response.status);
          toast.error('Błąd rejestracji pracownika. Spróbuj ponownie.');
        }
      }
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      toast.error('Nie udało się zarejestrować pracownika. Spróbuj ponownie.');
    } finally {
      setIsRegistering(false);
    }
  };

  const isValidEmail = (emailAdress) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAdress);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="admin-modal-title"
      aria-describedby="admin-modal-description"
    >
      <Box className="worker-registration-form-modal">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <h2>Formularz rejestracji pracownika</h2>

        <form className="adding-topic-admin">
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
            type="email"
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
            control={<Checkbox checked={isActive} onChange={() => setIsActive(!isActive)} color="primary" />}
            label="Aktywny"
          />
          <br></br>

          <div className="messages">
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>

          <Button id="worker-accept-button" type="submit" onClick={handleWorkerSupervisor}>
            Zarejestruj pracownika
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
