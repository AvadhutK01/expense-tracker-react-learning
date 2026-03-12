import { describe, it, expect, beforeEach, vi } from 'vitest';
import authReducer, { authActions } from './authSlice';

describe('authSlice', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('1. should handle login', () => {
        const initialState = { token: null, userId: null, isLoggedIn: false, isPremium: false };
        const payload = { token: 'test-token', userId: 'user-123' };
        const state = authReducer(initialState, authActions.login(payload));

        expect(state.token).toBe('test-token');
        expect(state.userId).toBe('user-123');
        expect(state.isLoggedIn).toBe(true);
        expect(localStorage.getItem('token')).toBe('test-token');
    });

    it('2. should handle logout', () => {
        const initialState = { token: 'token', userId: 'uid', isLoggedIn: true, isPremium: true };
        const state = authReducer(initialState, authActions.logout());

        expect(state.token).toBe(null);
        expect(state.userId).toBe(null);
        expect(state.isLoggedIn).toBe(false);
        expect(state.isPremium).toBe(false);
        expect(localStorage.getItem('token')).toBe(null);
    });

    it('11. should handle activatePremium', () => {
        const initialState = { token: 'token', userId: 'uid', isLoggedIn: true, isPremium: false };
        const state = authReducer(initialState, authActions.activatePremium());

        expect(state.isPremium).toBe(true);
        expect(localStorage.getItem('isPremium')).toBe('true');
    });
});
