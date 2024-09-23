import React, { useState, useEffect } from 'react';
import { RiArrowUpDoubleFill, RiArrowDownDoubleLine } from 'react-icons/ri';
import './ViewAllStructureAdminStyle.css';
import { SideNavbarAdmin } from '../SideNavbarAdmin/SideNavbarAdmin';
import { Footer } from '../../Footer/Footer';
import config from '../../../config';
import { useNavigate } from 'react-router-dom';
import { EditNameOfDepartmentAdmin } from '../EditNameOfDepartmentAdmin/EditNameOfDepartmentAdmin';
import { EditNameOfAcademicDepartmentAdmin } from '../EditNameOfAcademicDepartmentAdmin/EditNameOfAcademicDepartmentAdmin';
import { EditNameOfSubjectAdmin } from '../EditNameOfSubjectAdmin/EditNameOfSubjectAdmin';
import { ConfirmWindowDeleteDepartmentAdmin } from '../ConfirmWindowDeleteDepartmentAdmin/ConfirmWindowDeleteDepartmentAdmin';
import { ConfirmWindowDeleteAcademicDepartmentAdmin } from '../ConfirmWindowDeleteAcademicDepartmentAdmin/ConfirmWindowDeleteAcademicDepartmentAdmin';
import { ConfirmWindowDeleteSubjectAdmin } from '../ConfirmWindowDeleteSubjectAdmin/ConfirmWindowDeleteSubjectAdmin';

