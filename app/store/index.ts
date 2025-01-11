import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../api/authApi';
import { customerApi } from '../api/customerApi';
import { businessApi } from '../api/businessApi';
import { resourceApi } from '../api/resourceApi';
import { financeApi } from '../api/financeApi';
import authReducer, { AuthState } from './authSlice';

export interface RootState {
  auth: AuthState;
  [authApi.reducerPath]: ReturnType<typeof authApi.reducer>;
  [customerApi.reducerPath]: ReturnType<typeof customerApi.reducer>;
  [businessApi.reducerPath]: ReturnType<typeof businessApi.reducer>;
  [resourceApi.reducerPath]: ReturnType<typeof resourceApi.reducer>;
  [financeApi.reducerPath]: ReturnType<typeof financeApi.reducer>;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [businessApi.reducerPath]: businessApi.reducer,
    [resourceApi.reducerPath]: resourceApi.reducer,
    [financeApi.reducerPath]: financeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      customerApi.middleware,
      businessApi.middleware,
      resourceApi.middleware,
      financeApi.middleware
    ),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch; 