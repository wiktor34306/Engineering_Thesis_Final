import React, {useState, useEffect} from 'react';
import './SettingsWorkerStyle.css';
import {Footer} from '../../Footer/Footer';
import { SideNavbarWorker } from '../SideNavbarWorker/SideNavbarWorker';
import packageJson from '../../../../package.json';
import config from '../../../config';
import { getUserId } from '../../../getUserId';
import { useNavigate } from 'react-router-dom';

export const SettingsWorker = () => {
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
      <div className="div-to-center-table-settings-worker">
      <div className={`sw-tile-settings-worker ${userData.rola === 'pracownik' ? 'sw-color4-worker' : ''}`}>
        <table className="user-info-table settings-worker-table">
        <tbody>
            <tr>
              <td className="settings-worker-cell settings-worker-cell-label">Imię:</td>
              <td className="settings-worker-cell settings-worker-cell-value">{userData.imie}</td>
            </tr>
            <tr>
              <td className="settings-worker-cell settings-worker-cell-label">Nazwisko:</td>
              <td className="settings-worker-cell settings-worker-cell-value">{userData.nazwisko}</td>
            </tr>
            <tr>
              <td className="settings-worker-cell settings-worker-cell-label">Adres e-mail:</td>
              <td className="settings-worker-cell settings-worker-cell-value">{userData.adres_email}</td>
            </tr>
            <tr>
              <td className="settings-worker-cell settings-worker-cell-label">Rola:</td>
              <td className="settings-worker-cell settings-worker-cell-value">{userData.rola}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    );
  };

  return (
    <>
      <div className="settings-worker-container">
        <div className="settings-worker-navbar">
          <SideNavbarWorker />
        </div>
        <div className="container-worker-element">
          <div className="div-with-buttons-settings-worker">
            <button className="button-in-settings-worker" onClick={() => setView('O aplikacji')}>O aplikacji</button>
            <button className="button-in-settings-worker" onClick={() => setView('O użytkowniku')}>O użytkowniku</button>
          </div>

          <div className="settings-worker-element">
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

      <div className="footer-settings-worker">
        <Footer />
      </div>
    </>
  );
};