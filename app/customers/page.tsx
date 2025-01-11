'use client';

import { useState } from 'react';
import { Box, Button, TextField, IconButton, Tooltip } from '@mui/material';
import { Add as AddIcon, Visibility, Edit, Delete } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import { customerApi } from '../api/customerApi';
import { useTable } from '../hooks/useTable';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import MainLayout from '../components/layout/MainLayout';

export default function CustomersPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirm();
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

  const [deleteCustomer] = customerApi.useDeleteCustomerMutation();
  const { data: customersData, isLoading } = customerApi.useSearchCustomersQuery({
    search: searchQuery,
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });

  const handleView = (id: number) => {
    router.push(`/customers/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/customers/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Delete Customer',
      message: 'Are you sure you want to delete this customer? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteCustomer(id).unwrap();
        showSuccess('Customer deleted successfully');
      } catch (error) {
        showError('Failed to delete customer');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'customerType', headerName: 'Type', width: 120 },
    { field: 'riskLevel', headerName: 'Risk Level', width: 120 },
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
          title="Customers"
          subtitle="Manage your customers"
          action={{
            label: 'Add Customer',
            icon: <AddIcon />,
            onClick: () => router.push('/customers/new'),
          }}
        />

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Search Customers"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{ width: 300 }}
          />
        </Box>

        <DataTable
          rows={customersData?.data.content || []}
          columns={columns}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          rowCount={customersData?.data.totalElements || 0}
        />
      </Box>
    </MainLayout>
  );
} 