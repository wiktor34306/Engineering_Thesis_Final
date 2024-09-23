import React, { useEffect, useState } from 'react';
import './StartWindowSupervisorStyle.css';
import { Footer } from '../../Footer/Footer';
import { SideNavbarSupervisor } from '../SideNavbarSupervisor/SideNavbarSupervisor';
import config from '../../../config';
import { getName } from '../../../getName';
import { getUserId } from '../../../getUserId';
import { useNavigate } from 'react-router-dom';

export const StartWindowSupervisor = () => {
  const [amountOfTopics, setAmountOfTopics] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAmountOfTopics = async () => {
      try {
        const id_uzytkownika = getUserId();
        const response = await fetch(`${config.BASE_URL}/get-supervisor-topic-amount/${id_uzytkownika}`, {
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
        setAmountOfTopics(data.topicCount);
      } catch (error) {
        console.error('Błąd przy pobieraniu liczby tematów: ', error);
        setAmountOfTopics(0);
      }
    };
  
    fetchAmountOfTopics();
  }, []);  

  return (
    <>
      <div className="start-window-supervisor-container">
        <div className="start-window-supervisor-navbar">
          <SideNavbarSupervisor />
        </div>

        <div className="start-window-supervisor-element">
          <h1>Witaj, {getName()}.</h1>
          <h2>
            Twoja rola to promotor.
            <div className="div-with-tiles-supervisor">
              <div className="sw-tile-supervisor sw-color4-supervisor">
                Ilość tematów przypisanych do Ciebie
                <div className="sw-amount-supervisor">{amountOfTopics}</div>
              </div>
            </div>
          </h2>
        </div>
      </div>
      <div className="footer-start-window-supervisor">
        <Footer />
      </div>
    </>
  );
};
