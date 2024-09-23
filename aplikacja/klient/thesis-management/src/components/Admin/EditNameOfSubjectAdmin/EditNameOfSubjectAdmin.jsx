import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import './EditNameOfSubjectAdminStyle.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from '../../../config';

export const EditNameOfSubjectAdmin = ({ open, handleClose, selectedTopic }) => {
  const [subjectName, setSubjectName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTopic) {
      setSubjectName(selectedTopic.nazwa);
    }
  }, [selectedTopic]);

  const handleUpdateSubjectName = () => {
    fetch(`${config.BASE_URL}/update-subject-name`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        id_kierunku: selectedTopic.id_kierunku,
        new_nazwa: subjectName
      })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Błąd autoryzacji: ', response.status);
          localStorage.removeItem('token');
          navigate('/'); 
          return;
        }
        throw Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        handleClose();
        window.location.reload();
      }
    })
    .catch(error => {
      console.error('Błąd przy aktualizacji nazwy kierunku studiów:', error);
      toast.error('Błąd przy aktualizacji nazwy kierunku studiów.');
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="admin-modal-title"
      aria-describedby="admin-modal-description"
    >
      <Box className="edit-subject-name-form-modal">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <h2>Formularz zmiany nazwy kierunku studiów</h2>

        <form className="edit-subject-name-admin">
          <TextField
            label="Nowa nazwa kierunku"
            variant="outlined"
            fullWidth
            margin="normal"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />

          <Button
            id="subject-name-accept-button-admin"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleUpdateSubjectName();
            }}
          >
            Aktualizuj nazwę kierunku
          </Button>
        </form>
      </Box>
    </Modal>
  );
};