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
  Autocomplete,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageHeader from '../../../../../components/common/PageHeader';
import { businessApi } from '../../../../../api/businessApi';
import { resourceApi } from '../../../../../api/resourceApi';
import { useToast } from '../../../../../hooks/useToast';
import MainLayout from '../../../../../components/layout/MainLayout';

interface NewStagePageProps {
  params: {
    id: string;
  };
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  status: yup.string().required('Status is required'),
  sequence: yup.number().required('Sequence is required').min(1, 'Sequence must be positive'),
  startDate: yup.string().required('Start date is required'),
  expectedEndDate: yup.string(),
  budget: yup.number().required('Budget is required').min(0, 'Budget must be positive'),
  assignedResourceIds: yup.array().of(yup.number()),
  notes: yup.string(),
});

export default function NewStagePage({ params }: NewStagePageProps) {
  const router = useRouter();
  const processId = parseInt(params.id);
  const { showSuccess, showError } = useToast();
  const [createStage] = businessApi.useCreateStageMutation();
  const { data: resourcesData } = resourceApi.useSearchResourcesQuery({
    page: 0,
    size: 100,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      status: 'Pending',
      sequence: 1,
      startDate: new Date().toISOString().split('T')[0],
      expectedEndDate: '',
      budget: 0,
      assignedResourceIds: [],
      notes: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await createStage({
        processId,
        stage: {
          ...data,
          budget: Number(data.budget),
          spent: 0,
          tasks: [],
          documentUrls: [],
        },
      }).unwrap();
      showSuccess('Stage created successfully');
      router.push(`/business/${processId}`);
    } catch (error) {
      showError('Failed to create stage');
    }
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader title="New Stage" />

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
                      label="Stage Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
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
                  name="sequence"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Sequence"
                      type="number"
                      fullWidth
                      error={!!errors.sequence}
                      helperText={errors.sequence?.message}
                    />
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
                  name="budget"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Budget"
                      type="number"
                      fullWidth
                      error={!!errors.budget}
                      helperText={errors.budget?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="assignedResourceIds"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      options={resourcesData?.data.content || []}
                      getOptionLabel={(option) => option.name}
                      value={
                        resourcesData?.data.content.filter((resource) =>
                          field.value.includes(resource.id)
                        ) || []
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue.map((item) => item.id));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Assigned Resources"
                          error={!!errors.assignedResourceIds}
                          helperText={errors.assignedResourceIds?.message}
                        />
                      )}
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
                    onClick={() => router.push(`/business/${processId}`)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Create Stage
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