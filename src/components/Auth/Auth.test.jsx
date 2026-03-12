import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import Auth from './Auth';

import axios from 'axios';

vi.mock('axios');

const renderWithProviders = (ui) => {
    const store = configureStore({
        reducer: { auth: authReducer },
    });
    return render(
        <Provider store={store}>
            <MemoryRouter>
                {ui}
            </MemoryRouter>
        </Provider>
    );
};

describe('Auth Component', () => {
    it('7. should render Welcome Back heading by default', () => {
        renderWithProviders(<Auth />);
        expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    });

    it('8. should switch to Create Account when toggle is clicked', () => {
        renderWithProviders(<Auth />);
        const toggleBtn = screen.getByText('Sign Up');
        fireEvent.click(toggleBtn);
        expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    });

    it('15. should display error message on registration failure', async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: { error: { message: 'EMAIL_EXISTS' } } }
        });
        renderWithProviders(<Auth />);

        fireEvent.click(screen.getByText('Sign Up'));

        fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        const errorMsg = await screen.findByText(/EMAIL EXISTS/i);
        expect(errorMsg).toBeInTheDocument();
    });

    it('16. should show Forgot Password form when reset link is clicked', () => {
        renderWithProviders(<Auth />);
        const forgotBtn = screen.getByText('Forgot Password?');
        fireEvent.click(forgotBtn);
        expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
        expect(screen.getByText('Send Reset Link')).toBeInTheDocument();
    });
});
