'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Visibility, Edit, Delete } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import { financeApi } from '../api/financeApi';
import { useTable } from '../hooks/useTable';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import MainLayout from '../components/layout/MainLayout';

export default function FinancePage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirm();
  const [transactionType, setTransactionType] = useState('');
  const {
    paginationModel,
    searchQuery,
    loading,
    totalRows,
    setLoading,
    setTotalRows,
    handlePaginationModelChange,
    handleSearchChange,
  } = useTable();

  const [deleteTransaction] = financeApi.useDeleteTransactionMutation();
  const { data: transactionsData, isLoading } = financeApi.useSearchTransactionsQuery({
    type: transactionType,
    search: searchQuery,
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });

  const handleView = (id: number) => {
    router.push(`/finance/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/finance/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Delete Transaction',
      message: 'Are you sure you want to delete this transaction? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteTransaction(id).unwrap();
        showSuccess('Transaction deleted successfully');
      } catch (error) {
        showError('Failed to delete transaction');
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Income':
        return 'success';
      case 'Expense':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getTypeColor(params.value)}
          size="small"
        />
      ),
    },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      valueFormatter: (params) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(params.value),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueFormatter: (params) => format(new Date(params.value), 'PPP'),
    },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'processId', headerName: 'Process ID', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton onClick={() => handleView(params.row.id)} size="small">
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row.id)} size="small">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row.id)} size="small">
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="Finance"
          subtitle="Manage your financial transactions"
          action={{
            label: 'Add Transaction',
            icon: <AddIcon />,
            onClick: () => router.push('/finance/new'),
          }}
        />

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            label="Search Transactions"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Transaction Type</InputLabel>
            <Select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              label="Transaction Type"
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <DataTable
          rows={transactionsData?.data.content || []}
          columns={columns}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          rowCount={transactionsData?.data.totalElements || 0}
        />
      </Box>
    </MainLayout>
  );
} 