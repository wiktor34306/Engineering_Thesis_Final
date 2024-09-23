import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ConfirmWindowDeleteTopicSupervisorStyle.css';
import config from '../../../config';

export const ConfirmWindowDeleteTopicSupervisor = ({ isOpen, handleClose, topicId }) => {
  const navigate = useNavigate();

  const handleConfirmDeleteTopic = () => {
    fetch(`${config.BASE_URL}/delete-topic/${topicId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.message);
          handleClose();
          navigate('/viewalltopicssupervisor'); 
        }
      })
      .catch(error => {
        console.error('Błąd przy usuwaniu tematu: ', error);
        toast.error('Błąd przy usuwaniu tematu.');
      });
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box className="confirm-delete-topic-modal-supervisor">
        <h2>Czy jesteś pewien?</h2>
        <h3>W ten sposób możesz usunąć temat, który jest zarezerwowany.</h3>

        <div className="confirmation-buttons">
          <Button
            id="confirm-accept-button-supervisor"
            variant="contained"
            color="primary"
            onClick={handleConfirmDeleteTopic}
          >
            Tak
          </Button>

          <Button
            id="confirm-accept-button-supervisor"
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