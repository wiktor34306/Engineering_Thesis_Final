import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ConfirmWindowDeleteDepartmentSuperAdminStyle.css';
import config from '../../../config';

export const ConfirmWindowDeleteDepartmentSuperAdmin = ({ isOpen, handleClose, departmentId }) => {
  const navigate = useNavigate();

  const handleConfirmDeleteDepartment = () => {
    fetch(`${config.BASE_URL}/delete-department`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        id_wydzialu: departmentId
      })
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
        toast.error('Błąd przy usuwaniu wydziału.');
        return;
      }
    
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        handleClose();
        navigate('/viewallstructuresuperadmin'); 
      }
    })
    .catch(error => {
      console.error('Błąd przy usuwaniu wydziału: ', error);
      toast.error('Błąd przy usuwaniu wydziału.');
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box className="confirm-delete-department-modal-super-admin">
        <h2>Czy jesteś pewien?</h2>
        <h3>Katedry oraz kierunki przypisane do wydziału zostaną również usunięte.</h3>

        <div className="confirmation-buttons">
          <Button
            id="confirm-accept-button-super-admin"
            variant="contained"
            color="primary"
            onClick={handleConfirmDeleteDepartment}
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