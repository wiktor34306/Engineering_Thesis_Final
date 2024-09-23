import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import './EditTopicNameSuperadminStyle.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import config from '../../../config';

export const EditTopicNameSuperadmin = ({ open, handleClose, selectedTopic }) => {
  const [topicName, setTopicName] = useState('');
  const [, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [existingTopicNames, ] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTopic) {
      setTopicName(selectedTopic.temat);
    }
  }, [selectedTopic]);

  const handleUpdateTopic = () => {
    if (!selectedTopic || !topicName.trim()) {
      toast.error('Wszystkie pola muszą być wypełnione.');
      return;
    }
  
    const formattedTopicName = topicName.trim().toLowerCase();
    if (existingTopicNames.includes(formattedTopicName)) {
      toast.error('Temat o podanej nazwie już istnieje.');
      return;
    }
  
    setErrorMessage('');
    setSuccessMessage('');
    setIsAdding(true);
  
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const id_uzytkownika_aktualizujacego = decodedToken.id_uzytkownika;
  
    const updatedTopicData = {
      id_tematu: selectedTopic.id_tematu,
      nowy_temat: topicName,
      id_uzytkownika_aktualizujacego: id_uzytkownika_aktualizujacego
    };
  
    fetch(`${config.BASE_URL}/update-topic`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer "+ localStorage.getItem("token")
      },
      body: JSON.stringify(updatedTopicData),
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
        throw new Error('Network response was not ok');
      }
    
      if (data && data.message) {
        toast.success(data.message);
        navigate('/viewalltopicssuperadmin');
        handleClose();
      } else if (data && data.error) {
        toast.error(data.error);
      } else {
        console.error('Nieprawidłowa odpowiedź serwera.');
        toast.error("Błąd aktualizacji tematu");
      }
    
      setIsAdding(false);
    })
    .catch((error) => {
      console.error('Błąd podczas wysyłania żądania:', error);
      toast.error('Nie udało się zaktualizować tematu. Spróbuj ponownie.');
      setIsAdding(false);
      handleClose();
    });
    
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="admin-modal-title"
      aria-describedby="admin-modal-description"
    >
      <Box className="edit-topic-name-form-modal">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <h2>Formularz zmiany nazwy tematu pracy dyplomowej</h2>

        <form className="edit-topic-name-admin">
          <TextField
            label="Zaktualizowany temat"
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
            id="topic-accept-button-admin"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleUpdateTopic();
            }}
          >
            Aktualizuj nazwę
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
