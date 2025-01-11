import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Transaction,
  TransactionResponse,
  TransactionListResponse,
  TransactionSearchParams,
  CreateTransactionDto,
  UpdateTransactionDto,
} from '../types/transaction';

export const financeApi = createApi({
  reducerPath: 'financeApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/finance' }),
  tagTypes: ['Transaction'],
  endpoints: (builder) => ({
    searchTransactions: builder.query<TransactionListResponse, TransactionSearchParams>({
      query: (params) => ({
        url: '/transactions',
        method: 'GET',
        params,
      }),
      providesTags: ['Transaction'],
    }),

    getTransaction: builder.query<TransactionResponse, number>({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'GET',
      }),
      providesTags: ['Transaction'],
    }),

    createTransaction: builder.mutation<TransactionResponse, CreateTransactionDto>({
      query: (transaction) => ({
        url: '/transactions',
        method: 'POST',
        body: transaction,
      }),
      invalidatesTags: ['Transaction'],
    }),

    updateTransaction: builder.mutation<
      TransactionResponse,
      { id: number; transaction: UpdateTransactionDto }
    >({
      query: ({ id, transaction }) => ({
        url: `/transactions/${id}`,
        method: 'PUT',
        body: transaction,
      }),
      invalidatesTags: ['Transaction'],
    }),

    deleteTransaction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transaction'],
    }),
  }),
}); 