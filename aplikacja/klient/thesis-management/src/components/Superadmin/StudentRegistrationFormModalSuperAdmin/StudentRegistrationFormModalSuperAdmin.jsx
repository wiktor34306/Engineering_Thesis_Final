import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './StudentRegistrationFormModalSuperAdminStyle.css';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

export const StudentRegistrationFormModalSuperAdmin = ({ open, handleClose }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAdress, setEmailAdress] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [successMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [refreshPage, setRefreshPage] = useState(0);

  const handleRegisterStudent = async () => {
    if (isRegistering) return;

    try {
      setIsRegistering(true);

      if (!firstName || !lastName || !emailAdress || !studentId || !password || !selectedSubject) {
        toast.error('Nie uzupełniono wszystkich pól.');
        setIsRegistering(false);
        return;
      }
      
      if (!isValidEmail(emailAdress)) {
        toast.error("Niepoprawny format adresu e-mail");
        setIsRegistering(false);
        return;
      }

      const studentData = {
        imie: firstName,
        nazwisko: lastName,
        adres_email: emailAdress,
        numer_albumu: studentId,
        kierunek: selectedSubject,
        haslo: password,
        rola: 'student',
        aktywny: isActive,
      };

      const response = await fetch(`${config.BASE_URL}/student-registration`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === 'Student zarejestrowany pomyślnie.') {
          toast.success(data.message);
          setFirstName('');
          setLastName('');
          setEmailAdress('');
          setStudentId('');
          setPassword('');
          setIsActive(false);
          navigate('/viewalluserssuperadmin');
          setRefreshPage((prevKey) => prevKey + 1);
          handleClose();
        } else if (data.error) {
          toast.error(data.error);
        } else {
          console.error('Nieprawidłowa odpowiedź serwera.');
          toast.error('Błąd rejestracji studenta.');
        }
      } else {
        if (response.status === 400 && data.error) {
          setErrorMessage(data.error);
        } else {
        console.error('Błąd HTTP: ', response.status);
        toast.error('Błąd rejestracji studenta. Spróbuj ponownie.');
      }
    }
    } catch (error) {
      console.error('Błąd rejestracji: ', error);
      toast.error('Nie udało się zarejestrować studenta. Spróbuj ponownie.');
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    fetch(`${config.BASE_URL}/get-subjects`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data);
        setSelectedSubject(data.length > 0 ? data[0].id_kierunku : '');
      })
      .catch((error) => {
        console.error(error);
      });
  }, [refreshPage]);

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
      <Box className="student-registration-form-modal">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <h2>Formularz rejestracji studenta</h2>

        <form className="student-registration-super-admin">
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
            label="Numer albumu"
            variant="outlined"
            fullWidth
            margin="normal"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
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
          <label htmlFor="subject-select-super-admin">Kierunek:</label>
          <select
            className="subject-select-super-admin"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map((subject) => (
              <option key={subject.id_kierunku} value={subject.id_kierunku}>
                {subject.nazwa}
              </option>
            ))}
          </select>
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

          <div className="messages">
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>

          <Button
            id="student-accept-button"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleRegisterStudent();
            }}
          >
            Zarejestruj studenta
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
