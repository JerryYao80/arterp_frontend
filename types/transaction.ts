export interface Transaction {
  id: number;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  notes: string;
  processId: number | null;
  documentUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionSearchParams {
  search?: string;
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  processId?: number;
  page?: number;
  size?: number;
}

export interface TransactionResponse {
  data: Transaction;
  message: string;
}

export interface TransactionListResponse {
  data: {
    content: Transaction[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  message: string;
}

export interface CreateTransactionDto {
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  date: string;
  description?: string;
  notes?: string;
  processId?: number | null;
  documentUrls?: string[];
}

export interface UpdateTransactionDto extends Partial<CreateTransactionDto> {} 