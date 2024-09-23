import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import {ViewAllTopicsSuperAdmin} from "../../src/components/Superadmin/ViewAllTopicsSuperAdmin/ViewAllTopicsSuperAdmin"
import * as getUserIdModule from '../../src/getUserId';
import '@testing-library/jest-dom';

jest.mock('../../src/getUserId');

const mockFetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      {
        id_tematu: '1',
        temat: 'Testowy temat',
        stopien_naukowy: 'dr',
        imie_promotora: 'Jan',
        nazwisko_promotora: 'Kowalski',
        nazwa_katedry: 'Informatyka',
        imie_studenta: 'Adam',
        nazwisko_studenta: 'Nowak',
      },
    ]),
  })
);

global.fetch = mockFetch;

describe('ViewAllTopicsSuperAdmin', () => {
  test('opens the edit modal when the "Edytuj nazwę" button is clicked', async () => {
    getUserIdModule.getUserId = jest.fn(() => 'testUserId');
    const { getByText, findByText } = render(
      <Router>
        <ViewAllTopicsSuperAdmin />
      </Router>
    );

    // Symulacja załadowania tematu
    await findByText('Testowy temat');

    const editButton = getByText('Edytuj nazwę');
    fireEvent.click(editButton);

    // Sprawdź, czy modal jest otwarty
    const modal = await findByText(/edytuj nazwę/i);
    expect(modal).toBeInTheDocument();
  });
});
