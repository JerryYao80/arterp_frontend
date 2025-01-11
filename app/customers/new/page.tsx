'use client';

import { useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageHeader from '../../components/common/PageHeader';
import { customerApi } from '../../api/customerApi';
import { useToast } from '../../hooks/useToast';
import MainLayout from '../../components/layout/MainLayout';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  status: yup.string().required('Status is required'),
  customerType: yup.string().required('Customer type is required'),
  riskLevel: yup.string().required('Risk level is required'),
  medicalHistory: yup.string(),
  familyHistory: yup.string(),
  requirements: yup.string(),
});

export default function NewCustomerPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [createCustomer] = customerApi.useCreateCustomerMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      status: 'Active',
      customerType: 'Individual',
      riskLevel: 'Low',
      medicalHistory: '',
      familyHistory: '',
      requirements: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await createCustomer(data).unwrap();
      showSuccess('Customer created successfully');
      router.push(`/customers/${response.data.id}`);
    } catch (error) {
      showError('Failed to create customer');
    }
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader title="New Customer" />

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.status}>
                      <InputLabel>Status</InputLabel>
                      <Select {...field} label="Status">
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                      </Select>
                      <FormHelperText>{errors.status?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="customerType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.customerType}>
                      <InputLabel>Customer Type</InputLabel>
                      <Select {...field} label="Customer Type">
                        <MenuItem value="Individual">Individual</MenuItem>
                        <MenuItem value="Corporate">Corporate</MenuItem>
                        <MenuItem value="VIP">VIP</MenuItem>
                      </Select>
                      <FormHelperText>{errors.customerType?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="riskLevel"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.riskLevel}>
                      <InputLabel>Risk Level</InputLabel>
                      <Select {...field} label="Risk Level">
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                      </Select>
                      <FormHelperText>{errors.riskLevel?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="medicalHistory"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Medical History"
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.medicalHistory}
                      helperText={errors.medicalHistory?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="familyHistory"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Family History"
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.familyHistory}
                      helperText={errors.familyHistory?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="requirements"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Requirements"
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.requirements}
                      helperText={errors.requirements?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/customers')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Create Customer
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </MainLayout>
  );
} 