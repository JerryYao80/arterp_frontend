'use client';

import { useEffect } from 'react';
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
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import PageHeader from '../../components/common/PageHeader';
import { customerApi } from '../../api/customerApi';
import { businessApi } from '../../api/businessApi';
import MainLayout from '../../components/layout/MainLayout';
import { format } from 'date-fns';

interface CustomerDetailsProps {
  params: {
    id: string;
  };
}

export default function CustomerDetailsPage({ params }: CustomerDetailsProps) {
  const router = useRouter();
  const id = parseInt(params.id);

  const { data: customerData, isLoading: isLoadingCustomer } = customerApi.useGetCustomerQuery(id);
  const { data: processesData, isLoading: isLoadingProcesses } = businessApi.useGetProcessesByCustomerQuery({
    customerId: id,
    page: 0,
    size: 5,
  });

  if (isLoadingCustomer || isLoadingProcesses) {
    return <div>Loading...</div>;
  }

  const customer = customerData?.data;
  const processes = processesData?.data.content;

  if (!customer) {
    return <div>Customer not found</div>;
  }

  const handleEdit = () => {
    router.push(`/customers/${id}/edit`);
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="Customer Details"
          action={{
            label: 'Edit Customer',
            icon: <EditIcon />,
            onClick: handleEdit,
          }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">{customer.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={customer.status}
                    color={
                      customer.status === 'Active'
                        ? 'success'
                        : customer.status === 'Inactive'
                        ? 'error'
                        : 'default'
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">{customer.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{customer.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Birth Date
                  </Typography>
                  <Typography variant="body1">
                    {customer.birthDate ? format(new Date(customer.birthDate), 'PPP') : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Risk Level
                  </Typography>
                  <Chip
                    label={customer.riskLevel}
                    color={
                      customer.riskLevel === 'Low'
                        ? 'success'
                        : customer.riskLevel === 'Medium'
                        ? 'warning'
                        : 'error'
                    }
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Medical History
                  </Typography>
                  <Typography variant="body1">
                    {customer.medicalHistory || 'No medical history recorded'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Family History
                  </Typography>
                  <Typography variant="body1">
                    {customer.familyHistory || 'No family history recorded'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Requirements
                  </Typography>
                  <Typography variant="body1">
                    {customer.requirements || 'No specific requirements'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Processes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {processes?.map((process) => (
                  <ListItem
                    key={process.id}
                    sx={{ px: 0 }}
                    secondaryAction={
                      <Chip
                        label={process.status}
                        size="small"
                        color={
                          process.status === 'Completed'
                            ? 'success'
                            : process.status === 'In Progress'
                            ? 'warning'
                            : 'error'
                        }
                      />
                    }
                  >
                    <ListItemText
                      primary={process.processType}
                      secondary={format(new Date(process.startDate), 'PPP')}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push(`/business?customerId=${id}`)}
                sx={{ mt: 2 }}
              >
                View All Processes
              </Button>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {customer.documentUrls?.map((url, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
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