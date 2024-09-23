import userEndpoint from './user.endpoint';
import adminEndpoint from './admin.endpoint';
import departmentEndpoint from './department.endpoint';
import academicDepartmentEndpoint from './academicDepartment.endpoint';
import subjectEndpoint from './subject.endpoint';
import studentEndpoint from './student.endpoint';
import supervisorEndpoint from './supervisor.endpoint';
import workerEndpoint from './worker.endpoint';
import topicEndpoint from './topic.endpoint';
import loginEndpoint from './login.endpoint';
import generatePdfEndpoint from './generatePdf.endpoint';

const routes = function (router)
{
  userEndpoint(router);
  adminEndpoint(router);
  departmentEndpoint(router);
  academicDepartmentEndpoint(router);
  subjectEndpoint(router);
  studentEndpoint(router);
  supervisorEndpoint(router);
  topicEndpoint(router);
  workerEndpoint(router);
  loginEndpoint(router);
  generatePdfEndpoint(router);
};

export default routes;