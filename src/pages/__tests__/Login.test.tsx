import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import LoginPage from '../Login';

vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn(),
}));

describe('Login Page', () => {
  it('renders the login form', () => {
    useAuthStore.mockReturnValue({ login: vi.fn(), loading: false });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors', async () => {
    useAuthStore.mockReturnValue({ login: vi.fn(), loading: false });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(await screen.findByText(/password too short/i)).toBeInTheDocument();
  });

  it('calls login on form submit', async () => {
    const mockLogin = vi.fn();
    useAuthStore.mockReturnValue({ login: mockLogin, loading: false });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});