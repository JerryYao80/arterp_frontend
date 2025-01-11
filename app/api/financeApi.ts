import { baseApi } from './baseApi';

interface Transaction {
  id?: number;
  type: string;  // Income, Expense
  category: string;
  amount: number;
  currency: string;
  status: string;  // Pending, Completed, Failed
  date: string;
  description?: string;
  relatedBusinessId?: number;
  relatedCustomerId?: number;
  relatedResourceId?: number;
  paymentMethod: string;
  paymentReference?: string;
  documentUrls: string[];
  notes?: string;
  createdBy: string;
  approvedBy?: string;
}

interface FinancialReport {
  period: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
  profitMargin: number;
  cashFlow: number;
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

interface FinanceStats {
  monthlyRevenue: number;
  revenueGrowth: number;
  typeDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  paymentMethodDistribution: Record<string, number>;
}

export const financeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchTransactions: builder.query<
      ApiResponse<PageResponse<Transaction>>,
      { search?: string; startDate?: string; endDate?: string; type?: string; page?: number; size?: number }
    >({
      query: ({ search = '', startDate, endDate, type, page = 0, size = 10 }) => {
        let url = `/finance/transactions/search?search=${search}&page=${page}&size=${size}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        if (type) url += `&type=${type}`;
        return url;
      },
      providesTags: ['Finance'],
    }),
    getTransaction: builder.query<ApiResponse<Transaction>, number>({
      query: (id) => `/finance/transactions/${id}`,
      providesTags: ['Finance'],
    }),
    createTransaction: builder.mutation<ApiResponse<Transaction>, Transaction>({
      query: (transaction) => ({
        url: '/finance/transactions',
        method: 'POST',
        body: transaction,
      }),
      invalidatesTags: ['Finance'],
    }),
    updateTransaction: builder.mutation<ApiResponse<Transaction>, { id: number; transaction: Partial<Transaction> }>({
      query: ({ id, transaction }) => ({
        url: `/finance/transactions/${id}`,
        method: 'PUT',
        body: transaction,
      }),
      invalidatesTags: ['Finance'],
    }),
    deleteTransaction: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/finance/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Finance'],
    }),
    getFinancialReport: builder.query<
      ApiResponse<FinancialReport>,
      { period: string; startDate?: string; endDate?: string }
    >({
      query: ({ period, startDate, endDate }) => {
        let url = `/finance/reports?period=${period}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        return url;
      },
    }),
    getIncomeDistribution: builder.query<ApiResponse<Record<string, number>>, void>({
      query: () => '/finance/stats/income',
    }),
    getExpenseDistribution: builder.query<ApiResponse<Record<string, number>>, void>({
      query: () => '/finance/stats/expense',
    }),
    getProfitTrend: builder.query<ApiResponse<Record<string, number>>, { period: string }>({
      query: ({ period }) => `/finance/stats/profit?period=${period}`,
    }),
    getFinanceStats: builder.query<ApiResponse<FinanceStats>, void>({
      query: () => '/stats',
    }),
  }),
}); 