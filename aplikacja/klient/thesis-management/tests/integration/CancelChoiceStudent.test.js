import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { CancelChoiceModalStudent } from '../../src/components/Student/CancelChoiceModalStudent/CancelChoiceModalStudent';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('react-toastify');

global.window = Object.create(window);
const { location } = window;
delete global.window.location;
global.window.location = Object.assign({}, location);
global.window.location.reload = jest.fn();

describe('CancelChoiceModalStudent', () => {
  const mockHandleClose = jest.fn();
  const mockCancelReservation = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all expected elements and calls functions on button clicks', async () => {
    const { getByText } = render(
        <Router>
      <CancelChoiceModalStudent
        isOpen={true}
        handleClose={mockHandleClose}
        cancelReservation={mockCancelReservation}
      />
      </Router>
    );

    expect(getByText('Anulowanie rezerwacji')).toBeInTheDocument();
    expect(getByText('Czy jesteś pewien?')).toBeInTheDocument();
    expect(getByText('Tak')).toBeInTheDocument();
    expect(getByText('Anuluj')).toBeInTheDocument();

    fireEvent.click(getByText('Tak'));
    expect(mockCancelReservation).toHaveBeenCalled();

    fireEvent.click(getByText('Anuluj'));
    expect(mockHandleClose).toHaveBeenCalled();
  });
});
