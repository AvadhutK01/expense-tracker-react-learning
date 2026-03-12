import { describe, it, expect } from 'vitest';
import expensesReducer, { expensesActions } from './expensesSlice';

describe('expensesSlice', () => {
    it('3. should handle addExpense', () => {
        const initialState = { items: [] };
        const newExpense = { id: '1', amount: 100, description: 'Test', category: 'Food' };
        const state = expensesReducer(initialState, expensesActions.addExpense(newExpense));

        expect(state.items).toHaveLength(1);
        expect(state.items[0]).toEqual(newExpense);
    });
});
