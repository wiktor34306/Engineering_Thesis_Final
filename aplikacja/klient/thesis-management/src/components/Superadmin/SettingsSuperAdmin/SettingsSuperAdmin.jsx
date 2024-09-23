import React, {useState, useEffect} from 'react';
import './SettingsSuperAdminStyle.css';
import {Footer} from '../../Footer/Footer';
import packageJson from '../../../../package.json';
import config from '../../../config';
import { getUserId } from '../../../getUserId';
import { SideNavbarSuperAdmin } from '../SideNavbarSuperAdmin/SideNavbarSuperAdmin';
import { useNavigate } from 'react-router-dom';

export const SettingsSuperAdmin = () => {
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
    .then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Błąd autoryzacji: ', response.status);
          localStorage.removeItem('token'); 
          navigate('/');
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setUserData(data);
    })
    .catch((error) => console.error('Błąd przy pobieraniu danych użytkownika: ', error));
  }, []);
  

  const renderUserInfoTile = () => {
    return (
      <div className="div-to-center-table-settings-super-admin">
      <div className={`sw-tile-settings-super-admin ${userData.rola === 'superadministrator' ? 'sw-color4-super-admin' : ''}`}>
        <table className="user-info-table settings-super-admin-table">
        <tbody>
            <tr>
              <td className="settings-super-admin-cell settings-super-admin-cell-label">Imię:</td>
              <td className="settings-super-admin-cell settings-super-admin-cell-value">{userData.imie}</td>
            </tr>
            <tr>
              <td className="settings-super-admin-cell settings-super-admin-cell-label">Nazwisko:</td>
              <td className="settings-super-admin-cell settings-super-admin-cell-value">{userData.nazwisko}</td>
            </tr>
            <tr>
              <td className="settings-super-admin-cell settings-super-admin-cell-label">Adres e-mail:</td>
              <td className="settings-super-admin-cell settings-super-admin-cell-value">{userData.adres_email}</td>
            </tr>
            <tr>
              <td className="settings-super-admin-cell settings-super-admin-cell-label">Rola:</td>
              <td className="settings-super-admin-cell settings-super-admin-cell-value">{userData.rola}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    );
  };

  return (
    <>
      <div className="settings-super-admin-container">
        <div className="settings-super-admin-navbar">
          <SideNavbarSuperAdmin />
        </div>
        <div className="container-super-admin-element">
          <div className="div-with-buttons-settings-super-admin">
            <button className="button-in-settings-super-admin" onClick={() => setView('O aplikacji')}>O aplikacji</button>
            <button className="button-in-settings-super-admin" onClick={() => setView('O użytkowniku')}>O użytkowniku</button>
          </div>

          <div className="settings-super-admin-element">
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

      <div className="footer-settings-super-admin">
        <Footer />
      </div>
    </>
  );
};