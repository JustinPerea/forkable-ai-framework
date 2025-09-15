import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../constants/config';
import { RootState } from './index';

export interface ProcessImageRequest {
  imageData: string; // base64 encoded image
  prompt?: string;
}

export interface ProcessImageResponse {
  success: boolean;
  processedImageUrl?: string;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  tokens: number;
  createdAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Image'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<AuthResponse, AuthRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, AuthRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Image processing endpoints
    processImage: builder.mutation<ProcessImageResponse, ProcessImageRequest>({
      query: (imageData) => ({
        url: '/process-image',
        method: 'POST',
        body: imageData,
      }),
      invalidatesTags: ['Image'],
    }),

    // User endpoints
    getUserProfile: builder.query<User, void>({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),

    // Health check
    healthCheck: builder.query<{ status: string }, void>({
      query: () => '/health',
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useProcessImageMutation,
  useGetUserProfileQuery,
  useHealthCheckQuery,
} = apiSlice;