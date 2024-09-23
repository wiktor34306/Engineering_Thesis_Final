import React, { useState } from 'react';
import "./SideNavbarWorkerStyle.css";
import AcademiaIcon from '../../../assets/pics/logo-akademia-nauk.svg';
import dashboardIcon from '../../../assets/pics/grid.svg';
import documentIcon from '../../../assets/pics/documents.svg';
import settingIcon from '../../../assets/pics/settings.svg';
import adminAvatarIcon from '../../../assets/pics/admin-avatar.svg';
import logoutIcon from '../../../assets/pics/logout.svg';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { getName } from '../../../getName';
import config from '../../../config';

export const SideNavbarWorker = () => {
    const [isExpanded, setExpandState] = useState(false);
    const [, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            let decodedToken = '';
            const token = localStorage.getItem('token');
            
            if (token) {
                decodedToken = jwtDecode(token);
                setUser(decodedToken);
            }
              
            const id_uzytkownika = decodedToken.id_uzytkownika;
    
            if (id_uzytkownika) {
                const response = await axios.delete(`${config.BASE_URL}/logout/${id_uzytkownika}`);
                if (response.status === 202) {
                    console.log('Logout successful');
                    localStorage.removeItem('token');
                    navigate("/"); 
                } else {
                    console.error('Logout failed');
                }
            } else {
                console.error('User ID not found or invalid token');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
    
    return (
        <div className={`sidenavbar-worker-container ${isExpanded ? "sidenavbar-expanded" : "sidenavbar-not-expanded"}`}>
            <div className={`sidenavbar-worker-div-with-range-from-beginning-to-username ${isExpanded ? "sidenavbar-worker-div-with-range-from-beginning-to-username" : "sidenavbar-worker-div-with-range-from-beginning-to-username-not-expanded"}`}>
                <div className="sidenavbar-worker-upper-of-navbar">
                    <div className="sidenavbar-worker-heading-of-navbar">
                    {isExpanded && (
                        <div className="sidenavbar-worker-nav-brand">
                            <img className="sidenavbar-worker-nav-img-appearance" src={AcademiaIcon} alt="" width="150" height="150" />
                        </div>
                    )}

                    <button
                        className={`sidenavbar-worker-hamburger-look ${isExpanded ? 'sidenavbar-worker-hamburger-look-in' : 'sidenavbar-worker-hamburger-look-out'}`}
                        onClick={() => setExpandState(!isExpanded)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div className="sidenavbar-worker-menu-of-navbar">
                    <ol>
                        <li>
                            <NavLink to="/startwindowworker" className={`sidenavbar-worker-menu-item `}>
                                <img src={dashboardIcon} alt="obrazki" />
                                {isExpanded ? (<p>Start</p>) : (<p className="sidenavbar-worker-tooltip">Start</p>)}
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/documentsworker" className={`sidenavbar-worker-menu-item`}>
                                <img src={documentIcon} alt="obrazki" />
                                {isExpanded ? (<p>Dokumenty</p>) : (<p className="sidenavbar-worker-tooltip">Dokumenty</p>)}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/settingsworker" className={`sidenavbar-worker-menu-item`}>
                                <img src={settingIcon} alt="obrazki" />
                                {isExpanded ? (<p>O aplikacji</p>) : (<p className="sidenavbar-worker-tooltip">O aplikacji</p>)}
                            </NavLink>
                        </li>
                    </ol>
                </div>
            </div>
            <div className="sidenavbar-worker-down-of-navbars-footer">
            {isExpanded && (
            <div className="sidenavbar-worker-div-with-username-and-role">
                <img src={adminAvatarIcon} alt="admin" />
                <div className="sidenavbar-worker-down-of-navbars-footer-info">
                <p className="sidenavbar-worker-down-of-navbars-footer-user-name">{getName()}</p>
                <p className="sidenavbar-worker-down-of-navbars-footer-user-position">Rola: pracownik</p>
                </div>
            </div>
            )}
            <button className="sidenavbar-worker-icon-logout-button">
                <Link to="#" className="sidenavbar-worker-icon-of-logout" onClick={handleLogout}>
                    <img src={logoutIcon} alt="sidenavbar-worker-icon-of-logout" />
                </Link>
            </button>
            </div>
        </div>
        </div>
    );
};
