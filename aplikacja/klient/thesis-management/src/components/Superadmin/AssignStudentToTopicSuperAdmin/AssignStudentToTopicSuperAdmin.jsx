import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './AssignStudentToTopicSuperAdminStyle.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

export const AssignStudentToTopicSuperAdmin = ({ open, handleClose }) => {
  const [students, setStudents] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    fetch(`${config.BASE_URL}/lists-of-students`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(response => response.json())
      .then(data => setStudents(data.students))
      .catch(error => console.error('Błąd przy pobieraniu listy studentów:', error));
  
      fetch(`${config.BASE_URL}/get-topics`, {
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
      .then(data => setTopics(data))
      .catch(error => console.error('Błąd przy pobieraniu listy tematów:', error));
  }, []);

  const handleAssignTopic = () => {
    if (!selectedStudent || !selectedTopic) {
      toast.error('Wszystkie pola muszą być wypełnione.');
      return;
    }
  
    const data = {
      id_uzytkownika: selectedStudent,
      id_tematu: selectedTopic
    };
  
    fetch(`${config.BASE_URL}/reserve-topic-by-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.message);
          handleClose(); 
        }
      })
      .catch(error => {
        console.error('Błąd przy przypisywaniu tematu:', error);
        toast.error('Błąd przy przypisywaniu tematu.');
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="admin-modal-title"
      aria-describedby="admin-modal-description"
    >
      <Box className="assign-topic-form-modal">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <h2>Formularz przypisania studentowi tematu</h2>

        <form className="assign-topic-form">
          <select
            className="assign-topic-select-super-admin"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="" disabled selected>
              Wybierz studenta
            </option>
            {students.map(student => (
              <option key={student.id_uzytkownika} value={student.id_uzytkownika}>
                {student.imie} {student.nazwisko}
              </option>
            ))}
          </select>

          <select
            className="assign-topic-select-super-admin"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="" disabled selected>
              Wybierz temat
            </option>
            {topics.map(topic => (
              <option key={topic.id_tematu} value={topic.id_tematu}>
                {topic.temat}
              </option>
            ))}
          </select>

          <Button
            id="assign-topic-accept-button-admin"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleAssignTopic();
            }}
          >
            Przypisz temat
          </Button>
        </form>
      </Box>
    </Modal>
  );
};