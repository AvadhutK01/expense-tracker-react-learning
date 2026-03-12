import { describe, it, expect } from 'vitest';
import themeReducer, { themeActions } from './themeSlice';

describe('themeSlice', () => {
    it('4. should handle toggleTheme', () => {
        const initialState = { darkMode: false };
        const state = themeReducer(initialState, themeActions.toggleTheme());

        expect(state.darkMode).toBe(true);
        expect(localStorage.getItem('darkMode')).toBe('true');
    });
});
