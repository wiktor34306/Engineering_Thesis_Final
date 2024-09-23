import { getUserId } from '../../src/getUserId';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode');

describe('getUserId', () => {
  afterEach(() => {
    localStorage.clear();
    jest.resetAllMocks(); 
  });

  it('should return an empty string if there is no token', () => {
    expect(getUserId()).toEqual('');
  });

  it('should decode the token and return the user id', () => {
    const mockToken = 'test-mock-token';
    const mockUserId = 'test-mock-id';

    localStorage.setItem('token', mockToken);

    jwtDecode.mockReturnValueOnce({ id_uzytkownika: mockUserId });

    expect(getUserId()).toEqual(mockUserId);
    expect(jwtDecode).toHaveBeenCalledWith(mockToken);
  });
});