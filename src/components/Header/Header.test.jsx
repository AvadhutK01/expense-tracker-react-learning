import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import Header from './Header';
import axios from 'axios';

vi.mock('axios');

const renderWithProviders = (ui, { preloadedState = {} } = {}) => {
    const store = configureStore({
        reducer: { auth: authReducer },
        preloadedState,
    });
    return render(<Provider store={store}>{ui}</Provider>);
};

describe('Header Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        axios.post.mockResolvedValue({ data: { users: [{ email: 'test@example.com' }] } });
    });

    it('5. should render the application title', async () => {
        renderWithProviders(<Header />);
        expect(screen.getByText('ExpenseTracker')).toBeInTheDocument();
    });

    it('6. should show Logout button when token exists', async () => {
        renderWithProviders(<Header />, {
            preloadedState: { auth: { token: 'fake-token', isLoggedIn: true } }
        });
        const logoutBtn = await screen.findByRole('button', { name: /logout/i });
        expect(logoutBtn).toBeInTheDocument();
    });
});
