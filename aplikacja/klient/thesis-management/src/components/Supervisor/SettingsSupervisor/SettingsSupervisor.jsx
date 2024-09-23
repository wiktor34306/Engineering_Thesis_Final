import React, { useState, useEffect } from 'react';
import './SettingsSupervisorStyle.css';
import { Footer } from '../../Footer/Footer';
import { SideNavbarSupervisor } from '../SideNavbarSupervisor/SideNavbarSupervisor';
import packageJson from '../../../../package.json';
import config from '../../../config';
import { getUserId } from '../../../getUserId';
import { useNavigate } from 'react-router-dom';

export const SettingsSupervisor = () => {
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
    .then((response) => {
      if (response.status === 401) {
        console.error('Błąd autoryzacji: ', response.status);
        localStorage.removeItem('token');
        navigate('/');
        return;
      }
      return response.json();
    })
    .then((data) => setUserData(data))
    .catch((error) => console.error('Błąd przy pobieraniu danych użytkownika: ', error));
  }, []);

  const renderUserInfoTile = () => {
    return (
      <div className="div-to-center-table-settings-supervisor">
      <div className={`sw-tile-settings-supervisor ${userData.rola === 'promotor' ? 'sw-color4-supervisor' : ''}`}>
        <table className="user-info-table settings-supervisor-table">
        <tbody>
            <tr>
              <td className="settings-supervisor-cell settings-supervisor-cell-label">Stopień naukowy:</td>
              <td className="settings-supervisor-cell settings-supervisor-cell-value">{userData.stopien_naukowy}</td>
            </tr>
            <tr>
              <td className="settings-supervisor-cell settings-supervisor-cell-label">Imię:</td>
              <td className="settings-supervisor-cell settings-supervisor-cell-value">{userData.imie}</td>
            </tr>
            <tr>
              <td className="settings-supervisor-cell settings-supervisor-cell-label">Nazwisko:</td>
              <td className="settings-supervisor-cell settings-supervisor-cell-value">{userData.nazwisko}</td>
            </tr>
            <tr>
              <td className="settings-supervisor-cell settings-supervisor-cell-label">Adres e-mail:</td>
              <td className="settings-supervisor-cell settings-supervisor-cell-value">{userData.adres_email}</td>
            </tr>
            <tr>
              <td className="settings-supervisor-cell settings-supervisor-cell-label">Rola:</td>
              <td className="settings-supervisor-cell settings-supervisor-cell-value">{userData.rola}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    );
  };

  return (
    <>
      <div className="settings-supervisor-container">
        <div className="settings-supervisor-navbar">
          <SideNavbarSupervisor />
        </div>
        <div className="container-supervisor-element">
          <div className="div-with-buttons-settings-supervisor">
            <button className="button-in-settings-supervisor" onClick={() => setView('O aplikacji')}>O aplikacji</button>
            <button className="button-in-settings-supervisor" onClick={() => setView('O użytkowniku')}>O użytkowniku</button>
          </div>

          <div className="settings-supervisor-element">
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

      <div className="footer-settings-supervisor">
        <Footer />
      </div>
    </>
  );
};
