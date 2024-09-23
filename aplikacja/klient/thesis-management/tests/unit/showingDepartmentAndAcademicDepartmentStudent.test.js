import React from 'react';
import { render, screen } from '@testing-library/react';
import { StartWindowStudent } from '../../src/components/Student/StartWindowStudent/StartWindowStudent';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ kierunek: '', katedra: '' }),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

test('should have correct initial state', async () => {
  render(
    <Router>
      <StartWindowStudent />
    </Router>
  );
  
  await screen.findByText('Jesteś studentem kierunku');
  await screen.findByText('Na katedrze');

  expect(screen.getByText('Jesteś studentem kierunku')).toBeInTheDocument();
  expect(screen.getByText('Na katedrze')).toBeInTheDocument();
});
