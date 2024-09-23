import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CancelChoiceModalStudentStyle.css';

export const CancelChoiceModalStudent = ({ isOpen, handleClose, cancelReservation, topicName, supervisorInfo }) => {

  const handleCancelReservation = async () => {
  try {
    await cancelReservation();
    toast.success('Anulowałeś rezerwację tematu.'); 
    window.location.reload();
  } catch (error) {
    console.error('Błąd podczas anulowania rezerwacji tematu:', error);
    toast.error('Błąd podczas anulowania rezerwacji tematu.'); 
  }
};

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box className="cancel-choice-modal-student">
        <h2>Anulowanie rezerwacji</h2>
        <h2>Czy jesteś pewien?</h2>

        <div className="confirmation-buttons">
          <Button
            id="confirm-accept-button-student"
            variant="contained"
            color="primary"
            onClick={handleCancelReservation}
          >
            Tak
          </Button>

          <Button
            id="cancel-accept-button-student"
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