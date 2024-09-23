import React, { useEffect, useState } from 'react';
import './StartWindowStudentStyle.css';
import { Footer } from '../../Footer/Footer';
import { getName } from '../../../getName';
import { SideNavbarStudent } from '../SideNavbarStudent/SideNavbarStudent';
import config from '../../../config';
import { getUserId } from '../../../getUserId';
import { useNavigate } from 'react-router-dom';

export const StartWindowStudent = () => {
  const [studyInfo, setStudyInfo] = useState({ kierunek: '', katedra: '' });
  const navigate = useNavigate();

  const fetchUserStudyInfo = async () => {
    try {
      const id_uzytkownika = getUserId();
      const response = await fetch(`${config.BASE_URL}/get-department-and-academic-department-by-student-id/${id_uzytkownika}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
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
      setStudyInfo(data);
    } catch (error) {
      console.error('Błąd przy pobieraniu informacji o studiach użytkownika: ', error);
    }
  };

  useEffect(() => {
    fetchUserStudyInfo(); 
  }, []);

  return (
    <>
      <div className="start-window-student-container">
        <div className="start-window-student-navbar">
          <SideNavbarStudent />
        </div>

        <div className="start-window-student-element">
          <h1>Witaj, {getName()}.</h1>

          <h2>
            Twoja rola to student.
            </h2>

            <h2>
            <div className="div-with-tiles-student">
              <div className="sw-tile-student sw-color1-student">
                Jesteś studentem kierunku
                <div className="sw-amount-student">{studyInfo.kierunek}</div>
              </div>
              <div className="sw-tile-student sw-color2-student">
                Na katedrze
                <div className="sw-amount-student">{studyInfo.katedra}</div>
              </div>
            </div>
            </h2>
        </div>
      </div>
      <div className="footer-start-window-student">
        <Footer />
      </div>
    </>
  );
};
