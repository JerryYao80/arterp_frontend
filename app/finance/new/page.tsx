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
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageHeader from '../../components/common/PageHeader';
import { financeApi } from '../../api/financeApi';
import { businessApi } from '../../api/businessApi';
import { useToast } from '../../hooks/useToast';
import MainLayout from '../../components/layout/MainLayout';

const schema = yup.object().shape({
  type: yup.string().required('Type is required'),
  category: yup.string().required('Category is required'),
  amount: yup.number().required('Amount is required').min(0, 'Amount must be positive'),
  date: yup.string().required('Date is required'),
  description: yup.string(),
  notes: yup.string(),
  processId: yup.number().nullable(),
});

export default function NewTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processId = searchParams.get('processId');
  const { showSuccess, showError } = useToast();
  const [createTransaction] = financeApi.useCreateTransactionMutation();
  const { data: processesData } = businessApi.useSearchProcessesQuery({
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
      type: '',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      notes: '',
      processId: processId ? parseInt(processId) : null,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await createTransaction({
        ...data,
        amount: Number(data.amount),
        documentUrls: [],
      }).unwrap();
      showSuccess('Transaction created successfully');
      router.push(`/finance/${response.data.id}`);
    } catch (error) {
      showError('Failed to create transaction');
    }
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader title="New Transaction" />

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.type}>
                      <InputLabel>Transaction Type</InputLabel>
                      <Select {...field} label="Transaction Type">
                        <MenuItem value="Income">Income</MenuItem>
                        <MenuItem value="Expense">Expense</MenuItem>
                      </Select>
                      <FormHelperText>{errors.type?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category}>
                      <InputLabel>Category</InputLabel>
                      <Select {...field} label="Category">
                        <MenuItem value="Service Fee">Service Fee</MenuItem>
                        <MenuItem value="Consultation">Consultation</MenuItem>
                        <MenuItem value="Treatment">Treatment</MenuItem>
                        <MenuItem value="Medicine">Medicine</MenuItem>
                        <MenuItem value="Equipment">Equipment</MenuItem>
                        <MenuItem value="Maintenance">Maintenance</MenuItem>
                        <MenuItem value="Salary">Salary</MenuItem>
                        <MenuItem value="Utilities">Utilities</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                      <FormHelperText>{errors.category?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Amount"
                      type="number"
                      fullWidth
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.date}
                      helperText={errors.date?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="processId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={processesData?.data.content || []}
                      getOptionLabel={(option) => `${option.processType} - ${option.id}`}
                      value={
                        processesData?.data.content.find(
                          (process) => process.id === field.value
                        ) || null
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.id : null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Related Process"
                          error={!!errors.processId}
                          helperText={errors.processId?.message}
                        />
                      )}
                      disabled={!!processId}
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
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/finance')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Create Transaction
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