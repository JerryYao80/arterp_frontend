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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import PageHeader from '../../components/common/PageHeader';
import { businessApi } from '../../api/businessApi';
import { customerApi } from '../../api/customerApi';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';
import MainLayout from '../../components/layout/MainLayout';

interface BusinessProcessDetailsProps {
  params: {
    id: string;
  };
}

export default function BusinessProcessDetailsPage({ params }: BusinessProcessDetailsProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirm();
  const id = parseInt(params.id);

  const { data: processData, isLoading: isLoadingProcess } = businessApi.useGetProcessQuery(id);
  const { data: customerData, isLoading: isLoadingCustomer } = customerApi.useGetCustomerQuery(
    processData?.data.customerId || 0,
    { skip: !processData?.data.customerId }
  );
  const [deleteStage] = businessApi.useDeleteStageMutation();
  const [deleteTask] = businessApi.useDeleteTaskMutation();

  if (isLoadingProcess || isLoadingCustomer) {
    return <div>Loading...</div>;
  }

  const process = processData?.data;
  const customer = customerData?.data;

  if (!process) {
    return <div>Process not found</div>;
  }

  const handleEdit = () => {
    router.push(`/business/${id}/edit`);
  };

  const handleDeleteStage = async (stageId: number) => {
    const confirmed = await confirm({
      title: 'Delete Stage',
      message: 'Are you sure you want to delete this stage? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteStage(stageId).unwrap();
        showSuccess('Stage deleted successfully');
      } catch (error) {
        showError('Failed to delete stage');
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const confirmed = await confirm({
      title: 'Delete Task',
      message: 'Are you sure you want to delete this task? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteTask(taskId).unwrap();
        showSuccess('Task deleted successfully');
      } catch (error) {
        showError('Failed to delete task');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon color="success" />;
      case 'In Progress':
        return <ScheduleIcon color="warning" />;
      case 'Failed':
        return <WarningIcon color="error" />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="Process Details"
          action={{
            label: 'Edit Process',
            icon: <EditIcon />,
            onClick: handleEdit,
          }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Process Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Process Type
                  </Typography>
                  <Typography variant="body1">{process.processType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={process.status}
                    color={
                      process.status === 'Completed'
                        ? 'success'
                        : process.status === 'In Progress'
                        ? 'warning'
                        : 'error'
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(process.startDate), 'PPP')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Expected End Date
                  </Typography>
                  <Typography variant="body1">
                    {process.expectedEndDate
                      ? format(new Date(process.expectedEndDate), 'PPP')
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Budget
                  </Typography>
                  <Typography variant="body1">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(process.totalBudget)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Current Spent
                  </Typography>
                  <Typography variant="body1">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(process.currentSpent)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Process Stages</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => router.push(`/business/${id}/stages/new`)}
                >
                  Add Stage
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Stepper orientation="vertical">
                {process.stages.map((stage) => (
                  <Step key={stage.id} active={true}>
                    <StepLabel
                      icon={getStatusIcon(stage.status)}
                      optional={
                        <Typography variant="caption">
                          {format(new Date(stage.startDate), 'PPP')}
                        </Typography>
                      }
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">{stage.name}</Typography>
                        <Box>
                          <Tooltip title="Edit Stage">
                            <IconButton
                              size="small"
                              onClick={() => router.push(`/business/${id}/stages/${stage.id}/edit`)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Stage">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteStage(stage.id!)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {stage.notes}
                        </Typography>
                      </Box>
                      <List>
                        {stage.tasks.map((task) => (
                          <ListItem
                            key={task.id}
                            secondaryAction={
                              <Box>
                                <Tooltip title="Edit Task">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      router.push(
                                        `/business/${id}/stages/${stage.id}/tasks/${task.id}/edit`
                                      )
                                    }
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Task">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteTask(task.id!)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            }
                          >
                            <ListItemText
                              primary={task.name}
                              secondary={
                                <>
                                  <Typography variant="caption" display="block">
                                    {format(new Date(task.startDate), 'PPP')}
                                  </Typography>
                                  <Chip
                                    label={task.status}
                                    size="small"
                                    color={
                                      task.status === 'Completed'
                                        ? 'success'
                                        : task.status === 'In Progress'
                                        ? 'warning'
                                        : 'error'
                                    }
                                  />
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() =>
                          router.push(`/business/${id}/stages/${stage.id}/tasks/new`)
                        }
                        sx={{ mt: 2 }}
                      >
                        Add Task
                      </Button>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {customer && (
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Name"
                      secondary={customer.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Email"
                      secondary={customer.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Phone"
                      secondary={customer.phone}
                    />
                  </ListItem>
                </List>
              )}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push(`/customers/${process.customerId}`)}
              >
                View Customer Details
              </Button>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {process.documentUrls.map((url, index) => (
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