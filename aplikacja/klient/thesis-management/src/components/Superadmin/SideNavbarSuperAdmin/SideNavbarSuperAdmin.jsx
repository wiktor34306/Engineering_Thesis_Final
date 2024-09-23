import React, { useState } from 'react';
import "./SideNavbarSuperAdminStyle.css"
import AcademiaIcon from '../../../assets/pics/logo-akademia-nauk.svg';
import dashboardIcon from '../../../assets/pics/grid.svg';
import userIcon from '../../../assets/pics/user.svg';
import messageIcon from '../../../assets/pics/message.svg';
import universityIcon from '../../../assets/pics/university.svg';
import documentIcon from '../../../assets/pics/documents.svg';
import settingIcon from '../../../assets/pics/settings.svg';
import adminAvatarIcon from '../../../assets/pics/admin-avatar.svg';
import logoutIcon from '../../../assets/pics/logout.svg';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import {AdminRegistrationFormModal} from '../AdminRegistrationFormModal/AdminRegistrationFormModal';
import {StudentRegistrationFormModalSuperAdmin} from '../StudentRegistrationFormModalSuperAdmin/StudentRegistrationFormModalSuperAdmin';
import {SupervisorRegistrationFormModalSuperAdmin} from '../SupervisorRegistrationFormModalSuperAdmin/SupervisorRegistrationFormModalSuperAdmin';
import {WorkerRegistrationFormModalSuperAdmin} from '../WorkerRegistrationFormModalSuperAdmin/WorkerRegistrationFormModalSuperAdmin';
import { AddingAcademicDepartmentFormModalSuperAdmin } from '../AddingAcademicDepartmentFormModalSuperAdmin/AddingAcademicDepartmentFormModalSuperAdmin';
import { AddingDepartmentFormModalSuperAdmin } from '../AddingDepartmentFormModalSuperAdmin/AddingDepartmentFormModalSuperAdmin';
import { AddingSubjectFormModalSuperAdmin } from '../AddingSubjectFormModalSuperAdmin/AddingSubjectFormModalSuperAdmin';
import { AddingTopicFormModalSuperAdmin } from '../AddingTopicFormModalSuperAdmin/AddingTopicFormModalSuperAdmin';
import axios from 'axios';
import { getName } from '../../../getName';
import config from '../../../config';
import { GenerateTopicReportCardSuperadmin } from '../GenerateTopicReportCardSuperadmin/GenerateTopicReportCardSuperadmin';

