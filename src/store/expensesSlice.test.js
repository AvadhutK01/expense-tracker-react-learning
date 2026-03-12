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

    it('12. should handle setExpenses', () => {
        const initialState = { items: [] };
        const expenses = [{ id: '1', amount: 100 }, { id: '2', amount: 200 }];
        const state = expensesReducer(initialState, expensesActions.setExpenses(expenses));

        expect(state.items).toHaveLength(2);
        expect(state.items).toEqual(expenses);
    });

    it('13. should handle removeExpense', () => {
        const initialState = { items: [{ id: '1' }, { id: '2' }] };
        const state = expensesReducer(initialState, expensesActions.removeExpense('1'));

        expect(state.items).toHaveLength(1);
        expect(state.items[0].id).toBe('2');
    });

    it('14. should handle updateExpense', () => {
        const initialState = { items: [{ id: '1', amount: 100 }] };
        const updated = { id: '1', amount: 150 };
        const state = expensesReducer(initialState, expensesActions.updateExpense(updated));

        expect(state.items[0].amount).toBe(150);
    });
});
