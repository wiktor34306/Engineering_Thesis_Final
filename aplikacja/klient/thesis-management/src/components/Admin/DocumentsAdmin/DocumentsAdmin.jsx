import React, { useState, useEffect } from 'react';
import './DocumentsAdminStyle.css';
import { SideNavbarAdmin } from '../SideNavbarAdmin/SideNavbarAdmin';
import { Footer } from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { HiArrowDownTray } from 'react-icons/hi2';
import { RiArrowDownDoubleLine, RiArrowUpDoubleFill } from 'react-icons/ri';
import config from '../../../config';

export const DocumentsAdmin = () => {
  const [documents, setDocuments] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
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
        if (fetchPDFResponse.status === 401) {
          console.error('Błąd autoryzacji: ', fetchPDFResponse.status);
          localStorage.removeItem('token');
          navigate('/'); 
          return;
        }
        throw new Error('Network response was not ok');
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
  
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Błąd autoryzacji: ', response.status);
            navigate('/');
            return;
          }
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
      <div className="documents-admin-container">
        <div className="documents-admin-navbar">
          <SideNavbarAdmin />
        </div>

        <div className="documents-admin-element">
          <h1>Dokumenty</h1>

          <div className="div-with-list-of-documents">
          {documents.map((document, index) => {

  return (
    <div key={index} className={`documents-admin-item ${expandedItems[index] ? 'expanded' : ''}`}>
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

      <div className="footer-documents-admin">
        <Footer />
      </div>
    </>
  );
};