export const SideNavbarSuperAdmin = () => {
    const [isExpanded, setExpandState] = useState(false);
    const [isUserExpanded, setUserExpandState] = useState(false);
    const [isMessageExpanded, setMessageExpandState] = useState(false);
    const [isAdminRegistrationModalOpen, setAdminRegistrationModalOpen] = useState(false);
    const [isStudentRegistrationModalOpen, setStudentRegistrationModalOpen] = useState(false);
    const [isSupervisorRegistrationModalOpen, setSupervisorRegistrationModalOpen] = useState(false);
    const [isWorkerRegistrationModalOpen, setWorkerRegistrationModalOpen] = useState(false);
    const [isAddingTopicModalOpen, setAddingTopicModalOpen] = useState(false);
    const [isAddingDepartmentModalOpen, setAddingDepartmentModalOpen] = useState(false);
    const [isAddingAcademicDepartmentModalOpen, setAddingAcademicDepartmentModalOpen] = useState(false);
    const [isAddingSubjectModalOpen, setAddingSubjectModalOpen] = useState(false);
    const [, setUser] = useState(null);
    const Navigate = useNavigate();
    const [isGenerateTopicReportCardModalOpen, setGenerateTopicReportCardModalOpen] = useState(false);

    const handleUserMouseEnter = () => {
        setUserExpandState(true);
    }

    const handleUserMouseLeave = () => {
        setUserExpandState(false);
    }

    const handleMessageMouseEnter = () => {
        setMessageExpandState(true);
    }

    const handleMessageMouseLeave = () => {
        setMessageExpandState(false);
    }

    const openAdminRegistrationModal = () => {
        setAdminRegistrationModalOpen(true);
    };

    const closeAdminRegistrationModal = () => {
        setAdminRegistrationModalOpen(false);
    };

    const openStudentRegistrationModal = () => {
        setStudentRegistrationModalOpen(true);
    };

    const openGenerateTopicReportCardModalOpen = () => {
        setGenerateTopicReportCardModalOpen(true);
    };

    const closeGenerateTopicReportCardModalOpen = () => {
        setGenerateTopicReportCardModalOpen(false);
    };

    const closeStudentRegistrationModal = () => {
        setStudentRegistrationModalOpen(false);
    };

    const openSupervisorRegistrationModal = () => {
        setSupervisorRegistrationModalOpen(true);
    };

    const closeSupervisorRegistrationModal = () => {
        setSupervisorRegistrationModalOpen(false);
    };

    const openWorkerRegistrationModal = () => {
        setWorkerRegistrationModalOpen(true);
    };

    const closeWorkerRegistrationModal = () => {
        setWorkerRegistrationModalOpen(false);
    };

    const openAddingTopicModal = () => {
        setAddingTopicModalOpen(true);
    };

    const closeAddingTopicModal = () => {
        setAddingTopicModalOpen(false);
    };

    const openAddingDepartmentModal = () => {
        setAddingDepartmentModalOpen(true);
    };

    const closeAddingDepartmentModal = () => {
        setAddingDepartmentModalOpen(false);
    };

    const openAddingAcademicDepartmentModal = () => {
        setAddingAcademicDepartmentModalOpen(true);
    };

    const closeAddingAcademicDepartmentModal = () => {
        setAddingAcademicDepartmentModalOpen(false);
    };

    const openAddingSubjectModal = () => {
        setAddingSubjectModalOpen(true);
    };

    const closeAddingSubjectModal = () => {
        setAddingSubjectModalOpen(false);
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
        <div className={`sidenavbar-super-admin-container ${isExpanded ? "sidenavbar-expanded" : "sidenavbar-not-expanded"}`}>
            <div className={`sidenavbar-super-admin-div-with-range-from-beginning-to-username ${isExpanded ? "sidenavbar-super-admin-div-with-range-from-beginning-to-username" : "sidenavbar-super-admin-div-with-range-from-beginning-to-username-not-expanded"}`}>
                <div className="sidenavbar-upper-of-navbar">
                    <div className="sidenavbar-super-admin-heading-of-navbar">
                    {isExpanded && (
                        <div className="sidenavbar-super-admin-nav-brand">
                            <img className="sidenavbar-super-admin-nav-img-appearance" src={AcademiaIcon} alt="" width="150" height="150" />
                        </div>
                    )}

                    <button
                        className={`sidenavbar-super-admin-hamburger-look ${isExpanded ? 'sidenavbar-super-admin-hamburger-look-in' : 'sidenavbar-super-admin-hamburger-look-out'}`}
                        onClick={() => setExpandState(!isExpanded)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div className="sidenavbar-super-admin-menu-of-navbar">
                    <ol>
                        <li>
                            <NavLink to="/startwindowsuperadmin" className={`sidenavbar-super-admin-menu-item `}>
                                <img src={dashboardIcon} alt="obrazki" />
                                {isExpanded ? (<p>Start</p>) : (<p className="sidenavbar-super-admin-tooltip">Start</p>)}
                            </NavLink>
                        </li>
                        <li>
                            <div
                                className={`sidenavbar-super-admin-menu-item ${isUserExpanded ? 'expanded' : ''}`}
                                onMouseEnter={handleUserMouseEnter}
                                onMouseLeave={handleUserMouseLeave}
                            >
                                <img src={universityIcon} alt="obrazki" />
                                {isExpanded && <p>Struktura uczelni</p>}
                                <ul className={`sidenavbar-super-admin-submenu ${isUserExpanded ? 'expanded' : ''}`}>
                                    <li>
                                        <button className="sidenavbar-button" onClick={openAddingDepartmentModal}>
                                            Dodaj wydział
                                        </button>
                                    </li>
                                    <li>
                                        <button className="sidenavbar-button" onClick={openAddingAcademicDepartmentModal}>
                                            Dodaj katedrę
                                        </button>
                                    </li>
                                    <li>
                                        <button className="sidenavbar-button" onClick={openAddingSubjectModal}>
                                            Dodaj kierunek
                                        </button>
                                    </li>
                                    <li>
                                    <NavLink to="/viewallstructuresuperadmin">
                                <button className="sidenavbar-button">
                                            Przeglądaj strukturę
                                        </button>
                            </NavLink>
                                    </li>
                                    
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div
                                className={`sidenavbar-super-admin-menu-item ${isUserExpanded ? 'expanded' : ''}`}
                                onMouseEnter={handleUserMouseEnter}
                                onMouseLeave={handleUserMouseLeave}
                            >
                                <img src={userIcon} alt="obrazki" />
                                {isExpanded && <p>Użytkownicy</p>}
                                <ul className={`sidenavbar-super-admin-submenu ${isUserExpanded ? 'expanded' : ''}`}>
                                    <li>
                                        <button className="sidenavbar-button" onClick={openAdminRegistrationModal}>
                                            Dodaj administratora
                                        </button>
                                    </li>
                                    <li>
                                        <button className="sidenavbar-button" onClick={openStudentRegistrationModal}>
                                            Dodaj studenta
                                        </button>
                                    </li>
                                    <li>
                                        <button className="sidenavbar-button" onClick={openSupervisorRegistrationModal}>
                                            Dodaj promotora
                                        </button>
                                    </li>
                                    <li>
                                        <button className="sidenavbar-button" onClick={openWorkerRegistrationModal}>
                                            Dodaj pracownika
                                        </button>
                                    </li>
                                    <li>
                                    <NavLink to="/viewalluserssuperadmin">
                                <button className="sidenavbar-button">
                                            Przeglądaj użytkowników
                                        </button>
                            </NavLink>
                                    </li>
                                    
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div
                                className={`sidenavbar-super-admin-menu-item ${isMessageExpanded ? 'expanded' : ''}`}
                                onMouseEnter={handleMessageMouseEnter}
                                onMouseLeave={handleMessageMouseLeave}
                            >
                                <img src={messageIcon} alt="obrazki" />
                                {isExpanded && <p>Tematy</p>}
                                <ul className={`sidenavbar-super-admin-submenu ${isMessageExpanded ? 'expanded' : ''}`}>
                                    <li>
                                        <button className="sidenavbar-button" onClick={openAddingTopicModal}>
                                            Dodaj temat
                                        </button>
                                    </li>
                                    <li>
                                    <NavLink to="/viewalltopicssuperadmin">
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
                            <NavLink to="/documentssuperadmin" className={`sidenavbar-super-admin-menu-item`}>
                                <img src={documentIcon} alt="obrazki" />
                                {isExpanded ? (<p>Dokumenty</p>) : (<p className="sidenavbar-super-admin-tooltip">Dokumenty</p>)}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/settingssuperadmin" className={`sidenavbar-super-admin-menu-item`}>
                                <img src={settingIcon} alt="obrazki" />
                                {isExpanded ? (<p>O aplikacji</p>) : (<p className="sidenavbar-super-admin-tooltip">O aplikacji</p>)}
                            </NavLink>
                        </li>
                    </ol>
                </div>
            </div>
            <div className="sidenavbar-super-admin-down-of-navbars-footer">
            {isExpanded && (
            <div className="sidenavbar-super-admin-div-with-username-and-role">
                <img src={adminAvatarIcon} alt="admin" />
                <div className="sidenavbar-super-admin-down-of-navbars-footer-info">
                <p className="sidenavbar-super-admin-down-of-navbars-footer-user-name">{getName()}</p>
                <p className="sidenavbar-super-admin-down-of-navbars-footer-user-position">Rola: super administrator</p>
                </div>
            </div>
            )}

            <button className="sidenavbar-super-admin-icon-logout-button">
                <Link to="#" className="sidenavbar-super-admin-icon-of-logout" onClick={handleLogout}>
                    <img src={logoutIcon} alt="sidenavbar-super-admin-icon-of-logout" />
                </Link>
            </button>

            </div>
        </div>

        {isAdminRegistrationModalOpen && (
            <AdminRegistrationFormModal
                open={isAdminRegistrationModalOpen}
                handleClose={closeAdminRegistrationModal}
            />
        )}

        {isStudentRegistrationModalOpen && (
            <StudentRegistrationFormModalSuperAdmin 
                open={isStudentRegistrationModalOpen}
                handleClose={closeStudentRegistrationModal}
            />
        )}

        {isSupervisorRegistrationModalOpen && (
            <SupervisorRegistrationFormModalSuperAdmin 
                open={isSupervisorRegistrationModalOpen}
                handleClose={closeSupervisorRegistrationModal}
            />
        )}

        {isWorkerRegistrationModalOpen && (
            <WorkerRegistrationFormModalSuperAdmin 
                open={isWorkerRegistrationModalOpen}
                handleClose={closeWorkerRegistrationModal}
            />
        )}

        {isGenerateTopicReportCardModalOpen && (
            <GenerateTopicReportCardSuperadmin
                open={isGenerateTopicReportCardModalOpen}
                handleClose={closeGenerateTopicReportCardModalOpen}
            />
        )}

        {isAddingTopicModalOpen && (
            <AddingTopicFormModalSuperAdmin
                open={isAddingTopicModalOpen}
                handleClose={closeAddingTopicModal}
            />
        )}

        {isAddingDepartmentModalOpen && (
            <AddingDepartmentFormModalSuperAdmin 
                open={isAddingDepartmentModalOpen}
                handleClose={closeAddingDepartmentModal}
            />
        )}

        {isAddingAcademicDepartmentModalOpen && (
            <AddingAcademicDepartmentFormModalSuperAdmin 
                open={isAddingAcademicDepartmentModalOpen}
                handleClose={closeAddingAcademicDepartmentModal}
            />
        )}

        {isAddingSubjectModalOpen && (
            <AddingSubjectFormModalSuperAdmin
                open={isAddingSubjectModalOpen}
                handleClose={closeAddingSubjectModal}
            />
        )}
        </div>
    );
};
