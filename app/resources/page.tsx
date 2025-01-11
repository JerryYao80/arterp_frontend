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
import { resourceApi } from '../api/resourceApi';
import { useTable } from '../hooks/useTable';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import MainLayout from '../components/layout/MainLayout';

export default function ResourcesPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirm();
  const [resourceType, setResourceType] = useState('');
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

  const [deleteResource] = resourceApi.useDeleteResourceMutation();
  const { data: resourcesData, isLoading } = resourceApi.useSearchResourcesQuery({
    type: resourceType,
    search: searchQuery,
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });

  const handleView = (id: number) => {
    router.push(`/resources/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/resources/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Delete Resource',
      message: 'Are you sure you want to delete this resource? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteResource(id).unwrap();
        showSuccess('Resource deleted successfully');
      } catch (error) {
        showError('Failed to delete resource');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'In Use':
        return 'warning';
      case 'Maintenance':
        return 'info';
      case 'Unavailable':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'type', headerName: 'Type', width: 150 },
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
    { field: 'location', headerName: 'Location', width: 150 },
    {
      field: 'lastMaintenanceDate',
      headerName: 'Last Maintenance',
      width: 150,
      valueFormatter: (params) =>
        params.value ? format(new Date(params.value), 'PPP') : 'N/A',
    },
    {
      field: 'nextMaintenanceDate',
      headerName: 'Next Maintenance',
      width: 150,
      valueFormatter: (params) =>
        params.value ? format(new Date(params.value), 'PPP') : 'N/A',
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
          title="Resources"
          subtitle="Manage your resources"
          action={{
            label: 'Add Resource',
            icon: <AddIcon />,
            onClick: () => router.push('/resources/new'),
          }}
        />

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            label="Search Resources"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Resource Type</InputLabel>
            <Select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              label="Resource Type"
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Equipment">Equipment</MenuItem>
              <MenuItem value="Room">Room</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="Vehicle">Vehicle</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <DataTable
          rows={resourcesData?.data.content || []}
          columns={columns}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          rowCount={resourcesData?.data.totalElements || 0}
        />
      </Box>
    </MainLayout>
  );
} 