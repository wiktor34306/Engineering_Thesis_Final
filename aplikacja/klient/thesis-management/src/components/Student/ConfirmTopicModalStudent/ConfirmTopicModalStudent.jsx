import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ConfirmTopicModalStudentStyle.css';

export const ConfirmTopicModalStudent = ({ isOpen, handleClose, confirmReservation, topicName, supervisorInfo }) => {
  const navigate = useNavigate();

  const handleReservation = async () => {
    try {
      await confirmReservation();
      toast.success('Zarezerwowałeś temat.'); 
      navigate('/viewalltopicsstudent');
    } catch (error) {
      toast.error('Błąd podczas rezerwacji tematu. Spróbuj ponownie.'); 
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box className="confirm-topic-modal-student">
        <h2>Czy jesteś pewien?</h2>

        <div className="confirmation-buttons">
          <Button
            id="confirm-accept-button-student"
            variant="contained"
            color="primary"
            onClick={handleReservation}
          >
            Tak
          </Button>

          <Button
            id="confirm-accept-button-student"
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