export const ViewAllStructureAdmin = () => {
  const [departments, setDepartments] = useState([]);
  const [academicDepartments, setAcademicDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    departments: false,
    academicDepartments: false,
    subjects: false,
  });
   const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false);
   const [selectedDepartment, setSelectedDepartment] = useState(null);
   const [isEditAcademicDepartmentModalOpen, setIsEditAcademicDepartmentModalOpen] = useState(false);
   const [selectedAcademicDepartment, setSelectedAcademicDepartment] = useState(null); 
   const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false);
   const [selectedSubject, setSelectedSubject] = useState(null);
   const [isDeleteDepartmentModalOpen, setIsDeleteDepartmentModalOpen] = useState(false);
   const [departmentToDelete, setDepartmentToDelete] = useState(null);
   const [isDeleteAcademicDepartmentModalOpen, setIsDeleteAcademicDepartmentModalOpen] = useState(false);
   const [academicDepartmentToDelete, setAcademicDepartmentToDelete] = useState(null);
   const [isDeleteSubjectModalOpen, setIsDeleteSubjectModalOpen] = useState(false);
   const [subjectToDelete, setSubjectToDelete] = useState(null);
   const navigate = useNavigate();


   useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get-departments`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Błąd autoryzacji: ', response.status);
            localStorage.removeItem('token');
            navigate('/'); 
            return;
          }
          throw Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Błąd przy pobieraniu wydziałów: ', error);
      }
    };
  
    const fetchAcademicDepartments = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get-academic-departments`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Błąd autoryzacji: ', response.status);
            localStorage.removeItem('token');
            navigate('/'); 
            return;
          }
          throw Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAcademicDepartments(data);
      } catch (error) {
        console.error('Błąd przy pobieraniu katedr: ', error);
      }
    };
  
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get-subjects`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Błąd autoryzacji: ', response.status);
            localStorage.removeItem('token');
            navigate('/');
            return;
          }
          throw Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error('Błąd przy pobieraniu kierunków studiów: ', error);
      }
    };
  
    fetchDepartments();
    fetchAcademicDepartments();
    fetchSubjects();
  }, []);

  const handleSectionToggle = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const openDeleteDepartmentModal = (departmentId) => {
    setDepartmentToDelete(departmentId);
    setIsDeleteDepartmentModalOpen(true);
  };

  const openDeleteAcademicDepartmentModal = (academicDepartmentId) => {
    setAcademicDepartmentToDelete(academicDepartmentId);
    setIsDeleteAcademicDepartmentModalOpen(true);
  };

  const openDeleteSubjectModal = (subjectId) => {
    setSubjectToDelete(subjectId);
    setIsDeleteSubjectModalOpen(true);
  };

  return (
    <>
      <div className="viewallstructure-admin-container">
        <div className="viewallstructure-admin-navbar">
          <SideNavbarAdmin />
        </div>

        <div className="viewallstructure-admin-element">
          <h1>Zobacz strukturę uczelni</h1>
          <ul className="div-with-list-of-viewallstructure">
            <li className="viewallstructure-admin-item">
              <strong>Wydział:</strong>
              <div onClick={() => handleSectionToggle('departments')} className="viewallstructure-expand-button">
                {expandedSections.departments ? <RiArrowUpDoubleFill /> : <RiArrowDownDoubleLine />}
              </div>
              {expandedSections.departments && (
                <ul>
                  {departments.map((department) => (
                    <li key={department.id_wydzialu}>
                      {department.nazwa}
                      <div className="viewallstructure-expand-button">
                      <button
                        type="submit"
                        className="viewallstructure-function-button viewallstructure-function-button-edit"
                        onClick={() => {
                          setSelectedDepartment(department);
                          setIsEditDepartmentModalOpen(true);
                        }}
                      >
                        Edytuj
                      </button>
                      <button
                      type="submit"
                      className="viewallstructure-function-button viewallstructure-function-button-delete"
                      onClick={() => openDeleteDepartmentModal(department.id_wydzialu)}
                    >
                      Usuń
                    </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="viewallstructure-admin-item">
              <strong>Katedra:</strong>
              <div onClick={() => handleSectionToggle('academicDepartments')} className="viewallstructure-expand-button">
                {expandedSections.academicDepartments ? <RiArrowUpDoubleFill /> : <RiArrowDownDoubleLine />}
              </div>
              {expandedSections.academicDepartments && (
                <ul>
                  {academicDepartments.map((academicDepartment) => (
                    <li key={academicDepartment.id_katedry}>
                      {academicDepartment.nazwa}
                      <div className="viewallstructure-expand-button">
                      <button
                        type="submit"
                        className="viewallstructure-function-button viewallstructure-function-button-edit"
                        onClick={() => {
                          setSelectedAcademicDepartment(academicDepartment);
                          setIsEditAcademicDepartmentModalOpen(true);
                        }}
                      >
                        Edytuj
                      </button>
                      <button
                        type="submit"
                        className="viewallstructure-function-button viewallstructure-function-button-delete"
                        onClick={() => openDeleteAcademicDepartmentModal(academicDepartment.id_katedry)}
                      >
                        Usuń
                      </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="viewallstructure-admin-item">
              <strong>Kierunek:</strong>
              <div onClick={() => handleSectionToggle('subjects')} className="viewallstructure-expand-button">
                {expandedSections.subjects ? <RiArrowUpDoubleFill /> : <RiArrowDownDoubleLine />}
              </div>
              {expandedSections.subjects && (
                <ul>
                  {subjects.map((subject) => (
                    <li key={subject.id_kierunku}>
                      {subject.nazwa}
                      <div className="viewallstructure-expand-button">
                      <button
                        type="submit"
                        className="viewallstructure-function-button viewallstructure-function-button-edit"
                        onClick={() => {
                          setSelectedSubject(subject);
                          setIsEditSubjectModalOpen(true);
                        }}
                      >
                        Edytuj
                      </button>
                        <button
                          type="submit"
                          className="viewallstructure-function-button viewallstructure-function-button-delete"
                          onClick={() => openDeleteSubjectModal(subject.id_kierunku)}
                        >
                          Usuń
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-viewallstructure-admin">
        <Footer />
      </div>

      <EditNameOfDepartmentAdmin
        open={isEditDepartmentModalOpen}
        handleClose={() => setIsEditDepartmentModalOpen(false)}
        selectedTopic={selectedDepartment}
      />

      <EditNameOfAcademicDepartmentAdmin
        open={isEditAcademicDepartmentModalOpen}
        handleClose={() => setIsEditAcademicDepartmentModalOpen(false)}
        selectedTopic={selectedAcademicDepartment}
      />

      <EditNameOfSubjectAdmin
        open={isEditSubjectModalOpen}
        handleClose={() => setIsEditSubjectModalOpen(false)}
        selectedTopic={selectedSubject}
      />

      <ConfirmWindowDeleteDepartmentAdmin
        isOpen={isDeleteDepartmentModalOpen}
        handleClose={() => setIsDeleteDepartmentModalOpen(false)}
        departmentId={departmentToDelete}
      />

      <ConfirmWindowDeleteAcademicDepartmentAdmin
        isOpen={isDeleteAcademicDepartmentModalOpen}
        handleClose={() => setIsDeleteAcademicDepartmentModalOpen(false)}
        academicDepartmentId={academicDepartmentToDelete}
      />

      <ConfirmWindowDeleteSubjectAdmin
        isOpen={isDeleteSubjectModalOpen}
        handleClose={() => setIsDeleteSubjectModalOpen(false)}
        subjectId={subjectToDelete}
      />
    </>
  );
};

