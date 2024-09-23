import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddingDepartmentFormModalAdminStyle.css';
import config from '../../../config';

export const AddingDepartmentFormModalAdmin = ({ open, handleClose }) => {
  const [nazwa, setNazwa] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [existingDepartmentsLowerCase, setExistingDepartmentsLowerCase] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${config.BASE_URL}/get-departments`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/');
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const departmentsLowerCase = data.map((department) => department.nazwa.toLowerCase());
        setExistingDepartmentsLowerCase(departmentsLowerCase);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleRegister = () => {
    if (isAdding) return;

    const nameLowerCase = nazwa.toLowerCase();
    const isDepartmentExisting = existingDepartmentsLowerCase.includes(nameLowerCase);

    if (isDepartmentExisting) {
      toast.error('Wydział o podanej nazwie już istnieje.');
      setIsAdding(false);
      return;
    }

    const registrationData = {
      nazwa: nameLowerCase,
    };
    
    fetch(`${config.BASE_URL}/department-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(registrationData)
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Błąd autoryzacji: ', response.status);
          toast.error('Nie udało się dodać wydziału. Spróbuj ponownie.');
          setIsAdding(false);
          localStorage.removeItem('token');
          navigate('/');
          throw Error(response.statusText);
        } else {
          throw Error(response.statusText);
        }
      }
      return response.json();
    })
    .then(data => {
      if (data && data.message === 'Wydział zarejestrowany pomyślnie.') {
        toast.success(data.message);
        navigate('/viewallstructureadmin'); 
      } else if (data && data.error) {
        toast.error(data.error);
      } else {
        console.error('Nieprawidłowa odpowiedź serwera.');
        toast.error('Wydział o takiej nazwie już istnieje w systemie');
      }
      setIsAdding(false);
      handleClose();
    })
    .catch(error => {
      console.error('Błąd rejestracji: ', error);
      toast.error('Nie udało się dodać wydziału. Spróbuj ponownie.');
      setIsAdding(false);
    });
  };

  return (
    <Modal
      open={open}
      aria-labelledby="admin-modal-title"
      aria-describedby="admin-modal-description"
    >
      <div className="adding-department-form-modal">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <h2>Formularz dodawania wydziału</h2>

        <form className="adding-department-form">
          <TextField
            label="Nazwa wydziału"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nazwa}
            onChange={(e) => setNazwa(e.target.value)}
          />

          <button
            id="department-accept-button-admin"
            onClick={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            Dodaj wydział
          </button>
        </form>
      </div>
    </Modal>
  );
};
