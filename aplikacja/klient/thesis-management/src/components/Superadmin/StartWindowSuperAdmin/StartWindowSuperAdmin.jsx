import React, { useEffect, useState } from 'react';
import './StartWindowSuperAdminStyle.css';
import { SideNavbarSuperAdmin } from '../SideNavbarSuperAdmin/SideNavbarSuperAdmin';
import { Footer } from '../../Footer/Footer';
import { getName } from '../../../getName';
import config from '../../../config';
import { useNavigate } from 'react-router-dom';

export const StartWindowSuperAdmin = () => {
  const [amountOfUsers, setAmountOfUsers] = useState(0);
  const [amountOfStudents, setAmountOfStudents] = useState(0);
  const [amountOfSupervisors, setAmountOfSupervisors] = useState(0);
  const [amountOfTopics, setAmountOfTopics] = useState(0);
  const navigate = useNavigate();

  const checkTopicsAndStudents = () => {
    if (amountOfTopics < amountOfStudents) {
      return (
        <div className="sw-tile-super-admin sw-color4-super-admin">
          <div style={{ color: 'red' }}>Uwaga: Jest mniej tematów niż studentów!</div>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchAmountOfUsers = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get-amount-of-users`, {
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
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        setAmountOfUsers(data.length > 0 ? data[0].count : 0);
      } catch (error) {
        console.error('Błąd przy pobieraniu liczby użytkowników: ', error);
        setAmountOfUsers(0);
      }
    };

    const fetchAmountOfStudents = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get-amount-of-students`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        setAmountOfStudents(data.length > 0 ? data[0].count : 0);
      } catch (error) {
        console.error('Błąd przy pobieraniu liczby studentów: ', error);
        setAmountOfStudents(0);
      }
    };

    const fetchAmountOfSupervisors = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get-amount-of-supervisors`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        setAmountOfSupervisors(data.length > 0 ? data[0].count : 0);
      } catch (error) {
        console.error('Błąd przy pobieraniu liczby promotorów: ', error);
        setAmountOfSupervisors(0);
      }
    };

    const fetchAmountOfTopics = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get-amount-of-topics`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        setAmountOfTopics(data.length > 0 ? data[0].count : 0);
      } catch (error) {
        console.error('Błąd przy pobieraniu liczby tematów: ', error);
        setAmountOfTopics(0);
      }
    };

    fetchAmountOfTopics();
    fetchAmountOfSupervisors();
    fetchAmountOfUsers();
    fetchAmountOfStudents();
  }, []);

  return (
    <>
      <div className="start-window-super-admin-container">
        <div className="start-window-super-admin-navbar">
          <SideNavbarSuperAdmin />
        </div>

        <div className="start-window-super-admin-element">
          <h1>Witaj, {getName()}.</h1>
          <h2>
            Twoja rola to super administrator.
            <div className="div-with-tiles-super-admin">
              <div className="sw-tile-super-admin sw-color1-super-admin">
                Ilość użytkowników ogółem
                <div className="sw-amount-super-admin">{amountOfUsers}</div>
              </div>
              <div className="sw-tile-super-admin sw-color2-super-admin">
                Ilość studentów
                <div className="sw-amount-super-admin">{amountOfStudents}</div>
              </div>
              <div className="sw-tile-super-admin sw-color3-super-admin">
                Ilość promotorów
                <div className="sw-amount-super-admin">{amountOfSupervisors}</div>
              </div>
              <div className="sw-tile-super-admin sw-color4-super-admin">
                Ilość tematów
                <div className="sw-amount-super-admin">{amountOfTopics}</div>
              </div>
            </div>
          </h2>
        </div>
      </div>
      <div className="footer-start-window-super-admin">
        <Footer />
      </div>
    </>
  );
};
