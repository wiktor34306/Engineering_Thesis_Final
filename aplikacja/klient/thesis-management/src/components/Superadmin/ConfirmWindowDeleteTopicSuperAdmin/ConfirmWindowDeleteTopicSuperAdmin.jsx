import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ConfirmWindowDeleteTopicSuperAdminStyle.css';
import config from '../../../config';

export const ConfirmWindowDeleteTopicSuperAdmin = ({ isOpen, handleClose, topicId }) => {
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
    .then(async (response) => {
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 401) { 
          console.error('Błąd autoryzacji: ', response.status);
          localStorage.removeItem('token'); 
          navigate('/'); 
          return;
        }
        console.error('Błąd HTTP: ', response.status);
        toast.error('Błąd przy usuwaniu tematu.');
        return;
      }
  
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        handleClose();
        navigate('/viewalltopicssuperadmin'); 
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
      <Box className="confirm-delete-topic-modal-super-admin">
        <h2>Czy jesteś pewien?</h2>
        <h3>W ten sposób możesz usunąć temat, który jest zarezerwowany.</h3>

        <div className="confirmation-buttons">
          <Button
            id="confirm-accept-button-super-admin"
            variant="contained"
            color="primary"
            onClick={handleConfirmDeleteTopic}
          >
            Tak
          </Button>

          <Button
            id="confirm-accept-button-super-admin"
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