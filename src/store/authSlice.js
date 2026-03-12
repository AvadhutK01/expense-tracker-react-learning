import { createSlice } from '@reduxjs/toolkit';

const initialToken = localStorage.getItem('token');
const initialUserId = localStorage.getItem('userId');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    userId: initialUserId,
    isLoggedIn: !!initialToken,
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
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
