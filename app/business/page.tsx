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
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import { businessApi } from '../api/businessApi';
import { useTable } from '../hooks/useTable';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import MainLayout from '../components/layout/MainLayout';

export default function BusinessProcessesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customerId');
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

  const [deleteProcess] = businessApi.useDeleteProcessMutation();
  const { data: processesData, isLoading } = customerId
    ? businessApi.useGetProcessesByCustomerQuery({
        customerId: parseInt(customerId),
        search: searchQuery,
        page: paginationModel.page,
        size: paginationModel.pageSize,
      })
    : businessApi.useSearchProcessesQuery({
        search: searchQuery,
        page: paginationModel.page,
        size: paginationModel.pageSize,
      });

  const handleView = (id: number) => {
    router.push(`/business/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/business/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Delete Process',
      message: 'Are you sure you want to delete this process? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteProcess(id).unwrap();
        showSuccess('Process deleted successfully');
      } catch (error) {
        showError('Failed to delete process');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Pending':
        return 'info';
      case 'Failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'processType', headerName: 'Type', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 150,
      valueFormatter: (params) => format(new Date(params.value), 'PPP'),
    },
    {
      field: 'expectedEndDate',
      headerName: 'Expected End',
      width: 150,
      valueFormatter: (params) =>
        params.value ? format(new Date(params.value), 'PPP') : 'N/A',
    },
    {
      field: 'totalBudget',
      headerName: 'Budget',
      width: 120,
      valueFormatter: (params) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(params.value),
    },
    {
      field: 'currentSpent',
      headerName: 'Spent',
      width: 120,
      valueFormatter: (params) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(params.value),
    },
    {
      field: 'riskLevel',
      headerName: 'Risk Level',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getRiskLevelColor(params.value)}
          size="small"
        />
      ),
    },
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
          title="Business Processes"
          subtitle="Manage your business processes"
          action={{
            label: 'Add Process',
            icon: <AddIcon />,
            onClick: () => router.push('/business/new'),
          }}
        />

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            label="Search Processes"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{ width: 300 }}
          />
        </Box>

        <DataTable
          rows={processesData?.data.content || []}
          columns={columns}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          rowCount={processesData?.data.totalElements || 0}
        />
      </Box>
    </MainLayout>
  );
} 