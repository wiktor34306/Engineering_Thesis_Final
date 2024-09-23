import React, {useEffect, useState, useCallback} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Login } from './components/Login/Login';
import { DocumentsAdmin } from './components/Admin/DocumentsAdmin/DocumentsAdmin';
import { SettingsAdmin } from './components/Admin/SettingsAdmin/SettingsAdmin';
import { StartWindowAdmin } from './components/Admin/StartWindowAdmin/StartWindowAdmin';
import { SupervisorRegistrationFormModalAdmin } from './components/Admin/SupervisorRegistrationFormModalAdmin/SupervisorRegistrationFormModalAdmin';
import { WorkerRegistrationFormModalAdmin } from './components/Admin/WorkerRegistrationFormModalAdmin/WorkerRegistrationFormModalAdmin';
import { AddingTopicFormModalAdmin } from './components/Admin/AddingTopicFormModalAdmin/AddingTopicFormModalAdmin';
import { ViewAllUsersAdmin } from './components/Admin/ViewAllUsersAdmin/ViewAllUsersAdmin';
import { ViewAllTopicsAdmin } from './components/Admin/ViewAllTopicsAdmin/ViewAllTopicsAdmin';
import { AddingSubjectFormModalAdmin } from './components/Admin/AddingSubjectFormModalAdmin/AddingSubjectFormModalAdmin';
import { AddingAcademicDepartmentFormModalAdmin } from './components/Admin/AddingAcademicDepartmentFormModalAdmin/AddingAcademicDepartmentFormModalAdmin';
import { AddingDepartmentFormModalAdmin } from './components/Admin/AddingDepartmentFormModalAdmin/AddingDepartmentFormModalAdmin';
import { ViewAllStructureAdmin } from './components/Admin/ViewAllStructureAdmin/ViewAllStructureAdmin';
import { StartWindowWorker } from './components/Worker/StartWindowWorker/StartWindowWorker';
import { DocumentsWorker } from './components/Worker/DocumentsWorker/DocumentsWorker';
import { StudentRegistrationFormModalAdmin } from './components/Admin/StudentRegistrationFormModalAdmin/StudentRegistrationFormModalAdmin';
import { AddingAcademicDepartmentFormModalSuperAdmin } from './components/Superadmin/AddingAcademicDepartmentFormModalSuperAdmin/AddingAcademicDepartmentFormModalSuperAdmin';
import { StartWindowSuperAdmin } from './components/Superadmin/StartWindowSuperAdmin/StartWindowSuperAdmin';
import { AddingDepartmentFormModalSuperAdmin } from './components/Superadmin/AddingDepartmentFormModalSuperAdmin/AddingDepartmentFormModalSuperAdmin';
import { AddingSubjectFormModalSuperAdmin } from './components/Superadmin/AddingSubjectFormModalSuperAdmin/AddingSubjectFormModalSuperAdmin';
import { AddingTopicFormModalSuperAdmin } from './components/Superadmin/AddingTopicFormModalSuperAdmin/AddingTopicFormModalSuperAdmin';
import { DocumentsSuperAdmin } from './components/Superadmin/DocumentsSuperAdmin/DocumentsSuperAdmin';
import { SettingsSuperAdmin } from './components/Superadmin/SettingsSuperAdmin/SettingsSuperAdmin';
import { StudentRegistrationFormModalSuperAdmin } from './components/Superadmin/StudentRegistrationFormModalSuperAdmin/StudentRegistrationFormModalSuperAdmin';
import { SupervisorRegistrationFormModalSuperAdmin } from './components/Superadmin/SupervisorRegistrationFormModalSuperAdmin/SupervisorRegistrationFormModalSuperAdmin';
import { ViewAllStructureSuperAdmin } from './components/Superadmin/ViewAllStructureSuperAdmin/ViewAllStructureSuperAdmin';
import { ViewAllTopicsSuperAdmin } from './components/Superadmin/ViewAllTopicsSuperAdmin/ViewAllTopicsSuperAdmin';
import { ViewAllUsersSuperAdmin } from './components/Superadmin/ViewAllUsersSuperAdmin/ViewAllUsersSuperAdmin';
import { WorkerRegistrationFormModalSuperAdmin } from './components/Superadmin/WorkerRegistrationFormModalSuperAdmin/WorkerRegistrationFormModalSuperAdmin';
import { StartWindowStudent } from './components/Student/StartWindowStudent/StartWindowStudent';
import { SideNavbarStudent } from './components/Student/SideNavbarStudent/SideNavbarStudent';
import { ViewAllTopicsStudent } from './components/Student/ViewAllTopicsStudent/ViewAllTopicsStudent';
import { SettingsStudent } from './components/Student/SettingsStudent/SettingsStudent';
import { SettingsWorker } from './components/Worker/SettingsWorker/SettingsWorker';
import { SideNavbarSupervisor } from './components/Supervisor/SideNavbarSupervisor/SideNavbarSupervisor';
import { AddingTopicFormModalSupervisor } from './components/Supervisor/AddingTopicFormModalSupervisor/AddingTopicFormModalSupervisor';
import { DocumentsSupervisor } from './components/Supervisor/DocumentsSupervisor/DocumentsSupervisor';
import { SettingsSupervisor } from './components/Supervisor/SettingsSupervisor/SettingsSupervisor';
import { StartWindowSupervisor } from './components/Supervisor/StartWindowSupervisor/StartWindowSupervisor';
import { ViewAllTopicsSupervisor } from './components/Supervisor/ViewAllTopicsSupervisor/ViewAllTopicsSupervisor';
import { AdminRegistrationFormModal } from './components/Superadmin/AdminRegistrationFormModal/AdminRegistrationFormModal';
import { getUserRole } from './getUserRole';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NoEntitlements } from './components/NoEntitlements/NoEntitlements';
import { EditTopicNameAdmin } from './components/Admin/EditTopicNameAdmin/EditTopicNameAdmin';
import { EditTopicNameSuperadmin } from './components/Superadmin/EditTopicNameSuperadmin/EditTopicNameSuperadmin';
import { EditTopicNameSupervisor } from './components/Supervisor/EditTopicNameSupervisor/EditTopicNameSupervisor';
import { ConfirmTopicModalStudent } from './components/Student/ConfirmTopicModalStudent/ConfirmTopicModalStudent';
import { GenerateTopicReportCardAdmin } from './components/Admin/GenerateTopicReportCardAdmin/GenerateTopicReportCardAdmin';
import { TestsPdfPreview } from './components/Admin/tests-pdf-preview/TestsPdfPreview';
import { GenerateTopicReportCardSupervisor } from './components/Supervisor/GenerateTopicReportCardSupervisor/GenerateTopicReportCardSupervisor';
import { GenerateTopicReportCardSuperadmin } from './components/Superadmin/GenerateTopicReportCardSuperadmin/GenerateTopicReportCardSuperadmin';
import { CancelChoiceModalStudent } from './components/Student/CancelChoiceModalStudent/CancelChoiceModalStudent';
import { AssignStudentToTopicSuperAdmin } from './components/Superadmin/AssignStudentToTopicSuperAdmin/AssignStudentToTopicSuperAdmin';
import { AssignStudentToTopicAdmin } from './components/Admin/AssignStudentToTopicAdmin/AssignStudentToTopicAdmin';
import { EditNameOfDepartmentAdmin } from './components/Admin/EditNameOfDepartmentAdmin/EditNameOfDepartmentAdmin';
import { EditNameOfAcademicDepartmentAdmin } from './components/Admin/EditNameOfAcademicDepartmentAdmin/EditNameOfAcademicDepartmentAdmin';
import { EditNameOfSubjectAdmin } from './components/Admin/EditNameOfSubjectAdmin/EditNameOfSubjectAdmin';
import { ConfirmWindowDeleteAcademicDepartmentAdmin } from './components/Admin/ConfirmWindowDeleteAcademicDepartmentAdmin/ConfirmWindowDeleteAcademicDepartmentAdmin';
import { ConfirmWindowDeleteDepartmentAdmin } from './components/Admin/ConfirmWindowDeleteDepartmentAdmin/ConfirmWindowDeleteDepartmentAdmin';
import { ConfirmWindowDeleteSubjectAdmin } from './components/Admin/ConfirmWindowDeleteSubjectAdmin/ConfirmWindowDeleteSubjectAdmin';
import { ConfirmWindowDeleteAcademicDepartmentSuperAdmin } from './components/Superadmin/ConfirmWindowDeleteAcademicDepartmentSuperAdmin/ConfirmWindowDeleteAcademicDepartmentSuperAdmin';
import { EditNameOfDepartmentSuperAdmin } from './components/Superadmin/EditNameOfDepartmentSuperAdmin/EditNameOfDepartmentSuperAdmin';
import { ConfirmWindowDeleteDepartmentSuperAdmin } from './components/Superadmin/ConfirmWindowDeleteDepartmentSuperAdmin/ConfirmWindowDeleteDepartmentSuperAdmin';
import { EditNameOfAcademicDepartmentSuperAdmin } from './components/Superadmin/EditNameOfAcademicDepartmentSuperAdmin/EditNameOfAcademicDepartmentSuperAdmin';
import { EditNameOfSubjectSuperAdmin } from './components/Superadmin/EditNameOfSubjectSuperAdmin/EditNameOfSubjectSuperAdmin';
import { ConfirmWindowDeleteSubjectSuperAdmin } from './components/Superadmin/ConfirmWindowDeleteSubjectSuperAdmin/ConfirmWindowDeleteSubjectSuperAdmin';
import { ConfirmWindowDeleteTopicAdmin } from './components/Admin/ConfirmWindowDeleteTopicAdmin/ConfirmWindowDeleteTopicAdmin';
import { ConfirmWindowDeleteTopicSuperAdmin } from './components/Superadmin/ConfirmWindowDeleteTopicSuperAdmin/ConfirmWindowDeleteTopicSuperAdmin';
import { ConfirmWindowDeleteTopicSupervisor } from './components/Supervisor/ConfirmWindowDeleteTopicSupervisor/ConfirmWindowDeleteTopicSupervisor';

