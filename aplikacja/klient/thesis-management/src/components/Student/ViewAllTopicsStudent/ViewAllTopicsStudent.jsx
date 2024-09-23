import React, { useState, useEffect } from 'react';
import './ViewAllTopicsStudentStyle.css';
import { Footer } from '../../Footer/Footer';
import { SideNavbarStudent } from '../SideNavbarStudent/SideNavbarStudent';
import config from '../../../config';
import { ConfirmTopicModalStudent } from '../ConfirmTopicModalStudent/ConfirmTopicModalStudent';
import { CancelChoiceModalStudent } from '../CancelChoiceModalStudent/CancelChoiceModalStudent';
import { toast } from 'react-toastify';
import { getUserId } from '../../../getUserId';
import { useNavigate } from 'react-router-dom';

export const ViewAllTopicsStudent = () => {
  const [topics, setTopics] = useState([]);
  const [, setConfirmTopicModalStudentOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [chosenTopic, setChosenTopic] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTopicInfo, setSelectedTopicInfo] = useState(null);
  const [reservedTopicInfo, setReservedTopicInfo] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
    fetchReservedTopicInfo();
  }, [sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prevDirection) => prevDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const fetchTopics = () => {
    const userId = getUserId();
    fetch(`${config.BASE_URL}/get-student-topics/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Bearer " + localStorage.getItem("token"),
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
    .then(data => {
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
    .catch(error => {
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
        
        const fieldValueA = sortField === 'promotor' ? `${a.stopien_naukowy} ${a.imie_promotora} ${a.nazwisko_promotora}` : (sortField === 'status' ? a['status'] : a[sortField]);
        const fieldValueB = sortField === 'promotor' ? `${b.stopien_naukowy} ${b.imie_promotora} ${b.nazwisko_promotora}` : (sortField === 'status' ? b['status'] : b[sortField]);

        const normalizedValueA = typeof fieldValueA === 'string' ? fieldValueA.toLowerCase() : String(fieldValueA).toLowerCase();
        const normalizedValueB = typeof fieldValueB === 'string' ? fieldValueB.toLowerCase() : String(fieldValueB).toLowerCase();
  
        return sortDirection === 'asc' ? normalizedValueA.localeCompare(normalizedValueB) : normalizedValueB.localeCompare(normalizedValueA);
      });
    }
    return sortedData;
  };


const fetchReservedTopicInfo = () => {
  const userId = getUserId();
  fetch(`${config.BASE_URL}/get-topic-by-student-id/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const text = await response.text();

      try {
        const data = JSON.parse(text);
        setReservedTopicInfo(data);
      } catch (error) {
        console.error('Błąd podczas parsowania danych JSON:', error);
      }
    })
    .catch((error) => {
      console.error('Błąd podczas pobierania zarezerwowanego tematu: ', error);
    });
};

  const openConfirmTopicModalStudent = () => {
    if (reservedTopicInfo) {
      toast.warning('Masz już przypisany temat. Nie możesz wybrać kolejnego.');
    } else {
      setConfirmTopicModalStudentOpen(true);
    }
  };

  const openCancelModal = () => {
    if (reservedTopicInfo) {
      setCancelModalOpen(true);
    } else {
      toast.warning('Nie masz przypisanego tematu do anulowania.');
    }
  };

  const closeConfirmTopicModalStudent = () => {
    setConfirmTopicModalStudentOpen(false);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
  };

  const handleButtonClick = (topic) => {
    if (reservedTopicInfo) {
      toast.warning('Masz już przypisany temat. Nie możesz wybrać kolejnego.');
    } else {
      setChosenTopic(topic.id_tematu);
      setSelectedTopicInfo({
        topicName: topic.temat,
        supervisorInfo: `${topic.stopien_naukowy} ${topic.imie} ${topic.nazwisko}`,
      });
      setModalIsOpen(true);
    }
  };

  const confirmReservation = async () => {
    try {
      const id_uzytkownika = getUserId();

      const response = await fetch(`${config.BASE_URL}/reserve-topic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id_uzytkownika,
          id_tematu: chosenTopic,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data && data.message) {
        toast.success(data.message);
      } else if (data && data.error) {
        toast.error(data.error);
      } else {
        console.error('Nieprawidłowa odpowiedź serwera.');
        toast.error('Błąd rezerwacji tematu');
      }

      setChosenTopic(null);
      setSelectedTopicInfo(null);
      setModalIsOpen(false);
      fetchReservedTopicInfo();
    } catch (error) {
      console.error('Błąd przy rezerwacji tematu: ', error);
      toast.error('Błąd rezerwacji tematu. Spróbuj ponownie.');
    }
  };

  const cancelReservation = async () => {
    try {
      const id_uzytkownika = getUserId();

      const response = await fetch(`${config.BASE_URL}/cancel-reservation`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id_uzytkownika,
          id_tematu: reservedTopicInfo.id_tematu,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data && data.message) {
        toast.success(data.message);
      } else if (data && data.error) {
        toast.error(data.error);
      } else {
        console.error('Nieprawidłowa odpowiedź serwera.');
        toast.error('Błąd anulowania rezerwacji tematu');
      }

      fetchReservedTopicInfo();
    } catch (error) {
      console.error('Błąd przy anulowaniu rezerwacji tematu: ', error);
      toast.error('Błąd anulowania rezerwacji tematu. Spróbuj ponownie.');
    } finally {
      setCancelModalOpen(false);
    }
  };

  return (
    <>
      <div className="topics-student-container">
        <div className="topics-student-navbar">
          <SideNavbarStudent />
        </div>
        <div className="topics-student-element">
          {reservedTopicInfo ? (
  <div className="reserved-topic-info">
    <h1>Twój wybór</h1>
    <table className="styled-table-with-topics-student">
      <thead>
        <tr>
          <th>Wybrałeś temat</th>
          <th>Twoim promotorem jest</th>
          <th>Akcja</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{reservedTopicInfo?.temat}</td>
          <td>{`${reservedTopicInfo?.stopien_naukowy} ${reservedTopicInfo?.imie_promotora} ${reservedTopicInfo?.nazwisko_promotora}`}</td>
          <td>
            <button
              id="reservation-button-student-cancel"
              onClick={() => openCancelModal()}
            >
              Anuluj rezerwację
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
) : (
  <div className="reserved-topic-info">
    <h1>Nie masz jeszcze wybranego tematu</h1>
  </div>
)}
          <h1>Tematy do wyboru dla Ciebie</h1>
          <table className="styled-table-with-topics-student">
            <thead>
              <tr>
                <th>lp.</th>
                <th>temat</th>
                <th className="choosen" onClick={() => handleSort('promotor')}>promotor</th>
                <th>katedra</th>
                <th className="choosen" onClick={() => handleSort('status')}>rezerwacja tematu</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic, index) => (
                <tr key={topic.id_tematu}>
                  <td>{index + 1}</td>
                  <td>{topic.temat}</td>
                  <td>{`${topic.stopien_naukowy} ${topic.imie} ${topic.nazwisko}`}</td>
                  <td>{topic.nazwa_katedry}</td>
                  <td>
                    {topic.status ? (
                      <button
                        id={reservedTopicInfo ? 'disabled' : 'reservation-button-student'}
                        onClick={() => handleButtonClick(topic)}
                        className={reservedTopicInfo ? 'disabled' : ''}
                      >
                        Rezerwuj
                      </button>
                    ) : (
                      <span>Zarezerwowano</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="footer-topics-student">
        <Footer />
      </div>

      {modalIsOpen && (
        <ConfirmTopicModalStudent
          isOpen={modalIsOpen}
          handleClose={() => setModalIsOpen(false)}
          confirmReservation={confirmReservation}
          topicName={selectedTopicInfo?.topicName}
          supervisorInfo={selectedTopicInfo?.supervisorInfo}
        />
      )}

      {isCancelModalOpen && (
        <CancelChoiceModalStudent
          isOpen={isCancelModalOpen}
          handleClose={() => setCancelModalOpen(false)}
          cancelReservation={cancelReservation}
          topicName={reservedTopicInfo?.temat}
          supervisorInfo={`${reservedTopicInfo?.stopien_naukowy} ${reservedTopicInfo?.imie_promotora} ${reservedTopicInfo?.nazwisko_promotora}`}
        />
      )}
    </>
  );
};