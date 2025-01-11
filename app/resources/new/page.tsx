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
import { resourceApi } from '../../api/resourceApi';
import { useToast } from '../../hooks/useToast';
import MainLayout from '../../components/layout/MainLayout';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Type is required'),
  status: yup.string().required('Status is required'),
  location: yup.string().required('Location is required'),
  description: yup.string(),
  lastMaintenanceDate: yup.string(),
  nextMaintenanceDate: yup.string(),
  specifications: yup.string(),
  notes: yup.string(),
});

export default function NewResourcePage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [createResource] = resourceApi.useCreateResourceMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      type: '',
      status: 'Available',
      location: '',
      description: '',
      lastMaintenanceDate: '',
      nextMaintenanceDate: '',
      specifications: '',
      notes: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await createResource({
        ...data,
        maintenanceHistory: [],
        documentUrls: [],
      }).unwrap();
      showSuccess('Resource created successfully');
      router.push(`/resources/${response.data.id}`);
    } catch (error) {
      showError('Failed to create resource');
    }
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader title="New Resource" />

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Resource Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.type}>
                      <InputLabel>Resource Type</InputLabel>
                      <Select {...field} label="Resource Type">
                        <MenuItem value="Equipment">Equipment</MenuItem>
                        <MenuItem value="Room">Room</MenuItem>
                        <MenuItem value="Staff">Staff</MenuItem>
                        <MenuItem value="Vehicle">Vehicle</MenuItem>
                      </Select>
                      <FormHelperText>{errors.type?.message}</FormHelperText>
                    </FormControl>
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
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="In Use">In Use</MenuItem>
                        <MenuItem value="Maintenance">Maintenance</MenuItem>
                        <MenuItem value="Unavailable">Unavailable</MenuItem>
                      </Select>
                      <FormHelperText>{errors.status?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Location"
                      fullWidth
                      error={!!errors.location}
                      helperText={errors.location?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="lastMaintenanceDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Maintenance Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.lastMaintenanceDate}
                      helperText={errors.lastMaintenanceDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="nextMaintenanceDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Next Maintenance Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.nextMaintenanceDate}
                      helperText={errors.nextMaintenanceDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="specifications"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Specifications"
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.specifications}
                      helperText={errors.specifications?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes"
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.notes}
                      helperText={errors.notes?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/resources')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Create Resource
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