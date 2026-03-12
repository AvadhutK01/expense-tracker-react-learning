import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import ProfileForm from './ProfileForm';

const renderWithProviders = (ui) => {
    const store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: { auth: { token: 'test-token' } }
    });
    return render(<Provider store={store}>{ui}</Provider>);
};

describe('ProfileForm Component', () => {
    const userData = { email: 'test@example.com', displayName: 'Test User', photoUrl: '' };

    it('19. should render Update Profile heading when open', () => {
        renderWithProviders(
            <ProfileForm isOpen={true} onClose={() => { }} userData={userData} onUpdate={() => { }} />
        );
        expect(screen.getByText('Update Profile')).toBeInTheDocument();
    });

    it('20. should call onClose when cancel button is clicked', () => {
        const handleClose = vi.fn();
        renderWithProviders(
            <ProfileForm isOpen={true} onClose={handleClose} userData={userData} onUpdate={() => { }} />
        );

        const cancelBtn = screen.getByText('Cancel');
        fireEvent.click(cancelBtn);
        expect(handleClose).toHaveBeenCalled();
    });
});
