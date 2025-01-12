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
  phone: string;
  email: string;
  idType: string;
  idNumber: string;
  nationality: string;
  maritalStatus: string;
  medicalHistory?: string;
  familyHistory?: string;
  geneticScreening?: string;
  status: string;
  customerType: string;
  requirements?: string;
  preferences?: string;
  riskLevel: string;
  addresses: string[];
  documentUrls: string[];
  notes?: string;
  hasInsurance: boolean;
  insuranceInformation?: string;
  source: string;
  emergencyContact?: string;
  preferredLanguage: string;
  communicationPreference: string;
  marketingConsent: boolean;
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
  { value: 'SINGLE', label: 'Single' },
  { value: 'MARRIED', label: 'Married' },
  { value: 'DIVORCED', label: 'Divorced' },
  { value: 'WIDOWED', label: 'Widowed' },
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
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'PENDING', label: 'Pending' },
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

export default function NewCustomerPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [createCustomer] = customerApi.useCreateCustomerMutation();
  
  const { control, handleSubmit, formState: { errors } } = useForm<CustomerFormData>({
    defaultValues: {
      gender: 'MALE',
      birthDate: null,
      status: 'ACTIVE',
      customerType: 'INDIVIDUAL',
      riskLevel: 'LOW',
      addresses: [],
      documentUrls: [],
      hasInsurance: false,
      marketingConsent: false,
      preferredLanguage: 'ENGLISH',
      communicationPreference: 'EMAIL',
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
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  }}
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

              {/* Identification */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Identification</Typography>
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
                  name="nationality"
                  control={control}
                  rules={{ required: 'Nationality is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nationality"
                      fullWidth
                      error={!!errors.nationality}
                      helperText={errors.nationality?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="maritalStatus"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Marital Status"
                      fullWidth
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

              <Grid item xs={12} md={12}>
                <Controller
                  name="geneticScreening"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Genetic Screening"
                      multiline
                      rows={4}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {/* Customer Profile */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Customer Profile</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="customerType"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Customer Type"
                      fullWidth
                    >
                      {customerTypeOptions.map(option => (
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
                  name="riskLevel"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Risk Level"
                      fullWidth
                    >
                      {riskLevelOptions.map(option => (
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
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Status"
                      fullWidth
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
                  name="source"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Source"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {/* Requirements and Preferences */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Requirements and Preferences</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="requirements"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Requirements"
                      multiline
                      rows={4}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="preferences"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Preferences"
                      multiline
                      rows={4}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {/* Insurance Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Insurance Information</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="hasInsurance"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      }
                      label="Has Insurance"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="insuranceInformation"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Insurance Information"
                      multiline
                      rows={4}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {/* Contact Preferences */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Contact Preferences</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="preferredLanguage"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Preferred Language"
                      fullWidth
                    >
                      {languageOptions.map(option => (
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
                  name="communicationPreference"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Communication Preference"
                      fullWidth
                    >
                      {communicationOptions.map(option => (
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
                  name="emergencyContact"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Emergency Contact"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="marketingConsent"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      }
                      label="Marketing Consent"
                    />
                  )}
                />
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Additional Notes</Typography>
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