import { baseApi } from './baseApi';

interface StageTask {
  id?: number;
  name: string;
  status: string;
  sequence: number;
  startDate: string;
  expectedEndDate?: string;
  actualEndDate?: string;
  budget: number;
  spent: number;
  assignedResourceIds: number[];
  description?: string;
  notes?: string;
  documentUrls: string[];
  taskType: string;
  result?: string;
  nextAction?: string;
}

interface ProcessStage {
  id?: number;
  name: string;
  status: string;
  sequence: number;
  startDate: string;
  expectedEndDate?: string;
  actualEndDate?: string;
  budget: number;
  spent: number;
  assignedResourceIds: number[];
  tasks: StageTask[];
  notes?: string;
  documentUrls: string[];
}

interface BusinessProcess {
  id?: number;
  customerId: number;
  processType: string;
  status: string;
  startDate: string;
  expectedEndDate?: string;
  actualEndDate?: string;
  totalBudget: number;
  currentSpent: number;
  assignedResourceIds: number[];
  stages: ProcessStage[];
  notes?: string;
  riskLevel: string;
  documentUrls: string[];
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code: number;
}

interface BusinessStats {
  activeProcesses: number;
  processGrowth: number;
  typeDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  riskDistribution: Record<string, number>;
}

export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchProcesses: builder.query<
      ApiResponse<PageResponse<BusinessProcess>>,
      { search?: string; page?: number; size?: number }
    >({
      query: ({ search = '', page = 0, size = 10 }) =>
        `/business/search?search=${search}&page=${page}&size=${size}`,
      providesTags: ['Business'],
    }),
    getProcessesByCustomer: builder.query<
      ApiResponse<PageResponse<BusinessProcess>>,
      { customerId: number; search?: string; page?: number; size?: number }
    >({
      query: ({ customerId, search = '', page = 0, size = 10 }) =>
        `/business/customer/${customerId}?search=${search}&page=${page}&size=${size}`,
      providesTags: ['Business'],
    }),
    getProcess: builder.query<ApiResponse<BusinessProcess>, number>({
      query: (id) => `/business/${id}`,
      providesTags: ['Business'],
    }),
    createProcess: builder.mutation<ApiResponse<BusinessProcess>, BusinessProcess>({
      query: (process) => ({
        url: '/business',
        method: 'POST',
        body: process,
      }),
      invalidatesTags: ['Business'],
    }),
    updateProcess: builder.mutation<
      ApiResponse<BusinessProcess>,
      { id: number; process: Partial<BusinessProcess> }
    >({
      query: ({ id, process }) => ({
        url: `/business/${id}`,
        method: 'PUT',
        body: process,
      }),
      invalidatesTags: ['Business'],
    }),
    deleteProcess: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/business/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Business'],
    }),
    // Stage endpoints
    createStage: builder.mutation<ApiResponse<ProcessStage>, { processId: number; stage: ProcessStage }>({
      query: ({ processId, stage }) => ({
        url: `/business/${processId}/stages`,
        method: 'POST',
        body: stage,
      }),
      invalidatesTags: ['Business'],
    }),
    updateStage: builder.mutation<
      ApiResponse<ProcessStage>,
      { processId: number; stageId: number; stage: Partial<ProcessStage> }
    >({
      query: ({ processId, stageId, stage }) => ({
        url: `/business/${processId}/stages/${stageId}`,
        method: 'PUT',
        body: stage,
      }),
      invalidatesTags: ['Business'],
    }),
    deleteStage: builder.mutation<ApiResponse<void>, number>({
      query: (stageId) => ({
        url: `/business/stages/${stageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Business'],
    }),
    // Task endpoints
    createTask: builder.mutation<
      ApiResponse<StageTask>,
      { processId: number; stageId: number; task: StageTask }
    >({
      query: ({ processId, stageId, task }) => ({
        url: `/business/${processId}/stages/${stageId}/tasks`,
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Business'],
    }),
    updateTask: builder.mutation<
      ApiResponse<StageTask>,
      { processId: number; stageId: number; taskId: number; task: Partial<StageTask> }
    >({
      query: ({ processId, stageId, taskId, task }) => ({
        url: `/business/${processId}/stages/${stageId}/tasks/${taskId}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: ['Business'],
    }),
    deleteTask: builder.mutation<ApiResponse<void>, number>({
      query: (taskId) => ({
        url: `/business/tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Business'],
    }),
    // Statistics endpoints
    getProcessTypeDistribution: builder.query<ApiResponse<Record<string, number>>, void>({
      query: () => '/business/stats/process-type',
    }),
    getStatusDistribution: builder.query<ApiResponse<Record<string, number>>, void>({
      query: () => '/business/stats/status',
    }),
    getRiskLevelDistribution: builder.query<ApiResponse<Record<string, number>>, void>({
      query: () => '/business/stats/risk-level',
    }),
    getBusinessStats: builder.query<ApiResponse<BusinessStats>, void>({
      query: () => '/stats',
    }),
  }),
}); 