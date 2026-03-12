import { createSlice } from '@reduxjs/toolkit';

const initialToken = localStorage.getItem('token');
const initialUserId = localStorage.getItem('userId');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    userId: initialUserId,
    isLoggedIn: !!initialToken,
    isPremium: localStorage.getItem('isPremium') === 'true',
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isLoggedIn = true;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userId', action.payload.userId);
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.isLoggedIn = false;
      state.isPremium = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('isPremium');
    },
    activatePremium: (state) => {
      state.isPremium = true;
      localStorage.setItem('isPremium', 'true');
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
