
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Mocking external Firebase authentication calls
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn()
}));

const mockUserCredential = {
  user: {
    uid: 'someUID',
    email: 'test@email.com',
    getIdToken: jest.fn().mockResolvedValue('fakeToken'),
 
  },
}

// mockedSignInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

const mockedSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>;

describe('Login component', () => {
  
  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });
  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<Login />);
  });

  test('login button is present', () => {
    const { getByText } = render(<Login />);
    const loginButton = getByText(/login/i);
    expect(loginButton).toBeInTheDocument();
  });

  test('email and password inputs are present', () => {
    const { getByPlaceholderText } = render(<Login />);
    const emailInput = getByPlaceholderText(/email/i);
    const passwordInput = getByPlaceholderText(/password/i);
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });


  // test('login button triggers login logic when clicked', async () => {
  //   mockedSignInWithEmailAndPassword.mockResolvedValue({}); // Mock successful login

  //   const { getByText, getByPlaceholderText } = render(<Login />);
    
  //   const emailInput = getByPlaceholderText(/email/i);
  //   const passwordInput = getByPlaceholderText(/password/i);
  //   const loginButton = getByText(/login/i);

  //   fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
  //   fireEvent.change(passwordInput, { target: { value: 'password123' } });
  //   fireEvent.click(loginButton);

  //   await waitFor(() => {
  //     expect(mockedSignInWithEmailAndPassword).toHaveBeenCalled();
  //   });
  // });
  // test('login button triggers login logic when clicked', async () => {
  //   mockedSignInWithEmailAndPassword.mockResolvedValue(mockUserCredential); // Mock successful login

  //   const { getByText, getByPlaceholderText } = render(<Login />);
    
  //   const emailInput = getByPlaceholderText(/email/i);
  //   const passwordInput = getByPlaceholderText(/password/i);
  //   const loginButton = getByText(/login/i);

  //   fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
  //   fireEvent.change(passwordInput, { target: { value: 'password123' } });
  //   fireEvent.click(loginButton);

  //   await waitFor(() => {
  //     expect(mockedSignInWithEmailAndPassword).toHaveBeenCalled();
  //   });
  // });
  // Add more tests as needed...
});

