import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  user: {
    id: number | null;
    username: string | null;
    roles: string[];
  };
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: {
    id: null,
    username: null,
    roles: [],
  },
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      if (token) {
        const decoded = jwtDecode<{ sub: string; id: number; roles: string[] }>(token);
        state.user = {
          id: decoded.id,
          username: decoded.sub,
          roles: decoded.roles,
        };
        localStorage.setItem('token', token);
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = {
        id: null,
        username: null,
        roles: [],
      };
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Type selectors
export type RootState = {
  auth: AuthState;
}; 