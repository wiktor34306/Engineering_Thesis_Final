import React, { useState, useEffect } from 'react';
import './ViewAllTopicsSuperAdminStyle.css';
import { Footer } from '../../Footer/Footer';
import { SideNavbarSuperAdmin } from '../SideNavbarSuperAdmin/SideNavbarSuperAdmin';
import config from '../../../config';
import { EditTopicNameSuperadmin } from '../EditTopicNameSuperadmin/EditTopicNameSuperadmin';
import Papa from 'papaparse';
import { AssignStudentToTopicSuperAdmin } from '../AssignStudentToTopicSuperAdmin/AssignStudentToTopicSuperAdmin';
import { ConfirmWindowDeleteTopicSuperAdmin } from '../ConfirmWindowDeleteTopicSuperAdmin/ConfirmWindowDeleteTopicSuperAdmin';
import { getUserId } from '../../../getUserId';
import { useNavigate } from 'react-router-dom';

export const ViewAllTopicsSuperAdmin = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [, setUserId] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    const id_uzytkownika = getUserId();
    if (id_uzytkownika) {
      setUserId(id_uzytkownika);
      fetchTopics(id_uzytkownika);
    }
  }, [sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prevDirection) => {
        return prevDirection === 'asc' ? 'desc' : 'asc';
      });
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const fetchTopics = () => {
    fetch(`${config.BASE_URL}/get-topics`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
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
    .then((data) => {
      const updatedData = data.map((topic) => {
        if (topic.imie_studenta && topic.nazwisko_studenta) {
          topic.zarezerwowany_przez = `${topic.imie_studenta} ${topic.nazwisko_studenta}`;
        } else {
          topic.zarezerwowany_przez = 'Brak';
        }
        topic.promotor = `${topic.stopien_naukowy} ${topic.imie_promotora} ${topic.nazwisko_promotora}`;
        return topic;
      });
      const sortedData = sortData(updatedData);
      setTopics(sortedData);
    })
    .catch((error) => {
      console.error('Błąd podczas pobierania tematów: ', error);
    });
  };
  const sortData = (data) => {
    let sortedData = [...data];
    if (sortField !== null) {
      sortedData.sort((a, b) => {
        if (a[sortField] === undefined || b[sortField] === undefined) {
          console.error(`Brak pola ${sortField} w jednym z obiektów: `, a, b);
          return 0;
        }
        
        const fieldValueA = sortField === 'promotor' ? `${a.stopien_naukowy} ${a.imie_promotora} ${a.nazwisko_promotora}` : (sortField === 'nazwa_katedry' ? a['nazwa_katedry'] : a[sortField]);
        const fieldValueB = sortField === 'promotor' ? `${b.stopien_naukowy} ${b.imie_promotora} ${b.nazwisko_promotora}` : (sortField === 'nazwa_katedry' ? b['nazwa_katedry'] : b[sortField]);

        const normalizedValueA = typeof fieldValueA === 'string' ? fieldValueA.toLowerCase() : String(fieldValueA).toLowerCase();
        const normalizedValueB = typeof fieldValueB === 'string' ? fieldValueB.toLowerCase() : String(fieldValueB).toLowerCase();
  
        return sortDirection === 'asc' ? normalizedValueA.localeCompare(normalizedValueB) : normalizedValueB.localeCompare(normalizedValueA);
      });
    }
    return sortedData;
  };

  const generateCSV = () => {
    const id_uzytkownika = getUserId();
    const currentDate = new Date().toLocaleString('pl-PL').replace(/[^\w\s]/gi, '');
    const csvData = topics.map((topic, index) => ({
      lp: index + 1,
      temat: topic.temat,
      promotor: `${topic.stopien_naukowy} ${topic.imie_promotora} ${topic.nazwisko_promotora}`,
      katedra: topic.nazwa_katedry,
      'zarezerwowany przez': topic.zarezerwowany_przez,
    }));

    const csv = Papa.unparse(csvData, {
      delimiter: ",",
      header: true,
      encoding: "utf-8",
      quotes: true,
    });

    const fileName = `tematy-id${id_uzytkownika}-${currentDate}.csv`;
    const csvBlob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = csvUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditButtonClick = (topic) => {
    setSelectedTopic(topic);
    setIsEditModalOpen(true);
  };

  const handleOpenAssignModal = () => {
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
  };

  const handleDeleteButtonClick = (topic) => {
    setSelectedTopic(topic);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="topics-super-admin-container">
        <div className="topics-super-admin-navbar">
          <SideNavbarSuperAdmin />
        </div>
        <div className="topics-super-admin-element">
          <h1>Zobacz wszystkie tematy</h1>
          <table className="styled-table-with-topics-super-admin">
            <thead>
              <tr>
                <th>lp.</th>
                <th>temat</th>
                <th className="choosen" onClick={() => handleSort('promotor')}>promotor</th>
                <th className="choosen" onClick={() => handleSort('nazwa_katedry')}>katedra</th>
                <th>zarezerwowany przez</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic, index) => (
                <tr key={topic.id_tematu}>
                  <td>{index + 1}</td>
                  <td>{topic.temat}</td>
                  <td>{`${topic.stopien_naukowy} ${topic.imie_promotora} ${topic.nazwisko_promotora}`}</td>
                  <td>{topic.nazwa_katedry}</td>
                  <td>{topic.zarezerwowany_przez}</td>
                  <td>
                    <button className="button-view-all-topics-super-admin-edit" onClick={() => handleEditButtonClick(topic)}>
                      Edytuj nazwę
                    </button>

                    <button className="button-view-all-topics-super-admin-delete" onClick={() => handleDeleteButtonClick(topic)}>
                      Usuń temat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="button-div-view-all-topics-super-admin-gen-csv">
            <button className="button-view-all-topics-super-admin-generate-csv" type="submit" onClick={generateCSV}>
              Generuj plik CSV z podziałem na studentów i tematy
            </button>

            <button className="button-view-all-topics-super-admin-generate-csv button-view-all-topics-super-admin-assign-to" type="submit" onClick={handleOpenAssignModal}>
              Przypisz studenta do tematu
            </button>
          </div>
        </div>
      </div>

      <div className="footer-topics-super-admin">
        <Footer />
      </div>

      {isEditModalOpen && (
        <EditTopicNameSuperadmin
          open={isEditModalOpen}
          handleClose={() => {
            setIsEditModalOpen(false);
            setSelectedTopic(null);
            fetchTopics();
          }}
          selectedTopic={selectedTopic}
        />
      )}

      {isAssignModalOpen && (
        <AssignStudentToTopicSuperAdmin
          open={isAssignModalOpen}
          handleClose={handleCloseAssignModal}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmWindowDeleteTopicSuperAdmin
          isOpen={isDeleteModalOpen}
          handleClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTopic(null);
            fetchTopics();
          }}
          topicId={selectedTopic.id_tematu}
        />
      )}
    </>
  );
};