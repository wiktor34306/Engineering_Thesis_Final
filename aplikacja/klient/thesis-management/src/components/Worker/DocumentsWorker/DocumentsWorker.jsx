import React, {useState, useEffect} from 'react';
import './DocumentsWorkerStyle.css';
import {SideNavbarWorker} from '../SideNavbarWorker/SideNavbarWorker';
import {Footer} from '../../Footer/Footer';
import { HiArrowDownTray } from 'react-icons/hi2';
import { RiArrowDownDoubleLine } from 'react-icons/ri';
import { RiArrowUpDoubleFill } from 'react-icons/ri';
import config from '../../../config';
import { useNavigate } from 'react-router-dom';

export const DocumentsWorker = () => {
    const [expandedItems, setExpandedItems] = useState({});
    const [documents, setDocuments] = useState([]);
    const [, setDocumentIds] = useState({});
    const navigate = useNavigate();

    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZone: 'Europe/Warsaw',
      };
    
      return new Intl.DateTimeFormat('pl-PL', options).format(date);
    };
  
    const toggleExpand = (index) => {
      setExpandedItems((prevExpandedItems) => {
        return { ...prevExpandedItems, [index]: !prevExpandedItems[index] };
      });
    };
  
    const handleDownloadDocument = async (documentId, fileName) => {
      try {
        const fetchPDFResponse = await fetch(`${config.BASE_URL}/fetch-pdf?documentId=${documentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
    
        if (!fetchPDFResponse.ok) {
          console.error('Błąd pobierania PDF:', fetchPDFResponse.statusText);
          return;
        }
    
        const pdfBlob = await fetchPDFResponse.blob();
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); 
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Błąd pobierania dokumentu:', error);
      }
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${config.BASE_URL}/get-all-documents`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          });
    
          if (response.status === 401) {
            console.error('Błąd autoryzacji: ', response.status);
            localStorage.removeItem('token');
            navigate('/');
            return;
          }
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
          }
    
          const data = await response.json();
    
          const documentIds = data.reduce((acc, document) => {
            acc[document.id_dokumentu] = document.id_dokumentu;
            return acc;
          }, {});
          setDocumentIds(documentIds);
    
          setDocuments(data);
        } catch (error) {
          console.error('Błąd pobierania danych z serwera:', error);
        }
      };
    
      fetchData();
    }, []);
  
  
    return (
      <>
        <div className="documents-worker-container">
          <div className="documents-worker-navbar">
            <SideNavbarWorker />
          </div>
  
          <div className="documents-worker-element">
            <h1>Dokumenty</h1>
  
            <div className="div-with-list-of-documents-worker">
            {documents.map((document, index) => {

  return (
    <div key={index} className={`documents-worker-item ${expandedItems[index] ? 'expanded' : ''}`}>
      <table className="documents-table">
        <thead className="documents-thead">
          <tr>
            <th>Nazwa</th>
            <th>Data utworzenia</th>
            <th>Autor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
          <td>{document.nazwa}</td>
          <td>{formatDate(document.data_utworzenia)}</td>
          <td>{document.imie + ' ' + document.nazwisko}</td>
          </tr>
        </tbody>
      </table>
      <div className="documents-expand-button" onClick={() => toggleExpand(index)}>
        {expandedItems[index] ? <RiArrowUpDoubleFill size={32} /> : <RiArrowDownDoubleLine size={32} />}
      </div>
      {expandedItems[index] && (
      <div className="documents-download-link">
        {document.id_dokumentu ? (
          <button className="documents-admin-download-pdf-button" onClick={() => handleDownloadDocument(document.id_dokumentu, document.nazwa)}>
            <HiArrowDownTray /> Pobierz dokument
          </button>
        ) : (
          <span>Brak dostępnego ID dokumentu</span>
        )}
      </div>
  )}
    </div>
  );
})}
          </div>
        </div>
      </div>
  
        <div className="footer-documents-worker">
          <Footer />
        </div>
      </>
    );
  };
