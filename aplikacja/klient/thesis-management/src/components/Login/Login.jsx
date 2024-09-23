import Icon from '../../assets/pics/graduation.png';
import './LoginStyle.css';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ajax } from "rxjs/ajax";
import { catchError, map } from "rxjs/operators";
import { of } from "rxjs";
import { getUserRole } from '../../getUserRole';
import config from '../../config';

export const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const loginData = {email, password};
    const login$ = ajax.post(`${config.BASE_URL}/login`, loginData, {
      "Content-Type":"application/json",
    })
    
    login$
    .pipe(
      map((response) => {
        if (response.status === 400) {
          localStorage.removeItem('token');
          navigate('/');
          window.location.reload(); // Dodajemy odświeżenie strony
        }
        return response.response;
      }),
      catchError((error) => {
        console.error("Błąd logowania: ", error);
        if (error.status === 401) {
          setError('Unauthorized. Token expired.');
          localStorage.removeItem('token');
          navigate('/');
          window.location.reload(); // Dodajemy odświeżenie strony
          toast.error("Sesja dobiegła końca. Zaloguj się ponownie"); // Dodajemy komunikat o błędzie
        } else {
          setError("Nieprawidłowa odpowiedź serwera.");
        }
        return of(null);
      })
    )
    .subscribe(
      (data) => {
        if (data) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userEmail", email);
          
          const { role } = getUserRole();
          
          switch (role) {
            case 'superadministrator':
              try {
                navigate("/startwindowsuperadmin");
              } catch (error) {
                console.error("Navigation error:", error);
              }
              break;
            case 'administrator':
              try {
                navigate("/startwindowadmin");
              } catch (error) {
                console.error("Navigation error:", error);
              }
              break;
            case 'student':
              try {
                navigate("/startwindowstudent");
              } catch (error) {
                console.error("Navigation error:", error);
              }
              break;
            case 'promotor':
              try {
                navigate("/startwindowsupervisor");
              } catch (error) {
                console.error("Navigation error:", error);
              }
              break;
            case 'pracownik':
              try {
                navigate("/startwindowworker");
              } catch (error) {
                console.error("Navigation error:", error);
              }
              break;
            default:
              console.log("No matching role found");
          }
          onLogin(role);
        }
      },
      (error) => {
        console.error("Subscribe error:", error);
      }
    );
  }

  return (
    <div className='login-body'>
      <div className='login-flex-container '>
        <div id='login-container'>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email"></label>
              <input type="text" className="form-control login-input" name="email" id="email" aria-describedby="emailHelp" placeholder="Adres e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="password"></label>
              <input type="password" className="form-control login-input" id="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="login-buttons-div">
              <button type="submit" className="login-button">Zaloguj się</button>
            </div>
          </form>
        </div>
        <div id='login-container2'>
          <img src={Icon} alt="graduationIcon" className='login-icon' />
        </div>
      </div>
    </div>
  );
};