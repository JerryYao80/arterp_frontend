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
import { format } from 'date-fns';
import PageHeader from '../../../components/common/PageHeader';
import { businessApi } from '../../../api/businessApi';
import { useToast } from '../../../hooks/useToast';
import MainLayout from '../../../components/layout/MainLayout';

interface BusinessProcessEditProps {
  params: {
    id: string;
  };
}

const schema = yup.object().shape({
  processType: yup.string().required('Process type is required'),
  status: yup.string().required('Status is required'),
  startDate: yup.string().required('Start date is required'),
  expectedEndDate: yup.string(),
  totalBudget: yup.number().required('Total budget is required').min(0, 'Budget must be positive'),
  riskLevel: yup.string().required('Risk level is required'),
  notes: yup.string(),
});

export default function BusinessProcessEditPage({ params }: BusinessProcessEditProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const id = parseInt(params.id);

  const { data: processData, isLoading } = businessApi.useGetProcessQuery(id);
  const [updateProcess] = businessApi.useUpdateProcessMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      processType: '',
      status: '',
      startDate: '',
      expectedEndDate: '',
      totalBudget: 0,
      riskLevel: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (processData?.data) {
      const process = processData.data;
      reset({
        ...process,
        startDate: format(new Date(process.startDate), 'yyyy-MM-dd'),
        expectedEndDate: process.expectedEndDate
          ? format(new Date(process.expectedEndDate), 'yyyy-MM-dd')
          : '',
      });
    }
  }, [processData, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateProcess({
        id,
        process: {
          ...data,
          totalBudget: Number(data.totalBudget),
        },
      }).unwrap();
      showSuccess('Process updated successfully');
      router.push(`/business/${id}`);
    } catch (error) {
      showError('Failed to update process');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader title="Edit Process" />

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="processType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.processType}>
                      <InputLabel>Process Type</InputLabel>
                      <Select {...field} label="Process Type">
                        <MenuItem value="IVF">IVF</MenuItem>
                        <MenuItem value="Surrogacy">Surrogacy</MenuItem>
                        <MenuItem value="Egg Donation">Egg Donation</MenuItem>
                        <MenuItem value="Sperm Donation">Sperm Donation</MenuItem>
                      </Select>
                      <FormHelperText>{errors.processType?.message}</FormHelperText>
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
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Failed">Failed</MenuItem>
                      </Select>
                      <FormHelperText>{errors.status?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Start Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.startDate}
                      helperText={errors.startDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="expectedEndDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Expected End Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.expectedEndDate}
                      helperText={errors.expectedEndDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="totalBudget"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Total Budget"
                      type="number"
                      fullWidth
                      error={!!errors.totalBudget}
                      helperText={errors.totalBudget?.message}
                    />
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
                    onClick={() => router.push(`/business/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Save Changes
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