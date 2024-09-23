import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Login } from '../../src/components/Login/Login';

test('updates state on email and password input change', () => {
    const { getByPlaceholderText } = render(
        <Router>
          <Login />
        </Router>
      );
  
  const emailInput = getByPlaceholderText('Adres e-mail');
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  expect(emailInput.value).toBe('test@example.com');

  const passwordInput = getByPlaceholderText('Hasło');
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  expect(passwordInput.value).toBe('password123');
});
