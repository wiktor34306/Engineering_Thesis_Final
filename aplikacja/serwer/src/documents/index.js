module.exports = ({ presentDate, academicYear, submitter,
    selectedAcademicDepartment, topic, additionalInformation, 
    describeTopic, amountOfStudents, selectedSubject, expectedCosts, selectedDepartment }) => { 
const date = new Date(presentDate);

const monthNames = [
   "stycznia", 
   "lutego", 
   "marca", 
   "kwietnia", 
   "maja", 
   "czerwca", 
   "lipca", 
   "sierpnia", 
   "września", 
   "października", 
   "listopada", 
   "grudnia"];

const formattedDate = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();

   return `
<!doctype html>
<html>
   <head>
      <meta charset="utf-8">
      <title>Karta zgłoszenia tematu</title>
      <style>

		#header-container {
			display: flex;
         width: 100%;
         overflow:auto;
		}
		
		#header-div1 {
		width: 50%;
      float:left;
		}
		
		#header-div2 {
         color: blue;
         float: left;
         font-weight: bold;
         font-size: 12pt;
         padding-top:30px;
         text-align: right;
         width: 50%;
         font-family: "Bookman Old Style", Georgia, serif;
		}
		
        #container {
           margin-top: 2%;
           margin-left: 15%;
           margin-right: 15%;
           font-family: Book Antiqua,Palatino,Palatino Linotype,Palatino LT STD,Georgia,serif;
        }


        #date {
         display: flex;
         justify-content: flex-end;
         text-align: right
        }

        #header {
           text-transform: uppercase;
           display: flex; 
           font-size: 16pt;
           font-weight: bold;
           justify-content: center;
           align-content: center;
           align-items: center;
           text-align: center;
        }
		
		#p-with-annex {
		font-size: 10pt;
		}
		
		#p-submitter {
		font-size: 7.5pt;
		text-align: center;
		}
		
		#signatures {
		width: 100%;
		margin-top: 110px;
		margin-bottom: 110px;
      overflow:auto;
		}
		
		#signatures1 {
      float: left;
		width: 50%;
		}
		
		#signatures2 {
      float: left;
		text-align:center;
		width: 50%;
		}
		
		#signatures-size {
		font-size: 9pt;
		}
		
		#footer {
      font-size: 10pt;
		display: block;
		text-align: center;
		}
		
		#info {
		height: 70%;
		}

        </style>
   </head>
   <body>
     <div id="container">
	 <div id="info">
	   <div id="header-container">
	   <div id="header-div1"><img src="https://anstar.edu.pl/wp-content/themes/tarnowp/img/logo-akademia-nauk.svg" alt="logo_uczelni_at"></div>
	   <div id="header-div2">Wydział ${selectedDepartment}</div>
	   </div>
	   <p id="p-with-annex"><b>Załącznik 1</b> Wzór formularza zgłoszenia tematu pracy dyplomowej</p>
     <div id="date">Tarnów, dnia ${formattedDate}</div><br><br>
     <div id="header">Formularz zgłoszenia<br>
        tematu pracy dyplomowej<br>
        na rok akademicki ${academicYear}</div><br><br>
     <div>Zgłaszający: ${submitter}
	 <p id="p-submitter">Tytuł/stopień, Imię i Nazwisko</p><br><br>
     Katedra: <b>${selectedAcademicDepartment}</b> <br><br>
     Temat: ${topic} <br><br>
     Opis tematu (zakres pracy):<br>
     ${describeTopic}
	 <br><br>
	 Informacje dodatkowe (np. literatura, narzędzia, wymagania itp.):<br>
	 ${additionalInformation}
     <br><br>
     Proponowany temat dedykowany jest dla <b>${amountOfStudents} studenta/studentów</b><br><br>
     kierunku <b>${selectedSubject}</b><br><br>
     Przewidywane koszty: ${expectedCosts}
     </div>
     <div><br><br>
	 <div id="signatures">
	 <div id="signatures1">
	 <p>......................................................</p>
	 <p id="signatures-size">podpis zgłaszającego</p>
	 </div>
	 <div id="signatures2">
	 <p>......................................................</p>
	 <p id="signatures-size">podpis Kierownika Katedry</p>
	 </div>
	 </div>
     </div>
	 </div>
	 <div id="footer">
	 Ul. Adama Mickiewicza 8, 33-100 Tarnów, tel. 14 63 16 510, 511, www.anstar.edu.pl, wp@anstar.edu.pl
	 </div>
  </div>
   </body>
</html>
    `;
};