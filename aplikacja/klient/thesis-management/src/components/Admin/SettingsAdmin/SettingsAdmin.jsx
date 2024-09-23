import React, {useState, useEffect} from 'react';
import './SettingsAdminStyle.css';
import {Footer} from '../../Footer/Footer';
import packageJson from '../../../../package.json';
import config from '../../../config';
import { getUserId } from '../../../getUserId';
import { useNavigate } from 'react-router-dom';
import { SideNavbarAdmin } from '../SideNavbarAdmin/SideNavbarAdmin';

export const SettingsAdmin = () => {
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
      <div className="div-to-center-table-settings-admin">
      <div className={`sw-tile-settings-admin ${userData.rola === 'administrator' ? 'sw-color4-admin' : ''}`}>
        <table className="user-info-table settings-admin-table">
        <tbody>
            <tr>
              <td className="settings-admin-cell settings-admin-cell-label">Imię:</td>
              <td className="settings-admin-cell settings-admin-cell-value">{userData.imie}</td>
            </tr>
            <tr>
              <td className="settings-admin-cell settings-admin-cell-label">Nazwisko:</td>
              <td className="settings-admin-cell settings-admin-cell-value">{userData.nazwisko}</td>
            </tr>
            <tr>
              <td className="settings-admin-cell settings-admin-cell-label">Adres e-mail:</td>
              <td className="settings-admin-cell settings-admin-cell-value">{userData.adres_email}</td>
            </tr>
            <tr>
              <td className="settings-admin-cell settings-admin-cell-label">Rola:</td>
              <td className="settings-admin-cell settings-admin-cell-value">{userData.rola}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    );
  };

  return (
    <>
      <div className="settings-admin-container">
        <div className="settings-admin-navbar">
          <SideNavbarAdmin />
        </div>
        <div className="container-admin-element">
          <div className="div-with-buttons-settings-admin">
            <button className="button-in-settings-admin" onClick={() => setView('O aplikacji')}>O aplikacji</button>
            <button className="button-in-settings-admin" onClick={() => setView('O użytkowniku')}>O użytkowniku</button>
          </div>

          <div className="settings-admin-element">
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

      <div className="footer-settings-admin">
        <Footer />
      </div>
    </>
  );
};