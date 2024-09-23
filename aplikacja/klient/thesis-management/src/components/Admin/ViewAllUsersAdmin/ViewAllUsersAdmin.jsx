import React, { useState, useEffect } from 'react';
import './ViewAllUsersAdminStyle.css';
import { SideNavbarAdmin } from '../SideNavbarAdmin/SideNavbarAdmin';
import { Footer } from '../../Footer/Footer';
import config from '../../../config';
import { useNavigate } from 'react-router-dom';

export const ViewAllUsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    fetch(`${config.BASE_URL}/get-users`, {
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
      setUsers(data);
    })
    .catch(error => {
      console.error('Błąd pobierania danych: ', error);
    });
  };
  
  const filteredUsers = users.filter(user =>
    user.imie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nazwisko.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="viewusers-admin-container">
        <div className="viewusers-admin-navbar">
          <SideNavbarAdmin />
        </div>

        <div className="viewusers-admin-element">
          <h1>Zobacz wszystkich użytkowników</h1>

          <div className="viewusers-search">
            <label>Wyszukaj:</label>
            <input
              type="text"
              className="input-search-style-viewallusers"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="viewusers-table-admin-all-users">
            <table className="viewusers-table-admin">
              <thead>
                <tr>
                  {/* <th>Id użytkownika</th> */}
                  <th>Imię</th>
                  <th>Nazwisko</th>
                  <th>Adres e-mail</th>
                  <th>Rola</th>
                  
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id_uzytkownika} className="viewusers-tr">
                    {/* <td className="viewusers-td">{user.id_uzytkownika}</td> */}
                    <td className="viewusers-td">{user.imie}</td>
                    <td className="viewusers-td">{user.nazwisko}</td>
                    <td className="viewusers-td">{user.adres_email}</td>
                    <td className="viewusers-td">{user.rola}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="footer-viewusers-admin">
        <Footer />
      </div>
    </>
  );
};
