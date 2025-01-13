'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { customerApi } from '@/app/api/customerApi';
import { useSnackbar } from 'notistack';

interface CustomerFormData {
  name: string;
  gender: string;
  birthDate: Date | null;
  address: string;
  occupation: string;
  idType: string;
  idNumber: string;
  source: string;
  phone: string;
  emergencyContact: string;
  donorRequirement?: string;
  gestationRequirement?: string;
  budget: number;
  expectedStartTime: Date | null;
  expectedEndTime: Date | null;
  recommendedPlan: string;
  medicalHistory?: string;
  familyHistory?: string;
  status: string;
  riskLevel: string;
  notes?: string;
  maritalStatus: string;
}

const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

const idTypeOptions = [
  { value: 'PASSPORT', label: 'Passport' },
  { value: 'ID_CARD', label: 'ID Card' },
  { value: 'DRIVERS_LICENSE', label: 'Driver\'s License' },
];

const maritalStatusOptions = [
  { value: 'SINGLE', label: '单身' },
  { value: 'MARRIED', label: '已婚' },
  { value: 'MINORITY', label: '少数' },
];

const customerTypeOptions = [
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'COUPLE', label: 'Couple' },
  { value: 'FAMILY', label: 'Family' },
];

const riskLevelOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

const statusOptions = [
  { value: 'UNFOLLOW', label: '未跟进' },
  { value: 'FOLLOWING', label: '跟进中' },
  { value: 'FOLLOWED', label: '已跟进' },
  { value: 'CONTRACTED', label: '已签约' },
];

const languageOptions = [
  { value: 'ENGLISH', label: 'English' },
  { value: 'CHINESE', label: 'Chinese' },
  { value: 'SPANISH', label: 'Spanish' },
];

const communicationOptions = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'PHONE', label: 'Phone' },
  { value: 'SMS', label: 'SMS' },
];

const recommendedPlanOptions = [
  { value: 'PLAN_1', label: '方案一' },
  { value: 'PLAN_2', label: '方案二' },
  { value: 'PLAN_3', label: '方案三' },
];

export default function NewCustomerPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [createCustomer] = customerApi.useCreateCustomerMutation();
  
  const { control, handleSubmit, formState: { errors } } = useForm<CustomerFormData>({
    defaultValues: {
      gender: 'MALE',
      birthDate: null,
      status: 'UNFOLLOW',
      maritalStatus: 'SINGLE',
      budget: 0,
      expectedStartTime: null,
      expectedEndTime: null,
      recommendedPlan: 'PLAN_1',
    }
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      const response = await createCustomer(data).unwrap();
      enqueueSnackbar('Customer created successfully', { variant: 'success' });
      router.push(`/customers/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create customer:', error);
      enqueueSnackbar('Failed to create customer', { variant: 'error' });
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="New Customer"
        subtitle="Create a new customer profile"
      />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Full Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Gender"
                      fullWidth
                    >
                      {genderOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Birth Date"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.birthDate,
                            helperText: errors.birthDate?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: 'Phone number is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: 'Address is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address"
                      fullWidth
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="occupation"
                  control={control}
                  rules={{ required: 'Occupation is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Occupation"
                      fullWidth
                      error={!!errors.occupation}
                      helperText={errors.occupation?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="idType"
                  control={control}
                  rules={{ required: 'ID Type is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="ID Type"
                      fullWidth
                      error={!!errors.idType}
                      helperText={errors.idType?.message}
                    >
                      {idTypeOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="idNumber"
                  control={control}
                  rules={{ required: 'ID Number is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ID Number"
                      fullWidth
                      error={!!errors.idNumber}
                      helperText={errors.idNumber?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="source"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Source"
                      fullWidth
                      error={!!errors.source}
                      helperText={errors.source?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="emergencyContact"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Emergency Contact"
                      fullWidth
                      error={!!errors.emergencyContact}
                      helperText={errors.emergencyContact?.message}
                    />
                  )}
                />
              </Grid>

              {/* Service Requirements */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Service Requirements</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="donorRequirement"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Donor Requirement"
                      multiline
                      rows={4}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="gestationRequirement"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Gestation Requirement"
                      multiline
                      rows={4}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="budget"
                  control={control}
                  rules={{ 
                    required: 'Budget is required',
                    min: { value: 0, message: 'Budget must be positive' }
                  }}
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

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="expectedStartTime"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Expected Start Time"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.expectedStartTime,
                            helperText: errors.expectedStartTime?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="expectedEndTime"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Expected End Time"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.expectedEndTime,
                            helperText: errors.expectedEndTime?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="recommendedPlan"
                  control={control}
                  rules={{ required: 'Recommended Plan is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Recommended Plan"
                      fullWidth
                      error={!!errors.recommendedPlan}
                      helperText={errors.recommendedPlan?.message}
                    >
                      {recommendedPlanOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              {/* Medical Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Medical Information</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="medicalHistory"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Medical History"
                      multiline
                      rows={4}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="familyHistory"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Family History"
                      multiline
                      rows={4}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Notes</Typography>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes"
                      multiline
                      rows={4}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: '跟踪状态是必填的' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="跟踪状态"
                      fullWidth
                      error={!!errors.status}
                      helperText={errors.status?.message}
                    >
                      {statusOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="maritalStatus"
                  control={control}
                  rules={{ required: '婚姻状态是必填的' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="婚姻状态"
                      fullWidth
                      error={!!errors.maritalStatus}
                      helperText={errors.maritalStatus?.message}
                    >
                      {maritalStatusOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Create Customer
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </MainLayout>
  );
} 