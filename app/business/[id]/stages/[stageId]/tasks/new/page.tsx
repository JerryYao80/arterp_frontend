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
import PageHeader from '../../../../../../../components/common/PageHeader';
import { businessApi } from '../../../../../../../api/businessApi';
import { resourceApi } from '../../../../../../../api/resourceApi';
import { useToast } from '../../../../../../../hooks/useToast';
import MainLayout from '../../../../../../../components/layout/MainLayout';

interface NewTaskPageProps {
  params: {
    id: string;
    stageId: string;
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
  description: yup.string(),
  notes: yup.string(),
  taskType: yup.string().required('Task type is required'),
  result: yup.string(),
  nextAction: yup.string(),
});

export default function NewTaskPage({ params }: NewTaskPageProps) {
  const router = useRouter();
  const processId = parseInt(params.id);
  const stageId = parseInt(params.stageId);
  const { showSuccess, showError } = useToast();
  const [createTask] = businessApi.useCreateTaskMutation();
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
      description: '',
      notes: '',
      taskType: '',
      result: '',
      nextAction: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await createTask({
        processId,
        stageId,
        task: {
          ...data,
          budget: Number(data.budget),
          spent: 0,
          documentUrls: [],
        },
      }).unwrap();
      showSuccess('Task created successfully');
      router.push(`/business/${processId}`);
    } catch (error) {
      showError('Failed to create task');
    }
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader title="New Task" />

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
                      label="Task Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="taskType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.taskType}>
                      <InputLabel>Task Type</InputLabel>
                      <Select {...field} label="Task Type">
                        <MenuItem value="Medical">Medical</MenuItem>
                        <MenuItem value="Administrative">Administrative</MenuItem>
                        <MenuItem value="Financial">Financial</MenuItem>
                        <MenuItem value="Legal">Legal</MenuItem>
                      </Select>
                      <FormHelperText>{errors.taskType?.message}</FormHelperText>
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
              <Grid item xs={12}>
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
                <Controller
                  name="result"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Result"
                      fullWidth
                      multiline
                      rows={2}
                      error={!!errors.result}
                      helperText={errors.result?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="nextAction"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Next Action"
                      fullWidth
                      multiline
                      rows={2}
                      error={!!errors.nextAction}
                      helperText={errors.nextAction?.message}
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
                    Create Task
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