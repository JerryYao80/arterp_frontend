import { baseApi } from './baseApi';

interface Customer {
  id: number;
  name: string;
  gender: string;
  birthDate: string;
  phone: string;
  email: string;
  idType: string;
  idNumber: string;
  nationality: string;
  maritalStatus: string;
  medicalHistory?: string;
  familyHistory?: string;
  geneticScreening?: string;
  status: string;
  customerType: string;
  requirements?: string;
  preferences?: string;
  riskLevel: string;
  addresses: string[];
  documentUrls: string[];
  notes?: string;
  hasInsurance: boolean;
  insuranceInformation?: string;
  source: string;
  emergencyContact?: string;
  preferredLanguage: string;
  communicationPreference: string;
  marketingConsent: boolean;
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

interface CustomerStats {
  totalCustomers: number;
  customerGrowth: number;
  typeDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  riskDistribution: Record<string, number>;
}

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchCustomers: builder.query<ApiResponse<PageResponse<Customer>>, { search?: string; page?: number; size?: number }>({
      query: ({ search = '', page = 0, size = 10 }) => 
        `/customers/search?search=${search}&page=${page}&size=${size}`,
      providesTags: ['Customer'],
    }),
    getCustomer: builder.query<ApiResponse<Customer>, number>({
      query: (id) => `/customers/${id}`,
      providesTags: ['Customer'],
    }),
    createCustomer: builder.mutation<ApiResponse<Customer>, Partial<Customer>>({
      query: (customer) => ({
        url: '/customers',
        method: 'POST',
        body: customer,
      }),
      invalidatesTags: ['Customer'],
    }),
    updateCustomer: builder.mutation<ApiResponse<Customer>, { id: number; customer: Partial<Customer> }>({
      query: ({ id, customer }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body: customer,
      }),
      invalidatesTags: ['Customer'],
    }),
    deleteCustomer: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),
    getStatusDistribution: builder.query<ApiResponse<Record<string, number>>, void>({
      query: () => '/customers/stats/status',
    }),
    getRiskLevelDistribution: builder.query<ApiResponse<Record<string, number>>, void>({
      query: () => '/customers/stats/risk-level',
    }),
    getCustomerStats: builder.query<ApiResponse<CustomerStats>, void>({
      query: () => '/stats',
    }),
  }),
}); 