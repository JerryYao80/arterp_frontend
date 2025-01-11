import { baseApi } from './baseApi';

interface Document {
  id: number;
  name: string;
  type: string;
  contentType: string;
  size: number;
  description?: string;
  category: string;
  status: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  ocrContent?: string;
  uploadedBy: string;
  uploadedAt: string;
  processedAt?: string;
  processedBy?: string;
  tags?: string;
  url: string;
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

interface DocumentStats {
  categoryDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
}

declare module './baseApi' {
  export interface TagTypes {
    Document: 'Document';
  }
}

export const documentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchDocuments: builder.query<ApiResponse<PageResponse<Document>>, { search?: string; page?: number; size?: number }>({
      query: ({ search = '', page = 0, size = 10 }) =>
        `/documents/search?search=${search}&page=${page}&size=${size}`,
      providesTags: ['Document'],
    }),
    getDocument: builder.query<ApiResponse<Document>, number>({
      query: (id) => `/documents/${id}`,
      providesTags: ['Document'],
    }),
    uploadDocument: builder.mutation<ApiResponse<Document>, FormData>({
      query: (formData) => ({
        url: '/documents/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Document'],
    }),
    deleteDocument: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Document'],
    }),
    getDocumentsByEntity: builder.query<
      ApiResponse<Document[]>,
      { entityType: string; entityId: number }
    >({
      query: ({ entityType, entityId }) => `/documents/entity/${entityType}/${entityId}`,
      providesTags: ['Document'],
    }),
    getDocumentsByEntityAndCategory: builder.query<
      ApiResponse<Document[]>,
      { entityType: string; entityId: number; category: string }
    >({
      query: ({ entityType, entityId, category }) =>
        `/documents/entity/${entityType}/${entityId}/category/${category}`,
      providesTags: ['Document'],
    }),
    getDocumentStats: builder.query<ApiResponse<DocumentStats>, void>({
      query: () => ({
        url: '/documents/stats',
        method: 'GET',
      }),
    }),
  }),
}); 