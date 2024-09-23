import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ConfirmWindowDeleteSubjectAdminStyle.css';
import config from '../../../config';

export const ConfirmWindowDeleteSubjectAdmin = ({ isOpen, handleClose, subjectId }) => {
    const navigate = useNavigate();
  
    const handleConfirmDeleteSubject = () => {
      fetch(`${config.BASE_URL}/delete-subject`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id_kierunku: subjectId
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
          navigate('/viewallstructureadmin'); 
        }
      })
      .catch(error => {
        console.error('Błąd przy usuwaniu kierunku studiów: ', error);
        toast.error('Błąd przy usuwaniu kierunku studiów.');
      });
    };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box className="confirm-delete-subject-modal-admin">
        <h2>Czy jesteś pewien?</h2>
        <h3>Studenci przypisani do kierunku zostaną również usunięci.</h3>

        <div className="confirmation-buttons">
          <Button
            id="confirm-accept-button-admin"
            variant="contained"
            color="primary"
            onClick={handleConfirmDeleteSubject}
          >
            Tak
          </Button>

          <Button
            id="confirm-accept-button-admin"
            variant="outlined"
            color="secondary"
            onClick={handleClose}
          >
            Anuluj
          </Button>
        </div>
      </Box>
    </Modal>
  );
};