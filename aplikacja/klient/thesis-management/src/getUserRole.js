import { jwtDecode } from 'jwt-decode';

export const getUserRole = () => {
  if (!localStorage.getItem('token')) {
    return {};
  }

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);

  const role = decodedToken.rola ?? '';
  return {
    role: role,
  };
};