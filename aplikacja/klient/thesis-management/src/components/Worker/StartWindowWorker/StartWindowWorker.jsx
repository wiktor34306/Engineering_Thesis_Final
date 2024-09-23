import React, { useState, useEffect } from 'react';
import './StartWindowWorkerStyle.css';
import {SideNavbarWorker} from '../SideNavbarWorker/SideNavbarWorker';
import {Footer} from '../../Footer/Footer';
import config from '../../../config';
import { getName } from '../../../getName';
import { useNavigate } from 'react-router-dom';

export const StartWindowWorker = () => {
  const [documentCount, setDocumentCount] = useState(0);
  const navigate = useNavigate();

  const fetchDocumentCount = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/get-count-of-all-documents`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
  
      if (response.status === 401) {
        console.error('Błąd autoryzacji: ', response.status);
        localStorage.removeItem('token');
        navigate('/');
        return;
      }
  
      const data = await response.json();
      setDocumentCount(data.length > 0 ? data[0].count : 0);
    } catch (error) {
      console.error('Błąd przy pobieraniu liczby dokumentów: ', error);
      setDocumentCount(0);
    }
  };
  
  useEffect(() => {
    fetchDocumentCount();
  }, []);  

  return (
    <>
    <div className="start-window-worker-container">
      <div className="start-window-worker-navbar">
        <SideNavbarWorker/>
      </div>   
     

      <div className="start-window-worker-element">
        <h1>Witaj, {getName()}.</h1>
        <h2>Twoja rola to pracownik.
          <div className="div-with-tiles-worker">
            <div className="sw-tile-worker sw-color1-worker">Ilość kart zgłoszeń
              <div className="sw-amount-worker">{documentCount}</div>
            </div>
          </div>
        </h2>

      </div>
    </div>
    <div className="footer-start-window-worker">
        <Footer />
      </div>
    </>
  );
};