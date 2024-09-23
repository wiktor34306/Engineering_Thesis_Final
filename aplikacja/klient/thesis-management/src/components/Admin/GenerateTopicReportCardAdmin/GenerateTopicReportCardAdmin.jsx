import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './GenerateTopicReportCardAdminStyle.css';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import { getUserId } from '../../../getUserId';

export const GenerateTopicReportCardAdmin = ({ open, handleClose }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [presentDate, setPresentDate] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [submitter, setSubmitter] = useState('');
  const [topic, setTopic] = useState('');
  const [describeTopic, setDescribeTopic] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [amountOfStudents, setAmountOfStudents] = useState('');
  const [expectedCosts, setExpectedCosts] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [successMessage] = useState('');
  const [errorMessage] = useState("");
  const navigate = useNavigate();
  const [refreshPage] = useState(0);
  const [academicDepartments, setAcademicDepartments] = useState([]);
  const [selectedAcademicDepartment, setSelectedAcademicDepartment] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  const prepareDataForPDF = () => {
    const id_uzytkownika = getUserId();
    return {
      id_uzytkownika: id_uzytkownika,
      presentDate: presentDate,
      selectedDepartment: selectedDepartment ? selectedDepartment.nazwa : '',
      academicYear: academicYear,
      submitter: submitter,
      selectedAcademicDepartment: selectedAcademicDepartment ? selectedAcademicDepartment.nazwa : '',
      additionalInformation: additionalInformation,
      topic: topic,
      describeTopic: describeTopic,
      amountOfStudents: amountOfStudents,
      selectedSubject: selectedSubject ? selectedSubject.nazwa : '',
      expectedCosts: expectedCosts,
    };
  };
  
  const handleGeneratePDFFile = async () => {
    try {
      const dataForPDF = prepareDataForPDF();
  
      const generatePDFResponse = await fetch(`${config.BASE_URL}/create-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ data: dataForPDF }),
      });
  
      if (!generatePDFResponse.ok) {
        console.error('Błąd generowania PDF:', generatePDFResponse.statusText);
        toast.error('Błąd generowania PDF');
        return;
      }
  
      toast.success('Plik PDF został wygenerowany');
      navigate('/documentsadmin');
  
    } catch (error) {
      console.error('Błąd generowania PDF:', error);
      toast.error('Błąd generowania PDF');
    }
  };
  
  useEffect(() => {
    fetch(`${config.BASE_URL}/get-subjects`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data);
        setSelectedSubject(data.length > 0 ? data[0] : null);
      })
      .catch((error) => {
        console.error(error);
      });

      fetch(`${config.BASE_URL}/get-departments`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setDepartments(data);
          setSelectedDepartment(data.length > 0 ? data[0] : null);
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
      .then((response) => response.json())
      .then((data) => {
        setAcademicDepartments(data);
        setSelectedAcademicDepartment(data.length > 0 ? data[0] : null);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [refreshPage]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="admin-modal-title"
      aria-describedby="admin-modal-description"
    >
      <Box className="student-registration-form-modal">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <h2>Formularz generujący kartę zgłoszenia tematu</h2>

        <form className="student-registration-admin">

          <TextField
            label="Data"
            variant="outlined"
            fullWidth
            margin="normal"
            type="date"
            value={presentDate}
            onChange={(e) => setPresentDate(e.target.value)}
          />

          <TextField
            label="Rok akademicki"
            variant="outlined"
            fullWidth
            margin="normal"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
          />

            <label htmlFor="academic-department-select-admin">Wydział:</label>
            <select
              className="academic-department-select-admin"
              value={selectedDepartment ? selectedDepartment.nazwa : ''}
              onChange={(e) => setSelectedDepartment(departments.find(department => department.nazwa === e.target.value))}
            >
              {departments.map((department) => (
                <option
                  key={department.id_wydzialu}
                  value={department.nazwa}
                >
                  {department.nazwa}
                </option>
              ))}
            </select>

          <TextField
            label="Zgłaszający (stopień naukowy, imię, nazwisko)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={submitter}
            onChange={(e) => setSubmitter(e.target.value)}
          />

          <label htmlFor="academic-department-select-admin">Katedra:</label>
          <select
            className="academic-department-select-admin"
            value={selectedAcademicDepartment ? selectedAcademicDepartment.nazwa : ''}
            onChange={(e) => setSelectedAcademicDepartment(academicDepartments.find(department => department.nazwa === e.target.value))}
          >
            {academicDepartments.map((department) => (
              <option 
                key={department.id_katedry} 
                value={department.nazwa}
                >
                {department.nazwa}
              </option>
            ))}
          </select>

          <TextField
            label="Temat"
            variant="outlined"
            fullWidth
            margin="normal"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <TextareaAutosize
            className="textarea-properties-generate-admin"
            minRows={5}
            placeholder="Opis tematu (zakres pracy)"
            style={{ width: '100%' }}
            value={describeTopic}
            onChange={(e) => setDescribeTopic(e.target.value)}
          />

          <TextareaAutosize
            className="textarea-properties-generate-admin"
            minRows={5}
            placeholder="Informacje dodatkowe (np. literatura)"
            style={{ width: '100%' }}
            value={additionalInformation}
            onChange={(e) => setAdditionalInformation(e.target.value)}
          />

          <TextField
            label="Temat proponowany jest dla ... studenta/studentów"
            variant="outlined"
            fullWidth
            margin="normal"
            value={amountOfStudents}
            onChange={(e) => setAmountOfStudents(e.target.value)}
          />

          <label htmlFor="subject-select-admin">Kierunek:</label>
          <select
            className="subject-select-admin"
            value={selectedSubject ? selectedSubject.nazwa : ''}
            onChange={(e) => setSelectedSubject(subjects.find(subject => subject.nazwa === e.target.value))}
          >
            {subjects.map((subject) => (
              <option key={subject.id_kierunku} value={subject.nazwa}>
                {subject.nazwa}
              </option>
            ))}
          </select>

          <TextField
            label="Przewidywane koszty"
            variant="outlined"
            fullWidth
            margin="normal"
            value={expectedCosts}
            onChange={(e) => setExpectedCosts(e.target.value)}
          />

          <br />

          <div className="messages">
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>

          <Button
            id="student-accept-button"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleGeneratePDFFile();
            }}
          >
            Generuj kartę zgłoszenia
          </Button>
        </form>
      </Box>
    </Modal>
  );
};