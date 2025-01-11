import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Resource,
  ResourceResponse,
  ResourceListResponse,
  ResourceSearchParams,
} from '../types/resource';

export const resourceApi = createApi({
  reducerPath: 'resourceApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/resources' }),
  tagTypes: ['Resource'],
  endpoints: (builder) => ({
    searchResources: builder.query<ResourceListResponse, ResourceSearchParams>({
      query: (params) => ({
        url: '',
        method: 'GET',
        params,
      }),
      providesTags: ['Resource'],
    }),

    getResource: builder.query<ResourceResponse, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: ['Resource'],
    }),

    createResource: builder.mutation<ResourceResponse, Partial<Resource>>({
      query: (resource) => ({
        url: '',
        method: 'POST',
        body: resource,
      }),
      invalidatesTags: ['Resource'],
    }),

    updateResource: builder.mutation<
      ResourceResponse,
      { id: number; resource: Partial<Resource> }
    >({
      query: ({ id, resource }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: resource,
      }),
      invalidatesTags: ['Resource'],
    }),

    deleteResource: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resource'],
    }),
  }),
}); 