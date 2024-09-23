import React from "react";
import './FooterStyle.css';
import FacebookIcon from '../../assets/pics/fb.svg';
import InstagramIcon from '../../assets/pics/ig.svg';
import YoutubeIcon from '../../assets/pics/yt.svg';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from "../../getUserRole";

  export const Footer = () => {
    const navigate = useNavigate();
  
    const handleNavigationToMainPage = () => {
      const { role } = getUserRole();
      switch (role) {
        case 'promotor':
          navigate('/startwindowsupervisor');
          break;
        case 'student':
          navigate('/startwindowstudent');
          break;
        case 'administrator':
          navigate('/startwindowadmin');
          break;
        case 'superadministrator':
          navigate('/startwindowsuperadmin');
          break;
        case 'pracownik':
          navigate('/startwindowworker');
          break;
        default:
          break;
      }
  };
  

  return (
    <div className="footer">
        <div className="main_footer padding_of_footer">
          <div className="div_with_links">
            <div className="columns_with_links">
              <h4>Kontakt</h4>
              <p>Akademia Tarnowska<br />
              ul.Mickiewicza 8<br />
              33-100 Tarnów
              </p>
              <p>telefon: 14 63 16 620<br />
              adres e-mail: ans@anstar.edu.pl
              </p>
              </div>

              <div className="columns_with_links">
                <h4>Menu</h4>
                <button onClick={handleNavigationToMainPage} className="footer-button-a"><p>Strona główna</p></button>
              </div>
              <div className="columns_with_links">
                <h4>O uczelni</h4>
                <a href="https://anstar.edu.pl/"  className="footer-a" target="_blank" rel="noreferrer"><p>Przejdź na stronę uczelni</p></a>
              </div>
              <div className="columns_with_links">
                <h4>Media społecznościowe</h4>
                <div className="flex-container">
                <a href="https://m.facebook.com/AKADEMIATARNOWSKA" className="footer-a" target="_blank" rel="noreferrer" title="facebook"><div><img src={FacebookIcon} alt="Facebook" /></div></a>
                <a href="https://www.youtube.com/user/PWSZwTarnowie/featured" target="_blank" className="footer-a" rel="noreferrer" title="youtube"><div><img src={YoutubeIcon} alt="Youtube" /></div></a>
                <a href="https://www.instagram.com/akademia.tarnowska/" target="_blank" className="footer-a" rel="noreferrer" title="instagram"><div><img src={InstagramIcon} alt="Instagram" /></div></a>
                </div>
              </div>
            
          </div>
          <hr></hr>
          <div className="right_div_below_line">
            <div className="left_div_below_line">
              <p>
              ©{new Date().getFullYear()} Wiktor Markowicz. Wszelkie prawa zastrzeżone
              </p>
            </div>
            <div className="right_div_below_line-links">
            <a href="https://bip.atar.edu.pl/" className="footer-a" title="BIP" rel="noreferrer"><div><p>BIP</p></div></a>
            </div>
          </div>
        </div>
    </div>
  )
}