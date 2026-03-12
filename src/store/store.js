import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import expensesReducer from './expensesSlice';
import themeReducer from './themeSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        expenses: expensesReducer,
        theme: themeReducer,
    },
});

export default store;
