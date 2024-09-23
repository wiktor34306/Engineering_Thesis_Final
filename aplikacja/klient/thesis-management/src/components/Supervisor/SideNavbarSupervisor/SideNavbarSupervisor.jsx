import React, { useState } from 'react';
import "./SideNavbarSupervisorStyle.css"
import AcademiaIcon from '../../../assets/pics/logo-akademia-nauk.svg';
import dashboardIcon from '../../../assets/pics/grid.svg';
import messageIcon from '../../../assets/pics/message.svg';
import documentIcon from '../../../assets/pics/documents.svg';
import settingIcon from '../../../assets/pics/settings.svg';
import adminAvatarIcon from '../../../assets/pics/admin-avatar.svg';
import logoutIcon from '../../../assets/pics/logout.svg';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AddingTopicFormModalSupervisor} from '../AddingTopicFormModalSupervisor/AddingTopicFormModalSupervisor';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { getName } from '../../../getName';
import config from '../../../config';
import { GenerateTopicReportCardSupervisor } from '../GenerateTopicReportCardSupervisor/GenerateTopicReportCardSupervisor';

export const SideNavbarSupervisor = () => {
    const [isExpanded, setExpandState] = useState(false);
    const [isMessageExpanded, setMessageExpandState] = useState(false);
    const [isAddingTopicModalOpen, setAddingTopicModalOpen] = useState(false);
    const [, setUser] = useState(null);
    const Navigate = useNavigate();
    const [isGenerateTopicReportCardModalOpen, setGenerateTopicReportCardModalOpen] = useState(false);

    const handleMessageMouseEnter = () => {
        setMessageExpandState(true);
    }

    const handleMessageMouseLeave = () => {
        setMessageExpandState(false);
    }

    const openAddingTopicModal = () => {
        setAddingTopicModalOpen(true);
    };

    const closeAddingTopicModal = () => {
        setAddingTopicModalOpen(false);
    };

    const openGenerateTopicReportCardModalOpen = () => {
        setGenerateTopicReportCardModalOpen(true);
    };

    const closeGenerateTopicReportCardModalOpen = () => {
        setGenerateTopicReportCardModalOpen(false);
    };


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
                    Navigate("/"); 
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
        <div className={`sidenavbar-supervisor-container ${isExpanded ? "sidenavbar-expanded" : "sidenavbar-not-expanded"}`}>
            <div className={`sidenavbar-supervisor-div-with-range-from-beginning-to-username ${isExpanded ? "sidenavbar-supervisor-div-with-range-from-beginning-to-username" : "sidenavbar-supervisor-div-with-range-from-beginning-to-username-not-expanded"}`}>
                <div className="sidenavbar-upper-of-navbar">
                    <div className="sidenavbar-supervisor-heading-of-navbar">
                    {isExpanded && (
                        <div className="sidenavbar-supervisor-nav-brand">
                            <img className="sidenavbar-supervisor-nav-img-appearance" src={AcademiaIcon} alt="" width="150" height="150" />
                        </div>
                    )}

                    <button
                        className={`sidenavbar-supervisor-hamburger-look ${isExpanded ? 'sidenavbar-supervisor-hamburger-look-in' : 'sidenavbar-supervisor-hamburger-look-out'}`}
                        onClick={() => setExpandState(!isExpanded)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div className="sidenavbar-supervisor-menu-of-navbar">
                    <ol>
                        <li>
                            <NavLink to="/startwindowsupervisor" className={`sidenavbar-supervisor-menu-item `}>
                                <img src={dashboardIcon} alt="obrazki" />
                                {isExpanded ? (<p>Start</p>) : (<p className="sidenavbar-supervisor-tooltip">Start</p>)}
                            </NavLink>
                        </li>
    
                        <li>
                            <div
                                className={`sidenavbar-supervisor-menu-item ${isMessageExpanded ? 'expanded' : ''}`}
                                onMouseEnter={handleMessageMouseEnter}
                                onMouseLeave={handleMessageMouseLeave}
                            >
                                <img src={messageIcon} alt="obrazki" />
                                {isExpanded && <p>Tematy</p>}
                                <ul className={`sidenavbar-supervisor-submenu ${isMessageExpanded ? 'expanded' : ''}`}>
                                    <li>
                                        <button className="sidenavbar-button" onClick={openAddingTopicModal}>
                                            Dodaj temat
                                        </button>
                                    </li>
                                    <li>
                                    <NavLink to="/viewalltopicssupervisor">
                                <button className="sidenavbar-button">
                                            Przeglądaj tematy
                                        </button>
                            </NavLink>
                                    </li>

                                    <li>
                                        <button className="sidenavbar-button" onClick={openGenerateTopicReportCardModalOpen}>
                                        Generuj kartę zgłoszenia tematu
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <NavLink to="/documentssupervisor" className={`sidenavbar-supervisor-menu-item`}>
                                <img src={documentIcon} alt="obrazki" />
                                {isExpanded ? (<p>Dokumenty</p>) : (<p className="sidenavbar-supervisor-tooltip">Dokumenty</p>)}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/settingssupervisor" className={`sidenavbar-supervisor-menu-item`}>
                                <img src={settingIcon} alt="obrazki" />
                                {isExpanded ? (<p>O aplikacji</p>) : (<p className="sidenavbar-supervisor-tooltip">O aplikacji</p>)}
                            </NavLink>
                        </li>
                    </ol>
                </div>
            </div>
            <div className="sidenavbar-supervisor-down-of-navbars-footer">
            {isExpanded && (
            <div className="sidenavbar-supervisor-div-with-username-and-role">
                <img src={adminAvatarIcon} alt="admin" />
                <div className="sidenavbar-supervisor-down-of-navbars-footer-info">
                <p className="sidenavbar-supervisor-down-of-navbars-footer-user-name">{getName()}</p>
                <p className="sidenavbar-supervisor-down-of-navbars-footer-user-position">Rola: promotor</p>
                </div>
            </div>
            )}

        <button className="sidenavbar-supervisor-icon-logout-button">
                <Link to="#" className="sidenavbar-supervisor-icon-of-logout" onClick={handleLogout}>
                    <img src={logoutIcon} alt="sidenavbar-supervisor-icon-of-logout" />
                </Link>
            </button>

            </div>
        </div>

        {isAddingTopicModalOpen && (
            <AddingTopicFormModalSupervisor 
                open={isAddingTopicModalOpen}
                handleClose={closeAddingTopicModal}
            />
        )}

        {isGenerateTopicReportCardModalOpen && (
            <GenerateTopicReportCardSupervisor
                open={isGenerateTopicReportCardModalOpen}
                handleClose={closeGenerateTopicReportCardModalOpen}
            />
        )}

        </div>
    );
};
