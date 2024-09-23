import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import './AddingSubjectFormModalAdminStyle.css';
import config from '../../../config';

export const AddingSubjectFormModalAdmin = ({ open, handleClose }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedAcademicDepartment, setSelectedAcademicDepartment] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const [academicDepartments, setAcademicDepartments] = useState([]);
  const [, setSubjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    fetch(`${config.BASE_URL}/get-departments`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
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
      setDepartments(data);
      setSelectedDepartment('');
    })
    .catch(error => {
      console.error(error);
    });

    fetch(`${config.BASE_URL}/get-academic-departments`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
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
      setAcademicDepartments(data);
      setSelectedAcademicDepartment('');
    })
    .catch(error => {
      console.error(error);
    });

    fetch(`${config.BASE_URL}/get-subjects`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
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
      setSubjects(data);
    })
    .catch(error => {
      console.error(error);
    });
  }, []);

  const handleAddSubject = () => {
    if (isAdding || !selectedDepartment || !selectedAcademicDepartment || !subjectName.trim()) {
      toast.error('Wszystkie pola muszą być wypełnione.');
      return;
    }

    if (isAdding) return;

    setErrorMessage('');
    setSuccessMessage('');
    setIsAdding(true);
    
    const normalizedSubjectName = subjectName.toLowerCase();
    
    const subjectData = {
      nazwaKierunku: normalizedSubjectName,
      idWydzialu: selectedDepartment,
      idKatedry: selectedAcademicDepartment,
    };
    
    fetch(`${config.BASE_URL}/subject-registration`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(subjectData),
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Błąd autoryzacji: ', response.status);
          localStorage.removeItem('token');
          navigate('/');
          setIsAdding(false);
          handleClose();
          return;
        }
        throw Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.message === 'Kierunek studiów zarejestrowany pomyślnie.') {
        toast.success(data.message);
        navigate('/viewallstructureadmin');
        handleClose();
      } else if (data && data.error) {
        toast.error(data.error); 
      } else {
        console.error('Nieprawidłowa odpowiedź serwera.');
        toast.error("Błąd rejestracji kierunku studiów");
      }
      
      setIsAdding(false);
    })
    .catch(error => {
      console.error('Błąd rejestracji: ', error);
      toast.error('Nie udało się dodać kierunku studiów. Spróbuj ponownie.');
      setIsAdding(false);
      handleClose(); 
    });
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="admin-modal-title"
      aria-describedby="admin-modal-description"
    >
      <Box className="subject-form-modal">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <h2>Formularz dodawania kierunku do katedry i wydziału</h2>

        <form className="academic-department-admin">
          <label htmlFor="subject-select-admin">Wydział:</label>

          <select
            className="subject-select-admin"
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

          <label htmlFor="subject-select-admin">Katedra:</label>

          <select
            className="subject-select-admin"
            value={selectedAcademicDepartment}
            onChange={(e) => setSelectedAcademicDepartment(e.target.value)}
          >
            <option value="" disabled selected>
            Wybierz katedrę
          </option>
            {academicDepartments.map((academicDepartment) => (
              <option
                key={academicDepartment.id_katedry}
                value={academicDepartment.id_katedry}
              >
                {academicDepartment.nazwa}
              </option>
            ))}
          </select>

          <label htmlFor="subject-name-admin">Nazwa kierunku studiów:</label>
          <TextField
            id="subject-name-admin"
            label="Nazwa kierunku"
            variant="outlined"
            fullWidth
            margin="normal"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />

          <div className="messages">
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>

          <Button
            id="subject-accept-button-admin"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleAddSubject();
            }}
          >
            Dodaj kierunek
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
