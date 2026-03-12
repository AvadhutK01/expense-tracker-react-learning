import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import Auth from './Auth';

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
});
