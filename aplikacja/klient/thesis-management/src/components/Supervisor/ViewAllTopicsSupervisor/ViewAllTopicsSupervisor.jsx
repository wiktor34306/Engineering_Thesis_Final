import React, { useState, useEffect } from 'react';
import './ViewAllTopicsSupervisorStyle.css';
import { Footer } from '../../Footer/Footer';
import { SideNavbarSupervisor } from '../SideNavbarSupervisor/SideNavbarSupervisor';
import config from '../../../config';
import { EditTopicNameSupervisor } from '../EditTopicNameSupervisor/EditTopicNameSupervisor';
import Papa from 'papaparse';
import { ConfirmWindowDeleteTopicSupervisor } from '../ConfirmWindowDeleteTopicSupervisor/ConfirmWindowDeleteTopicSupervisor';
import { getUserId } from '../../../getUserId';
import { useNavigate } from 'react-router-dom';

export const ViewAllTopicsSupervisor = () => {
  const [topics, setTopics] = useState([]);
  const [, setUserId] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
    const id_uzytkownika = getUserId();
    fetch(`${config.BASE_URL}/get-supervisor-topics/${id_uzytkownika}`, {
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
        const updatedData = data.map(topic => {
          if (topic.imie_studenta && topic.nazwisko_studenta) {
            topic.zarezerwowany_przez = `${topic.imie_studenta} ${topic.nazwisko_studenta}`;
          } else {
            topic.zarezerwowany_przez = 'Brak';
          }
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
        const normalizedValueA = typeof a[sortField] === 'string' ? a[sortField].toLowerCase() : a[sortField];
        const normalizedValueB = typeof b[sortField] === 'string' ? b[sortField].toLowerCase() : b[sortField];
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

  const handleDeleteButtonClick = (topic) => {
    setSelectedTopic(topic);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="topics-supervisor-container">
        <div className="topics-supervisor-navbar">
          <SideNavbarSupervisor />
        </div>
        <div className="topics-supervisor-element">
          <h1>Tematy prac przypisane do Ciebie</h1>
          <table className="styled-table-with-topics-supervisor">
            <thead>
              <tr>
                <th>lp.</th>
                <th>temat</th>
                <th className="choosen" onClick={() => handleSort('zarezerwowany_przez')}>zarezerwowany przez</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic, index) => (
                <tr key={topic.id_tematu}>
                  <td>{index + 1}</td>
                  <td>{topic.temat}</td>
                  <td>{topic.zarezerwowany_przez}</td>
                  <td>
                    <button className="button-view-all-topics-supervisor-edit" onClick={() => handleEditButtonClick(topic)}>
                      Edytuj nazwę
                    </button>

                    <button className="button-view-all-topics-supervisor-delete" onClick={() => handleDeleteButtonClick(topic)}>
                      Usuń temat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="button-div-view-all-topics-supervisor-gen-csv">
            <button className="button-view-all-topics-supervisor-generate-csv" type="submit" onClick={generateCSV}>
              Generuj plik CSV z podziałem na studentów i tematy
            </button>
          </div>
        </div>
      </div>

      <div className="footer-topics-supervisor">
        <Footer />
      </div>

      {isEditModalOpen && (
        <EditTopicNameSupervisor
          open={isEditModalOpen}
          handleClose={() => {
            setIsEditModalOpen(false);
            setSelectedTopic(null);
            fetchTopics();
          }}
          selectedTopic={selectedTopic}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmWindowDeleteTopicSupervisor
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