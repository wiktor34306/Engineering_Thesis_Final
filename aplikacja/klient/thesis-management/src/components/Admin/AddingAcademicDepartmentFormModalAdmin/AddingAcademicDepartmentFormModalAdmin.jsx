import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import './AddingAcademicDepartmentFormModalAdminStyle.css';
import config from '../../../config';

export const AddingAcademicDepartmentFormModalAdmin = ({ open, handleClose }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [academicDepartmentName, setAcademicDepartmentName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [existingAcademicDepartmentsLowerCase, setExistingAcademicDepartmentsLowerCase] = useState([]);
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
        setDepartments(data);
        setSelectedDepartment('');
      })
      .catch((error) => {
        console.log("Błąd", error);
      });

    fetch(`${config.BASE_URL}/get-academic-departments`, {
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
        const academicDepartmentsLowerCase = data.map((academicDepartment) =>
          academicDepartment.nazwaKatedry.toLowerCase()
        );
        setExistingAcademicDepartmentsLowerCase(academicDepartmentsLowerCase);
      })
      .catch((error) => {
        console.error(error);
      });
      }, []);

  const handleAddAcademicDepartment = () => {
    if (isAdding || !selectedDepartment || !academicDepartmentName.trim()) {
      toast.error('Wszystkie pola muszą być wypełnione.');
      return;
    }

    if (isAdding) return;

    setErrorMessage('');
    setSuccessMessage('');
    setIsAdding(true);

    const academicDepartmentNameLowerCase = academicDepartmentName.toLowerCase();

    const isAcademicDepartmentExisting = existingAcademicDepartmentsLowerCase.includes(
      academicDepartmentNameLowerCase
    );

    if (isAcademicDepartmentExisting) {
      setErrorMessage("Katedra o podanej nazwie już istnieje.");
      setIsAdding(false);
      return;
    }

    const academicDepartmentData = {
      nazwaKatedry: academicDepartmentNameLowerCase,
      idWydzialu: selectedDepartment,
    };

  fetch(`${config.BASE_URL}/academic-department-registration`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(academicDepartmentData),
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

      if (data && data.message === 'Katedra zarejestrowana pomyślnie.') {
        toast.success(data.message);
        navigate('/viewallstructureadmin');
        handleClose();
      } else if (data && data.error) {
        toast.error(data.error);
      } else {
        console.error('Nieprawidłowa odpowiedź serwera.');
        toast.error('Błąd rejestracji katedry.');
      }
      setIsAdding(false);
    })
    .catch((error) => {
      console.error('Błąd rejestracji: ', error);
      toast.error('Nie udało się dodać katedry. Spróbuj ponownie.');
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
      <Box className="academic-department-form-modal">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <h2>Formularz dodawania katedry do wydziału</h2>

        <form className="academic-department-admin">
          <label htmlFor="academic-department-select-admin">Wydział:</label>

          <select
            className="academic-department-select-admin"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="" disabled selected>
              Wybierz wydział
            </option>
            {departments.map((department) => (
              <option
                key={department.id_wydzialu}
                value={department.id_wydzialu}
              >
                {department.nazwa}
              </option>
            ))}
          </select>

          <TextField
            label="Nazwa katedry"
            variant="outlined"
            fullWidth
            margin="normal"
            value={academicDepartmentName}
            onChange={(e) => setAcademicDepartmentName(e.target.value)}
          />

          <div className="messages">
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>

          <Button
            id="academic-department-accept-button-admin"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleAddAcademicDepartment();
            }}
          >
            Dodaj katedrę
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
