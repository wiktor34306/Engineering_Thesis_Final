import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SideNavbarSupervisor } from '../../src/components/Supervisor/SideNavbarSupervisor/SideNavbarSupervisor';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import config from '../../src/config';

jest.mock('axios');
jest.mock('jwt-decode');

jwtDecode.mockImplementation(() => ({ id_uzytkownika: '10' }));

describe('SideNavbarSupervisor', () => {
  it('handles logout', async () => {
    const mockToken = 'eyJpZF91enl0a293bmlrYSI6MSwicm9sYSI6InN1cGVyYWRtaW5pc3RyYXRvciIsImltaWUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzA2NDU0NDQ3LCJleHAiOjE3MDY0NTgwNDd9';
    localStorage.setItem('token', mockToken);

    const mockResponse = { status: 202 };
    axios.delete.mockResolvedValueOnce(mockResponse);

    const { getByAltText } = render(
      <Router>
        <SideNavbarSupervisor />
      </Router>
    );

    const logoutButton = getByAltText('sidenavbar-supervisor-icon-of-logout');
    fireEvent.click(logoutButton);

    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
    expect(axios.delete).toHaveBeenCalledWith(`${config.BASE_URL}/logout/10`);
  });

  afterEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });
});