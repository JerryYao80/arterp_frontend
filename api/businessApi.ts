import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Process,
  ProcessResponse,
  ProcessListResponse,
  ProcessSearchParams,
  CreateProcessDto,
  UpdateProcessDto,
  CreateStageDto,
  UpdateStageDto,
  CreateTaskDto,
  UpdateTaskDto,
} from '../types/process';

export const businessApi = createApi({
  reducerPath: 'businessApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/business' }),
  tagTypes: ['Process'],
  endpoints: (builder) => ({
    searchProcesses: builder.query<ProcessListResponse, ProcessSearchParams>({
      query: (params) => ({
        url: '/processes',
        method: 'GET',
        params,
      }),
      providesTags: ['Process'],
    }),

    getProcess: builder.query<ProcessResponse, number>({
      query: (id) => ({
        url: `/processes/${id}`,
        method: 'GET',
      }),
      providesTags: ['Process'],
    }),

    createProcess: builder.mutation<ProcessResponse, CreateProcessDto>({
      query: (process) => ({
        url: '/processes',
        method: 'POST',
        body: process,
      }),
      invalidatesTags: ['Process'],
    }),

    updateProcess: builder.mutation<
      ProcessResponse,
      { id: number; process: UpdateProcessDto }
    >({
      query: ({ id, process }) => ({
        url: `/processes/${id}`,
        method: 'PUT',
        body: process,
      }),
      invalidatesTags: ['Process'],
    }),

    deleteProcess: builder.mutation<void, number>({
      query: (id) => ({
        url: `/processes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Process'],
    }),

    createStage: builder.mutation<
      ProcessResponse,
      { processId: number; stage: CreateStageDto }
    >({
      query: ({ processId, stage }) => ({
        url: `/processes/${processId}/stages`,
        method: 'POST',
        body: stage,
      }),
      invalidatesTags: ['Process'],
    }),

    updateStage: builder.mutation<
      ProcessResponse,
      { processId: number; stageId: number; stage: UpdateStageDto }
    >({
      query: ({ processId, stageId, stage }) => ({
        url: `/processes/${processId}/stages/${stageId}`,
        method: 'PUT',
        body: stage,
      }),
      invalidatesTags: ['Process'],
    }),

    deleteStage: builder.mutation<void, { processId: number; stageId: number }>({
      query: ({ processId, stageId }) => ({
        url: `/processes/${processId}/stages/${stageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Process'],
    }),

    createTask: builder.mutation<
      ProcessResponse,
      { processId: number; stageId: number; task: CreateTaskDto }
    >({
      query: ({ processId, stageId, task }) => ({
        url: `/processes/${processId}/stages/${stageId}/tasks`,
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Process'],
    }),

    updateTask: builder.mutation<
      ProcessResponse,
      {
        processId: number;
        stageId: number;
        taskId: number;
        task: UpdateTaskDto;
      }
    >({
      query: ({ processId, stageId, taskId, task }) => ({
        url: `/processes/${processId}/stages/${stageId}/tasks/${taskId}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: ['Process'],
    }),

    deleteTask: builder.mutation<
      void,
      { processId: number; stageId: number; taskId: number }
    >({
      query: ({ processId, stageId, taskId }) => ({
        url: `/processes/${processId}/stages/${stageId}/tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Process'],
    }),
  }),
}); 