const App = () => {
  const [role, setRole] = useState(null);

  const updateRole = (newRole) => {
    setRole(newRole);
  };

  const hasAccess = useCallback((allowedRoles) => {
    const access = allowedRoles.includes(role);

    return access;
  }, [role]);

  useEffect(() => {
    const fetchData = async () => {
      const { role } = getUserRole();
      setRole(role);

      const tokenExists = localStorage.getItem('token');
      if (tokenExists && !hasAccess(["superadministrator", "administrator", "promotor", "student", "pracownik"])) {
        // toast.error("Nie masz uprawnień do tego zasobu", {
        //   position: toast.POSITION.TOP,
        // });
      } else {
      }
    };

    fetchData();
    }, [role, hasAccess]);


  return (
      <BrowserRouter>
        <Routes>
        <Route
          path="/"
          element={<Login onLogin={(newRole) => updateRole(newRole)} />}
        />

   {/* Superadministrator */}
      {hasAccess(["superadministrator"]) && (
          <>
        <Route path="/addingacademicdepartmentformmodalsuperadmin" element={<AddingAcademicDepartmentFormModalSuperAdmin />} />
        <Route path="/adminregistrationformmodal" element={<AdminRegistrationFormModal />} />
        <Route path="/addingdepartmentformmodalsuperadmin" element={< AddingDepartmentFormModalSuperAdmin  />} />
        <Route path="/addingsubjectformmodalsuperadmin" element={< AddingSubjectFormModalSuperAdmin  />} />
        <Route path="/addingtopicformmodalsuperadmin" element={< AddingTopicFormModalSuperAdmin  />} />
        <Route path="/documentssuperadmin" element={< DocumentsSuperAdmin  />} />
        <Route path="/settingssuperadmin" element={< SettingsSuperAdmin  />} />
        <Route path="/startwindowsuperadmin" element={< StartWindowSuperAdmin  />} />
        <Route path="/studentregistrationformmodalsuperadmin" element={< StudentRegistrationFormModalSuperAdmin  />} />
        <Route path="/supervisorregistrationformmodalsuperadmin" element={< SupervisorRegistrationFormModalSuperAdmin  />} />
        <Route path="/viewallstructuresuperadmin" element={< ViewAllStructureSuperAdmin  />} />
        <Route path="/viewalltopicssuperadmin" element={< ViewAllTopicsSuperAdmin  />} />
        <Route path="/viewalluserssuperadmin" element={< ViewAllUsersSuperAdmin  />} />
        <Route path="/workerregistrationformmodalsuperadmin" element={< WorkerRegistrationFormModalSuperAdmin  />} />
        <Route path="/edittopicnamesuperadmin" element={< EditTopicNameSuperadmin  />} />
        <Route path="/generatetopicreportcardsuperadmin" element={< GenerateTopicReportCardSuperadmin  />} />
        <Route path="/assignstudenttotopicsuperadmin" element={< AssignStudentToTopicSuperAdmin  />} />
        <Route path="/confirmwindowdeleteacademicdepartmentsuperadmin" element={< ConfirmWindowDeleteAcademicDepartmentSuperAdmin  />} />
        <Route path="/confirmwindowdeletedepartmentsuperadmin" element={< ConfirmWindowDeleteDepartmentSuperAdmin  />} />
        <Route path="/editnameofdepartmentsuperadmin" element={<EditNameOfDepartmentSuperAdmin />} />
        <Route path="/editnameofacademicdepartmentsuperadmin" element={<EditNameOfAcademicDepartmentSuperAdmin />} />
        <Route path="/editnameofsubjectsuperadmin" element={<EditNameOfSubjectSuperAdmin />} />
        <Route path="/confirmwindowdeletesubjectsuperadmin" element={<ConfirmWindowDeleteSubjectSuperAdmin />} />
        <Route path="/confirmwindowdeletetopicsuperadmin" element={<ConfirmWindowDeleteTopicSuperAdmin />} />
        <Route path="*" element={<NoEntitlements />} />
        </>
        )}

        {/*Administrator*/}
        {hasAccess(["administrator"]) && (
          <>
        <Route path="/documentsadmin" element={<DocumentsAdmin />} />
        <Route path="/settingsadmin" element={<SettingsAdmin />} />
        <Route path="/startwindowadmin" element={<StartWindowAdmin />} />
        <Route path="/studentregistrationformmodaladmin" element={<StudentRegistrationFormModalAdmin />} />
        <Route path="/supervisorregistrationformmodaladmin" element={<SupervisorRegistrationFormModalAdmin />} />
        <Route path="/workerregistrationformmodaladmin" element={<WorkerRegistrationFormModalAdmin />} />
        <Route path="/addingtopicformmodaladmin" element={<AddingTopicFormModalAdmin />} />
        <Route path="/viewallusersadmin" element={<ViewAllUsersAdmin />} />
        <Route path="/viewalltopicsadmin" element={<ViewAllTopicsAdmin />} />
        <Route path="/addingsubjectformmodaladmin" element={<AddingSubjectFormModalAdmin />} />
        <Route path="/addingacademicdepartmentformmodaladmin" element={<AddingAcademicDepartmentFormModalAdmin />} />
        <Route path="/addingdepartmentformmodaladmin" element={<AddingDepartmentFormModalAdmin />} />
        <Route path="/viewallstructureadmin" element={<ViewAllStructureAdmin />} />
        <Route path="/edittopicnameadmin" element={<EditTopicNameAdmin />} />
        <Route path="/generatetopicreportcardadmin" element={<GenerateTopicReportCardAdmin />} />
        <Route path="/testspdfpreview" element={<TestsPdfPreview />} />
        <Route path="/assignstudenttotopicadmin" element={<AssignStudentToTopicAdmin />} />
        <Route path="/editnameofdepartmentadmin" element={<EditNameOfDepartmentAdmin />} />
        <Route path="/editnameofacademicdepartmentadmin" element={<EditNameOfAcademicDepartmentAdmin />} />
        <Route path="/editnameofsubjectadmin" element={<EditNameOfSubjectAdmin/>} />
        <Route path="/confirmwindowdeleteacademicdepartmentadmin" element={<ConfirmWindowDeleteAcademicDepartmentAdmin/>} />
        <Route path="/confirmwindowdeletedepartmentadmin" element={<ConfirmWindowDeleteDepartmentAdmin/>} />
        <Route path="/confirmwindowdeletesubjectadmin" element={<ConfirmWindowDeleteSubjectAdmin/>} />
        <Route path="/confirmwindowdeletetopicadmin" element={<ConfirmWindowDeleteTopicAdmin/>} />
        <Route path="*" element={<NoEntitlements />} />
        </>
        )}

        {/*Promotor*/}
        {hasAccess(["promotor"]) && (
          <>
        <Route path="/sidenavbarsupervisor" element={<SideNavbarSupervisor />} />
        <Route path="/addingtopicformmodalsupervisor" element={<AddingTopicFormModalSupervisor />} />
        <Route path="/documentssupervisor" element={<DocumentsSupervisor />} />
        <Route path="/settingssupervisor" element={<SettingsSupervisor />} />
        <Route path="/startwindowsupervisor" element={<StartWindowSupervisor />} />
        <Route path="/viewalltopicssupervisor" element={<ViewAllTopicsSupervisor />} />
        <Route path="/edittopicnamesupervisor" element={<EditTopicNameSupervisor />} />
        <Route path="/generatetopicreportcardsupervisor" element={<GenerateTopicReportCardSupervisor />} />
        <Route path="/confirmwindowdeletetopicsupervisor" element={<ConfirmWindowDeleteTopicSupervisor />} />
        <Route path="*" element={<NoEntitlements />} />
        </>
        )}

        {/*Student*/}
        {hasAccess(["student"]) && (
          <>
        <Route path="/startwindowstudent" element={<StartWindowStudent />} />
        <Route path="/sidenavbarstudent" element={<SideNavbarStudent />} />
        <Route path="/viewalltopicsstudent" element={<ViewAllTopicsStudent />} />
        <Route path="/settingsstudent" element={<SettingsStudent />} />
        <Route path="/confirmtopicmodalstudent" element={<ConfirmTopicModalStudent />} />
        <Route path="/cancelchoicemodalstudent" element={<CancelChoiceModalStudent />} />
        <Route path="*" element={<NoEntitlements />} />
        </>
        )}

        {/*Pracownik*/}
        {hasAccess(["pracownik"]) && (
          <>
        <Route path="/startwindowworker" element={<StartWindowWorker />} />
        <Route path="/documentsworker" element={<DocumentsWorker />} />
        <Route path="/settingsworker" element={<SettingsWorker />} />
        <Route path="*" element={<NoEntitlements />} />
        </>
        )}

        {!hasAccess(["superadministrator", "administrator", "promotor", "student", "pracownik"]) && (
          <Route path="*" element={<NoEntitlements />} />
        )}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;