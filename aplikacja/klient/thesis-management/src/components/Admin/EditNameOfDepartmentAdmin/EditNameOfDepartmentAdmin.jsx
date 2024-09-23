import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import './EditNameOfDepartmentAdminStyle.css';
import { toast } from 'react-toastify';
import config from '../../../config';
import { useNavigate } from 'react-router-dom';

export const EditNameOfDepartmentAdmin = ({ open, handleClose, selectedTopic }) => {
  const [departmentName, setDepartmentName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTopic) {
      setDepartmentName(selectedTopic.nazwa);
    }
  }, [selectedTopic]);

  const handleUpdateDepartmentName = () => {
    fetch(`${config.BASE_URL}/update-department-name`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        id_wydzialu: selectedTopic.id_wydzialu,
        new_nazwa: departmentName
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
      console.error('Błąd przy aktualizacji nazwy wydziału:', error);
      toast.error('Błąd przy aktualizacji nazwy wydziału.');
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

        <h2>Formularz zmiany nazwy wydziału</h2>

        <form className="edit-topic-name-admin">
          <TextField
            label="Nowa nazwa wydziału"
            variant="outlined"
            fullWidth
            margin="normal"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />

          <Button
            id="topic-accept-button-admin"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleUpdateDepartmentName();
            }}
          >
            Aktualizuj nazwę wydziału
          </Button>
        </form>
      </Box>
    </Modal>
  );
};