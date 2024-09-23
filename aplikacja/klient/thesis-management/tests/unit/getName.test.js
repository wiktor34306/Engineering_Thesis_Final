import { getName } from '../../src/getName';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode');

describe('getName', () => {
  afterEach(() => {
    localStorage.clear();
    jest.resetAllMocks(); 
  });

  it('should return undefined if there is no token', () => {
    expect(getName()).toEqual(undefined);
  });

  it('should decode the token and return the user name', () => {
    const mockToken = 'test-mock-token';
    const mockName = 'test-mock-name';

    localStorage.setItem('token', mockToken);

    jwtDecode.mockReturnValueOnce({ imie: mockName });

    expect(getName()).toEqual(mockName);
    expect(jwtDecode).toHaveBeenCalledWith(mockToken);
  });
});
