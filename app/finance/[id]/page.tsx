'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import PageHeader from '../../../components/common/PageHeader';
import { financeApi } from '../../../api/financeApi';
import { businessApi } from '../../../api/businessApi';
import { useToast } from '../../../hooks/useToast';
import { useConfirm } from '../../../hooks/useConfirm';
import MainLayout from '../../../components/layout/MainLayout';

interface FinanceDetailsProps {
  params: {
    id: string;
  };
}

export default function FinanceDetailsPage({ params }: FinanceDetailsProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirm();
  const id = parseInt(params.id);

  const { data: transactionData, isLoading } = financeApi.useGetTransactionQuery(id);
  const { data: processData } = businessApi.useGetProcessQuery(
    transactionData?.data.processId || 0,
    { skip: !transactionData?.data.processId }
  );
  const [deleteTransaction] = financeApi.useDeleteTransactionMutation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const transaction = transactionData?.data;

  if (!transaction) {
    return <div>Transaction not found</div>;
  }

  const handleEdit = () => {
    router.push(`/finance/${id}/edit`);
  };

  const handleDelete = async () => {
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
        router.push('/finance');
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

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="Transaction Details"
          action={{
            label: 'Edit Transaction',
            icon: <EditIcon />,
            onClick: handleEdit,
          }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Transaction Information
                </Typography>
                <Tooltip title="Delete Transaction">
                  <IconButton color="error" onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {transaction.type === 'Income' ? (
                      <IncomeIcon color="success" />
                    ) : (
                      <ExpenseIcon color="error" />
                    )}
                    <Chip
                      label={transaction.type}
                      color={getTypeColor(transaction.type)}
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">{transaction.category}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body1">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(transaction.amount)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(transaction.date), 'PPP')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">{transaction.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body1">{transaction.notes}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {transaction.processId && processData?.data && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Related Process
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Process Type"
                      secondary={processData.data.processType}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Status"
                      secondary={
                        <Chip
                          label={processData.data.status}
                          color={
                            processData.data.status === 'Completed'
                              ? 'success'
                              : processData.data.status === 'In Progress'
                              ? 'warning'
                              : 'error'
                          }
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Start Date"
                      secondary={format(new Date(processData.data.startDate), 'PPP')}
                    />
                  </ListItem>
                </List>
                <Button
                  variant="outlined"
                  onClick={() => router.push(`/business/${transaction.processId}`)}
                >
                  View Process Details
                </Button>
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {transaction.documentUrls?.map((url, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Document ${index + 1}`}
                      secondary={url}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
} 