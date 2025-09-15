import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants/config';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id: string;
    email: string;
    tokens: number;
  } | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  isLoading: true, // Start with loading true to check for stored token
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Store token securely
      SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, action.payload.token);
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // Remove stored token
      SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUserTokens: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.tokens = action.payload;
      }
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setLoading,
  updateUserTokens,
} = authSlice.actions;

export default authSlice.reducer;