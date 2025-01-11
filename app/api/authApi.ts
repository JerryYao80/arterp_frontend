import { baseApi } from './baseApi';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest extends LoginRequest {
  fullName: string;
  email: string;
  phone?: string;
  roles?: string[];
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    type: string;
    username: string;
    roles: string[];
  };
  code: number;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
  }),
}); 