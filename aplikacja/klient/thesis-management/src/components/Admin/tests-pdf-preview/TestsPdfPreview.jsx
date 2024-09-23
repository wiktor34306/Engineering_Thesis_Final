import React from 'react';

export const TestsPdfPreview = ({ presentDate, academicYear, submitter, selectedAcademicDepartment, topic, describeTopic, amountOfStudents, selectedSubject, expectedCosts }) => {
  const containerStyle = {
    marginTop: '4%',
    marginLeft: '25%',
    marginRight: '25%',
    fontFamily: 'Book Antiqua,Palatino,Palatino Linotype,Palatino LT STD,Georgia,serif',
  };

  const dateStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
  };

  const headerStyle = {
    textTransform: 'uppercase',
    display: 'flex',
    fontSize: '16pt',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={dateStyle}>Tarnów, dnia 2023-12-13</div>
      <br />
      <div style={headerStyle}>
        Formularz zgłoszenia<br />
        tematu pracy dyplomowej<br />
        na rok akademicki {academicYear}
      </div>
      <br /><br />
      <div>
        Zgłaszający: {submitter}<br /><br />
        Katedra: <b>{selectedAcademicDepartment}</b> <br /><br />
        Temat: {topic} <br /><br />
        Opis tematu (zakres pracy):<br />
        {describeTopic}
        <br /><br />
        Proponowany temat dedykowany jest dla <b>{amountOfStudents} studenta/studentów</b><br /><br />
        kierunku <b>{selectedSubject}</b><br /><br />
        Przewidywane koszty: {expectedCosts}
      </div>
      <div><br /><br /></div>
    </div>
  );
};