import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import './AddingTopicFormModalSupervisorStyle.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import config from '../../../config';

export const AddingTopicFormModalSupervisor = ({ open, handleClose }) => {
  const [academicDepartments, setAcademicDepartments] = useState([]);
  const [selectedAcademicDepartment, setSelectedAcademicDepartment] = useState('');
  const [topicName, setTopicName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [, setSupervisorId] = useState(null);

  useEffect(() => {
    fetch(`${config.BASE_URL}/get-academic-departments`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAcademicDepartments(data);
        setSelectedAcademicDepartment('');
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAddTopic = () => {
    if (isAdding || !selectedAcademicDepartment || !topicName.trim()) {
      toast.error('Wszystkie pola muszą być wypełnione.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsAdding(true);

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const id_uzytkownika_dodajacego = decodedToken.id_uzytkownika;

    fetch(`${config.BASE_URL}/get-supervisor-id-by-user-id/${id_uzytkownika_dodajacego}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSupervisorId(data.id_promotora);

        const topicData = {
          id_katedry: selectedAcademicDepartment,
          id_promotora: data.id_promotora, 
          temat: topicName,
          status: true,
          id_uzytkownika_dodajacego: id_uzytkownika_dodajacego,
        };

        fetch(`${config.BASE_URL}/adding-topic`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify(topicData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            if (data && data.id_tematu) {
              toast.success(data.message);
              navigate('/viewalltopicssupervisor');
              handleClose();
            } else if (data && data.error) {
              toast.error(data.error);
            } else {
              console.error('Nieprawidłowa odpowiedź serwera.');
              toast.error('Błąd dodawania tematu');
            }

            setIsAdding(false);
          })
          .catch((error) => {
            console.error('Błąd podczas wysyłania żądania:', error);
            toast.error('Nie udało się dodać tematu. Spróbuj ponownie.');
            setIsAdding(false);
            handleClose();
          });
      })
      .catch((error) => {
        console.error('Błąd podczas pobierania id_promotora:', error);
        setIsAdding(false);
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="supervisor-modal-title"
      aria-describedby="supervisor-modal-description"
    >
      <Box className="adding-topic-form-modal">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <h2>Formularz dodawania tematu pracy dyplomowej</h2>

        <form className="adding-topic-supervisor">
          <label htmlFor="topic-select-supervisor">Katedra:</label>
          <select
            className="topic-select-supervisor"
            value={selectedAcademicDepartment}
            onChange={(e) => setSelectedAcademicDepartment(e.target.value)}
          >
            <option value="" disabled selected>
              Wybierz katedrę
            </option>
            {academicDepartments.map((academicDepartment) => (
              <option
                key={academicDepartment.id_katedry}
                value={academicDepartment.id_katedry}
              >
                {academicDepartment.nazwa}
              </option>
            ))}
          </select>

          <TextField
            label="Temat"
            variant="outlined"
            fullWidth
            margin="normal"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
          />

          <div className="messages">
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>

          <Button
            id="topic-accept-button-supervisor"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleAddTopic();
            }}
          >
            Dodaj temat
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
