import React, {useState, useEffect} from 'react';
import './SettingsStudentStyle.css';
import {Footer} from '../../Footer/Footer';
import packageJson from '../../../../package.json';
import config from '../../../config';
import { getUserId } from '../../../getUserId';
import { SideNavbarStudent } from '../SideNavbarStudent/SideNavbarStudent';
import { useNavigate } from 'react-router-dom';

export const SettingsStudent = () => {
  const [view, setView] = useState('O aplikacji');
  const [userData, setUserData] = useState({});
  const appVersion = packageJson.version;
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getUserId();
  
    fetch(`${config.BASE_URL}/get-user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
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
    .then(data => setUserData(data))
    .catch(error => console.error('Błąd przy pobieraniu danych użytkownika: ', error));
  }, []);

  const renderUserInfoTile = () => {
    return (
      <div className="div-to-center-table-settings-student">
      <div className={`sw-tile-settings-student ${userData.rola === 'student' ? 'sw-color4-student' : ''}`}>
        <table className="user-info-table settings-student-table">
        <tbody>
            <tr>
              <td className="settings-student-cell settings-student-cell-label">Numer albumu:</td>
              <td className="settings-student-cell settings-student-cell-value">{userData.numer_albumu}</td>
            </tr>
            <tr>
              <td className="settings-student-cell settings-student-cell-label">Imię:</td>
              <td className="settings-student-cell settings-student-cell-value">{userData.imie}</td>
            </tr>
            <tr>
              <td className="settings-student-cell settings-student-cell-label">Nazwisko:</td>
              <td className="settings-student-cell settings-student-cell-value">{userData.nazwisko}</td>
            </tr>
            <tr>
              <td className="settings-student-cell settings-student-cell-label">Adres e-mail:</td>
              <td className="settings-student-cell settings-student-cell-value">{userData.adres_email}</td>
            </tr>
            <tr>
              <td className="settings-student-cell settings-student-cell-label">Rola:</td>
              <td className="settings-student-cell settings-student-cell-value">{userData.rola}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    );
  };

  return (
    <>
      <div className="settings-student-container">
        <div className="settings-student-navbar">
          <SideNavbarStudent />
        </div>
        <div className="container-student-element">
          <div className="div-with-buttons-settings-student">
            <button className="button-in-settings-student" onClick={() => setView('O aplikacji')}>O aplikacji</button>
            <button className="button-in-settings-student" onClick={() => setView('O użytkowniku')}>O użytkowniku</button>
          </div>

          <div className="settings-student-element">
            {view === 'O aplikacji' && (
              <>
                <h1>O aplikacji</h1>
                <p>Wersja aplikacji: {appVersion}</p>
              </>
            )}
            {view === 'O użytkowniku' && (
              <>
                <h1>O użytkowniku</h1>
                {renderUserInfoTile()}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="footer-settings-student">
        <Footer />
      </div>
    </>
  );
};