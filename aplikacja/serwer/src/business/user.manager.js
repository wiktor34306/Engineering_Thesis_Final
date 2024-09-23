import UserDAO from '../DAO/userDAO';
import PasswordDAO from '../DAO/passwordDAO';
import TokenDAO from '../DAO/tokenDAO';
import applicationException from '../service/applicationException';
import bcrypt from 'bcrypt';


function create(context) {
  async function authenticate(adres_email, haslo) {
    let userData;
    try {
      const user = await UserDAO.getUserByEmail(adres_email);
      if (!user) {
        throw applicationException.new(applicationException.UNAUTHORIZED, 'Użytkownik z tym adresem e-mail nie istnieje');
      }
  
      userData = user;

      const isPasswordValid = await bcrypt.compare(haslo, userData.haslo);
      if (!isPasswordValid) {
        throw applicationException.new(applicationException.UNAUTHORIZED, 'Nieprawidłowe hasło');
      }
  
      const token = await TokenDAO.createToken(userData);
      return token;
    } catch (error) {
      console.error('Jesteś w user.manager, 159 lin: authenticate - Error:', error);
      throw error;
    }
  }

  async function createNewOrUpdate(userData) {
    const user = await UserDAO.createNewOrUpdate(userData);
    if (userData.haslo) {
      await PasswordDAO.createOrUpdate({ id_uzytkownika: user.id_uzytkownika, haslo: userData.haslo });
    }

    return user;
  }

  async function removeHashSession(id_uzytkownika) {
    return await TokenDAO.remove(id_uzytkownika);
  }

  return {
    authenticate: authenticate,
    createNewOrUpdate: createNewOrUpdate,
    removeHashSession: removeHashSession
  };
}

export const userManager = create();