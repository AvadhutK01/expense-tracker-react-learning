import { createSlice } from '@reduxjs/toolkit';

const expensesSlice = createSlice({
    name: 'expenses',
    initialState: {
        items: [],
    },
    reducers: {
        setExpenses: (state, action) => {
            state.items = action.payload;
        },
        addExpense: (state, action) => {
            state.items = [action.payload, ...state.items];
        },
        removeExpense: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        updateExpense: (state, action) => {
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
    },
});

export const expensesActions = expensesSlice.actions;
export default expensesSlice.reducer;
