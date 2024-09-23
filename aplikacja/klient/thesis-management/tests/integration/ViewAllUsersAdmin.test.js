import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ViewAllUsersAdmin } from '../../src/components/Admin/ViewAllUsersAdmin/ViewAllUsersAdmin';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

describe('ViewAllUsersAdmin', () => {
  global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { id_uzytkownika: 1, imie: 'Jan', nazwisko: 'Kowalski', adres_email: 'jankowalski@atar.edu.pl', rola: 'administrator' },
      { id_uzytkownika: 2, imie: 'Anna', nazwisko: 'Nowak', adres_email: 'annanowak@atar.edu.pl', rola: 'promotor' },
    ]),
  })
);

  it('renders all expected elements', async () => {
    let getByText;
    await act(async () => {
      const renderResult = render(
        <Router>
          <ViewAllUsersAdmin />
        </Router>
      );
      getByText = renderResult.getByText;
    });

    expect(getByText('Zobacz wszystkich użytkowników')).toBeInTheDocument();
    expect(getByText('Wyszukaj:')).toBeInTheDocument();
    expect(getByText('Id użytkownika')).toBeInTheDocument();
    expect(getByText('Imię')).toBeInTheDocument();
    expect(getByText('Nazwisko')).toBeInTheDocument();
    expect(getByText('Adres e-mail')).toBeInTheDocument();
    expect(getByText('Rola')).toBeInTheDocument();
  });
});
